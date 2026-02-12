export interface User {
  id: string;
  email: string;
  name: string;
  rewardPoints: number;
}

export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
}

export interface Seat {
  id: string;
  row: number;
  column: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  status?: 'available' | 'booked' | 'locked-by-me' | 'locked-by-other';
}

export interface Showtime {
  _id: string;
  movieId: Movie;
  theaterHall: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  availableSeats: number;
  price: {
    standard: number;
    premium: number;
    vip: number;
  };
}

export interface AddOn {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'beverage' | 'accessory' | 'upgrade';
  image: string;
  available: boolean;
}

export interface SelectedAddOn {
  addOnId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  _id: string;
  userId: string;
  showtimeId: Showtime;
  seats: string[];
  selectedAddOns: SelectedAddOn[];
  status: 'pending' | 'confirmed' | 'expired' | 'cancelled';
  totalAmount: number;
  seatsAmount: number;
  addOnsAmount: number;
  rewardPointsEarned: number;
  createdAt: string;
  expiresAt: string;
  confirmedAt?: string;
}

export interface SeatAvailability {
  showtimeId: string;
  totalSeats: number;
  availableSeats: number;
  seatMap: Seat[];
  almostFull: boolean;
}
