import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from '../utils/database';
import Movie from '../models/Movie';
import Showtime from '../models/Showtime';
import { Seat } from '../types';

const createShowtimes = async () => {
  try {
    await connectDatabase();

    console.log('Fetching movies from database...');
    const movies = await Movie.find();

    if (movies.length === 0) {
      console.log('No movies found. Please run the app first to sync movies from TMDB.');
      process.exit(0);
    }

    console.log(`Found ${movies.length} movies. Creating showtimes for all movies...`);

    const halls = ['Hall 1', 'Hall 2', 'Hall 3', 'IMAX', 'VIP Cinema'];
    const today = new Date();

    for (const movie of movies) {
      for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        for (let timeSlot = 0; timeSlot < 2; timeSlot++) {
          const startTime = new Date(today);
          startTime.setDate(today.getDate() + dayOffset);
          startTime.setHours(14 + (timeSlot * 4), 0, 0, 0);

          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + 2, 30, 0, 0);

          const rows = 8;
          const seatsPerRow = 12;
          const seats: Seat[] = [];

          for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= seatsPerRow; col++) {
              let type: 'standard' | 'premium' | 'vip' = 'standard';
              let price = 10;

              if (row >= Math.floor(rows / 3) && row <= Math.ceil(rows * 2 / 3)) {
                type = 'premium';
                price = 15;
              }

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
            }
          }

          const showtime = new Showtime({
            movieId: movie._id,
            theaterHall: halls[Math.floor(Math.random() * halls.length)],
            startTime,
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
          console.log(`Created showtime for ${movie.title} on ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`);
        }
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

createShowtimes();
