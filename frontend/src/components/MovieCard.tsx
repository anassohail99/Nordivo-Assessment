import { Movie } from '../types';
import movieService from '../services/movie.service';
import { Link } from 'react-router-dom';
import { Star, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie._id}`}
      className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-[2/3]">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
        <img
          src={movieService.getImageUrl(movie.posterPath)}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-3 right-3 z-20">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg">
            <Star className="w-4 h-4 fill-white text-white" />
            <span className="text-white font-bold text-sm">{movie.voteAverage.toFixed(1)}</span>
          </div>
        </div>

        {movie.voteAverage >= 7.5 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-lg">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-xs">Trending</span>
            </div>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{new Date(movie.releaseDate).getFullYear()}</span>
        </div>
        <div className="pt-3 border-t border-slate-700/50">
          <span className="inline-flex items-center text-amber-500 text-sm font-semibold group-hover:gap-2 transition-all">
            View Showtimes
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
