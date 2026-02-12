import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface SeatPosition {
  row: number;
  column: number;
}

export interface Seat extends SeatPosition {
  id: string;
  type: 'standard' | 'premium' | 'vip';
  price: number;
}

export interface SeatLock {
  userId: string;
  seats: string[];
  expiresAt: Date;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}
