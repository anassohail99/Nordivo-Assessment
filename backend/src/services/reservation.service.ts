import redis, { RedisKeys } from '../utils/redis';
import Showtime from '../models/Showtime';
import Reservation from '../models/Reservation';
import User from '../models/User';
import AddOn from '../models/AddOn';
import { ReservationStatus } from '../types';
import mongoose from 'mongoose';

const SEAT_LOCK_DURATION = parseInt(process.env.SEAT_LOCK_DURATION_MINUTES || '5') * 60; // Convert to seconds
const RESERVATION_EXPIRY = parseInt(process.env.RESERVATION_EXPIRY_MINUTES || '10') * 60 * 1000; // Convert to milliseconds

export class ReservationService {
  /**
   * Lock seats for a user (temporary hold before confirmation)
   */
  async lockSeats(showtimeId: string, userId: string, seatIds: string[]): Promise<{ success: boolean; expiresAt: Date; message?: string }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Validate showtime exists
      const showtime = await Showtime.findById(showtimeId).session(session);
      if (!showtime) {
        throw new Error('Showtime not found');
      }

      // Check if seats exist in showtime
      const validSeats = showtime.seats.filter(s => seatIds.includes(s.id));
      if (validSeats.length !== seatIds.length) {
        throw new Error('Some seats do not exist in this showtime');
      }

      // Check if seats are already booked in database
      const alreadyBooked = seatIds.some(seatId => showtime.bookedSeats.includes(seatId));
      if (alreadyBooked) {
        throw new Error('Some seats are already booked');
      }

      // Check for existing locks from other users using Redis
      const lockPattern = RedisKeys.seatLockPattern(showtimeId);
      const existingLocks = await redis.keys(lockPattern);

      for (const lockKey of existingLocks) {
        const lockData = await redis.get(lockKey);
        if (lockData) {
          const { userId: lockUserId, seats: lockedSeats } = JSON.parse(lockData);

          // Skip if this is the same user (allow them to modify their selection)
          if (lockUserId === userId) continue;

          // Check for conflicts with other users' locks
          const hasConflict = seatIds.some(seatId => lockedSeats.includes(seatId));
          if (hasConflict) {
            throw new Error('Some seats are currently being held by another user');
          }
        }
      }

      // Create lock in Redis
      const expiresAt = new Date(Date.now() + SEAT_LOCK_DURATION * 1000);
      const lockKey = RedisKeys.seatLock(showtimeId, userId);
      const lockData = {
        userId,
        seats: seatIds,
        expiresAt
      };

      await redis.setex(lockKey, SEAT_LOCK_DURATION, JSON.stringify(lockData));

      await session.commitTransaction();

      return { success: true, expiresAt };
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Confirm reservation and persist to database
   */
  async confirmReservation(
    showtimeId: string,
    userId: string,
    seatIds: string[],
    selectedAddOns?: Array<{ addOnId: string; quantity: number }>
  ): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verify lock exists
      const lockKey = RedisKeys.seatLock(showtimeId, userId);
      const lockData = await redis.get(lockKey);

      if (!lockData) {
        throw new Error('Seat lock has expired. Please select seats again');
      }

      const lock = JSON.parse(lockData);

      // Verify seats match the lock
      const seatsMatch = seatIds.length === lock.seats.length &&
                        seatIds.every(id => lock.seats.includes(id));

      if (!seatsMatch) {
        throw new Error('Selected seats do not match locked seats');
      }

      // Get showtime and verify seats are still available
      const showtime = await Showtime.findById(showtimeId).session(session);
      if (!showtime) {
        throw new Error('Showtime not found');
      }

      // Double-check seats are not booked (race condition protection)
      const alreadyBooked = seatIds.some(seatId => showtime.bookedSeats.includes(seatId));
      if (alreadyBooked) {
        throw new Error('Some seats were just booked by another user');
      }

      // Calculate seat amount
      const seatObjects = showtime.seats.filter(s => seatIds.includes(s.id));
      const seatsAmount = seatObjects.reduce((sum, seat) => sum + seat.price, 0);

      // Process add-ons if provided
      let addOnsAmount = 0;
      const processedAddOns: Array<{ addOnId: mongoose.Types.ObjectId; name: string; price: number; quantity: number }> = [];

      if (selectedAddOns && selectedAddOns.length > 0) {
        for (const item of selectedAddOns) {
          const addOn = await AddOn.findById(item.addOnId).session(session);
          if (!addOn || !addOn.available) {
            throw new Error(`Add-on ${item.addOnId} is not available`);
          }

          const itemTotal = addOn.price * item.quantity;
          addOnsAmount += itemTotal;

          processedAddOns.push({
            addOnId: new mongoose.Types.ObjectId(item.addOnId),
            name: addOn.name,
            price: addOn.price,
            quantity: item.quantity
          });
        }
      }

      const totalAmount = seatsAmount + addOnsAmount;

