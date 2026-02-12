import { Response } from "express";
import { AuthRequest } from "../types";
import reservationService from "../services/reservation.service";
import Reservation from "../models/Reservation";
// import { ReservationStatus } from '../types';

export class ReservationController {
  /**
   * Lock seats temporarily
   */
  async lockSeats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { showtimeId, seats } = req.body;
      const userId = req.user!.userId;

      const result = await reservationService.lockSeats(
        showtimeId,
        userId,
        seats,
      );

      res.json({
        message: "Seats locked successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Confirm reservation
   */
  async confirmReservation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { showtimeId, seats, selectedAddOns } = req.body;
      const userId = req.user!.userId;

      const reservation = await reservationService.confirmReservation(
        showtimeId,
        userId,
        seats,
        selectedAddOns,
      );

      res.status(201).json({
        message: "Reservation confirmed successfully",
        reservation,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get seat availability for a showtime
   */
  async getSeatAvailability(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const availability = await reservationService.getSeatAvailability(
        id,
        userId,
      );

      res.json(availability);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get user's reservations
   */
  async getUserReservations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const reservations = await Reservation.find({ userId })
        .populate({
          path: "showtimeId",
          populate: { path: "movieId" },
        })
        .sort({ createdAt: -1 });

      res.json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const reservation = await reservationService.cancelReservation(
        id,
        userId,
      );

      res.json({
        message: "Reservation cancelled successfully",
        reservation,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Kiosk booking simulation
   */
  async kioskBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { showtimeId, seats, kioskId } = req.body;

      const result = await reservationService.kioskBooking(
        showtimeId,
        seats,
        kioskId,
      );

      res.status(201).json({
        message: "Kiosk booking successful",
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ReservationController();
