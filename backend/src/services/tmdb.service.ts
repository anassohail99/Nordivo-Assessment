import axios from 'axios';
import redis, { RedisKeys } from '../utils/redis';
import { TMDBMovie } from '../types';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const CACHE_TTL = 3600; // 1 hour in seconds

export class TMDBService {
  private apiKey: string;

  constructor() {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is not defined');
    }
    this.apiKey = TMDB_API_KEY;
  }

  /**
   * Fetch now playing movies from TMDB with Redis caching
   */
  async getNowPlayingMovies(page: number = 1): Promise<{ results: TMDBMovie[]; total_pages: number }> {
    const cacheKey = RedisKeys.tmdbMovies(page);

    try {
      // Check cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`Cache hit for TMDB movies page ${page}`);
        return JSON.parse(cached);
      }

      // Fetch from TMDB API
      const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          page
        }
      });

      const data = {
        results: response.data.results,
        total_pages: response.data.total_pages
      };

      // Cache the result
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
      console.log(`Cached TMDB movies page ${page}`);

      return data;
    } catch (error: any) {
      console.error('Error fetching TMDB movies:', error.message);
      throw new Error('Failed to fetch movies from TMDB');
    }
  }

  /**
   * Fetch movie details by TMDB ID
   */
  async getMovieDetails(tmdbId: number): Promise<TMDBMovie> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching movie details:', error.message);
      throw new Error('Failed to fetch movie details');
    }
  }

  /**
   * Get image URL for posters and backdrops
   */
  getImageUrl(path: string, size: 'w500' | 'original' = 'w500'): string {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export default new TMDBService();
