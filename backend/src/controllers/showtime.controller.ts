import { Request, Response } from 'express';
import Showtime from '../models/Showtime';
import { Seat } from '../types';

export class ShowtimeController {
  /**
   * Get showtimes for a movie
   */
  async getShowtimes(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.query;

      const query: any = {};
      if (movieId) {
        query.movieId = movieId;
      }

      // Only show future showtimes
      query.startTime = { $gte: new Date() };

      const showtimes = await Showtime.find(query)
        .populate('movieId')
        .sort({ startTime: 1 });

      res.json(showtimes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get showtime by ID
   */
  async getShowtimeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const showtime = await Showtime.findById(id).populate('movieId');
      if (!showtime) {
        res.status(404).json({ error: 'Showtime not found' });
        return;
      }

      res.json(showtime);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create showtime (admin function for demo purposes)
   */
  async createShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { movieId, theaterHall, startTime, rows, seatsPerRow } = req.body;

      // Generate seat layout
      const seats: Seat[] = [];
      let seatNumber = 1;

      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= seatsPerRow; col++) {
          let type: 'standard' | 'premium' | 'vip' = 'standard';
          let price = 10;

          // Premium seats in middle rows
          if (row >= Math.floor(rows / 3) && row <= Math.ceil(rows * 2 / 3)) {
            type = 'premium';
            price = 15;
          }

          // VIP seats in back rows center columns
          if (row > Math.ceil(rows * 2 / 3) &&
              col > Math.floor(seatsPerRow / 3) &&
              col <= Math.ceil(seatsPerRow * 2 / 3)) {
            type = 'vip';
            price = 20;
          }

          seats.push({
            id: `${row}-${col}`,
            row,
            column: col,
            type,
            price
          });

          seatNumber++;
        }
      }

      const endTime = new Date(new Date(startTime).getTime() + 2.5 * 60 * 60 * 1000); // 2.5 hours

      const showtime = new Showtime({
        movieId,
        theaterHall,
        startTime: new Date(startTime),
        endTime,
        seats,
        totalSeats: seats.length,
        availableSeats: seats.length,
        bookedSeats: [],
        price: {
          standard: 10,
          premium: 15,
          vip: 20
        }
      });

      await showtime.save();

      res.status(201).json(showtime);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ShowtimeController();