      // Create reservation
      const reservation = new Reservation({
        userId,
        showtimeId,
        seats: seatIds,
        selectedAddOns: processedAddOns,
        status: ReservationStatus.CONFIRMED,
        totalAmount,
        seatsAmount,
        addOnsAmount,
        rewardPointsEarned: 1, // 1 point per booking
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + RESERVATION_EXPIRY),
        confirmedAt: new Date()
      });

      await reservation.save({ session });

      // Update showtime: add to bookedSeats, decrease availableSeats
      showtime.bookedSeats.push(...seatIds);
      showtime.availableSeats = showtime.totalSeats - showtime.bookedSeats.length;
      await showtime.save({ session });

      // Award reward points to user
      await User.findByIdAndUpdate(
        userId,
        { $inc: { rewardPoints: 1 } },
        { session }
      );

      // Remove lock from Redis
      await redis.del(lockKey);

      await session.commitTransaction();

      return await reservation.populate(['showtimeId', 'userId']);
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get current seat availability including locks
   */
  async getSeatAvailability(showtimeId: string, userId?: string): Promise<any> {
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      throw new Error('Showtime not found');
    }

    // Get all locks for this showtime
    const lockPattern = RedisKeys.seatLockPattern(showtimeId);
    const lockKeys = await redis.keys(lockPattern);

    const lockedSeats: { [key: string]: string } = {}; // seatId -> userId

    for (const lockKey of lockKeys) {
      const lockData = await redis.get(lockKey);
      if (lockData) {
        const { userId: lockUserId, seats } = JSON.parse(lockData);
        seats.forEach((seatId: string) => {
          lockedSeats[seatId] = lockUserId;
        });
      }
    }

    // Build seat map with status
    const seatMap = showtime.seats.map(seat => ({
      id: seat.id,
      row: seat.row,
      column: seat.column,
      type: seat.type,
      price: seat.price,
      status: showtime.bookedSeats.includes(seat.id)
        ? 'booked'
        : lockedSeats[seat.id]
          ? (lockedSeats[seat.id] === userId ? 'locked-by-me' : 'locked-by-other')
          : 'available'
    }));

    return {
      showtimeId,
      totalSeats: showtime.totalSeats,
      availableSeats: showtime.availableSeats,
      seatMap,
      almostFull: showtime.availableSeats <= showtime.totalSeats * 0.2
    };
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(reservationId: string, userId: string): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const reservation = await Reservation.findById(reservationId).session(session);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.userId.toString() !== userId) {
        throw new Error('Unauthorized to cancel this reservation');
      }

      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new Error('Only confirmed reservations can be cancelled');
      }

      // Update reservation status
      reservation.status = ReservationStatus.CANCELLED;
      reservation.cancelledAt = new Date();
      await reservation.save({ session });

      // Free up seats in showtime
      const showtime = await Showtime.findById(reservation.showtimeId).session(session);
      if (showtime) {
        showtime.bookedSeats = showtime.bookedSeats.filter(
          seatId => !reservation.seats.includes(seatId)
        );
        showtime.availableSeats = showtime.totalSeats - showtime.bookedSeats.length;
        await showtime.save({ session });
      }

      // Deduct reward points from user
      await User.findByIdAndUpdate(
        userId,
        { $inc: { rewardPoints: -reservation.rewardPointsEarned } },
        { session }
      );

      await session.commitTransaction();

      return reservation;
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Kiosk booking (simulates concurrent physical bookings)
   */
  async kioskBooking(showtimeId: string, seatIds: string[], kioskId: string): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const showtime = await Showtime.findById(showtimeId).session(session);
      if (!showtime) {
        throw new Error('Showtime not found');
      }

      // Check seats exist
      const validSeats = showtime.seats.filter(s => seatIds.includes(s.id));
      if (validSeats.length !== seatIds.length) {
        throw new Error('Invalid seats');
      }

      // Check if booked
      const alreadyBooked = seatIds.some(seatId => showtime.bookedSeats.includes(seatId));
      if (alreadyBooked) {
        throw new Error('Seats already booked');
      }

      // Check for web locks
      const lockPattern = RedisKeys.seatLockPattern(showtimeId);
      const existingLocks = await redis.keys(lockPattern);

      for (const lockKey of existingLocks) {
        const lockData = await redis.get(lockKey);
        if (lockData) {
          const { seats: lockedSeats } = JSON.parse(lockData);
          const hasConflict = seatIds.some(seatId => lockedSeats.includes(seatId));
          if (hasConflict) {
            throw new Error('Seats are locked by online user');
          }
        }
      }

      // Calculate total
      const totalAmount = validSeats.reduce((sum, seat) => sum + seat.price, 0);

      // Create a system user reservation for kiosk
      const reservation = new Reservation({
        userId: new mongoose.Types.ObjectId(), // Dummy user for kiosk
        showtimeId,
        seats: seatIds,
        selectedAddOns: [],
        status: ReservationStatus.CONFIRMED,
        totalAmount,
        seatsAmount: totalAmount,
        addOnsAmount: 0,
        rewardPointsEarned: 0,
        confirmedAt: new Date(),
        expiresAt: new Date(Date.now() + RESERVATION_EXPIRY)
      });

      await reservation.save({ session });

      // Update showtime
      showtime.bookedSeats.push(...seatIds);
      showtime.availableSeats = showtime.totalSeats - showtime.bookedSeats.length;
      await showtime.save({ session });

      await session.commitTransaction();

      return { success: true, reservation, kioskId };
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default new ReservationService();
