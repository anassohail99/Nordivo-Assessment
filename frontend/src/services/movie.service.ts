import api from './api';
import { Movie } from '../types';

class MovieService {
  async getMovies(page: number = 1): Promise<{ movies: Movie[]; page: number; total_pages: number }> {
    const response = await api.get(`/movies?page=${page}`);
    return response.data;
  }

  async getMovieById(id: string): Promise<Movie> {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  }

  getImageUrl(path: string, size: 'w500' | 'original' = 'w500'): string {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export default new MovieService();
