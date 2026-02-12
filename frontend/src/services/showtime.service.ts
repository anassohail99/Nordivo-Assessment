import api from './api';
import { Showtime } from '../types';

class ShowtimeService {
  async getShowtimes(movieId?: string): Promise<Showtime[]> {
    const url = movieId ? `/showtimes?movieId=${movieId}` : '/showtimes';
    const response = await api.get(url);
    return response.data;
  }

  async getShowtimeById(id: string): Promise<Showtime> {
    const response = await api.get(`/showtimes/${id}`);
    return response.data;
  }
}

export default new ShowtimeService();
