import api from './api';
import { Reservation, SeatAvailability, SelectedAddOn } from '../types';

class ReservationService {
  async lockSeats(showtimeId: string, seats: string[]): Promise<{ success: boolean; expiresAt: string }> {
    const response = await api.post('/reservations/lock', { showtimeId, seats });
    return response.data;
  }

  async confirmReservation(showtimeId: string, seats: string[], selectedAddOns?: SelectedAddOn[]): Promise<{ reservation: Reservation }> {
    const response = await api.post('/reservations/confirm', { showtimeId, seats, selectedAddOns });
    return response.data;
  }

  async getSeatAvailability(showtimeId: string): Promise<SeatAvailability> {
    const response = await api.get(`/seats/${showtimeId}/availability`);
    return response.data;
  }

  async getUserReservations(): Promise<Reservation[]> {
    const response = await api.get('/reservations/user');
    return response.data;
  }

  async cancelReservation(id: string): Promise<void> {
    await api.delete(`/reservations/${id}`);
  }
}

export default new ReservationService();
