import { Request, Response } from 'express';
import tmdbService from '../services/tmdb.service';
import Movie from '../models/Movie';

export class MovieController {
  /**
   * Get movies from TMDB and sync to database
   */
  async getMovies(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;

      const { results, total_pages } = await tmdbService.getNowPlayingMovies(page);

      // Sync movies to database for reference
      const moviePromises = results.map(async (tmdbMovie) => {
        return Movie.findOneAndUpdate(
          { tmdbId: tmdbMovie.id },
          {
            tmdbId: tmdbMovie.id,
            title: tmdbMovie.title,
            overview: tmdbMovie.overview,
            posterPath: tmdbMovie.poster_path,
            backdropPath: tmdbMovie.backdrop_path,
            releaseDate: tmdbMovie.release_date,
            voteAverage: tmdbMovie.vote_average,
            genres: tmdbMovie.genre_ids,
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );
      });

      const movies = await Promise.all(moviePromises);

      res.json({
        movies,
        page,
        total_pages
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get single movie by ID
   */
  async getMovieById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const movie = await Movie.findById(id);
      if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }

      res.json(movie);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new MovieController();
