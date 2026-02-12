import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movie.service';
import showtimeService from '../services/showtime.service';
import { Movie, Showtime } from '../types';
import { formatDate, formatTime } from '../utils/formatters';
import toast from 'react-hot-toast';
import { Star, Calendar, Clock, MapPin, Users, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieData();
  }, [id]);

  const loadMovieData = async () => {
    if (!id) return;

    try {
      const [movieData, showtimesData] = await Promise.all([
        movieService.getMovieById(id),
        showtimeService.getShowtimes(id)
      ]);
      setMovie(movieData);
      setShowtimes(showtimesData);
    } catch (error: any) {
      toast.error('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-2xl font-medium">Loading movie details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[500px] lg:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movieService.getImageUrl(movie.backdropPath || movie.posterPath, 'original')})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-end pb-12 lg:pb-16">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-end">
            <div className="relative">
              <img
                src={movieService.getImageUrl(movie.posterPath)}
                alt={movie.title}
                className="w-48 h-72 lg:w-64 lg:h-96 object-cover rounded-xl border-2 border-slate-700 shadow-2xl"
              />
            </div>
            <div className="text-white flex-1 pb-0 lg:pb-4">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 lg:gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <Star className="w-5 h-5 fill-white text-white" />
                  <span className="text-white font-bold text-lg">{movie.voteAverage.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg lg:text-xl font-medium">{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                {movie.voteAverage >= 7.5 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">Trending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
            Overview
          </h2>
          <p className="text-gray-300 text-base lg:text-lg leading-relaxed max-w-4xl">{movie.overview}</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
            Available Showtimes
          </h2>
          {showtimes.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No showtimes available for this movie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showtimes.map(showtime => (
                <div
                  key={showtime._id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-amber-500/50 rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-amber-500/10"
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-white font-bold text-xl mb-2">
                      <Calendar className="w-5 h-5 text-amber-500" />
                      {formatDate(showtime.startTime)}
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatTime(showtime.startTime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {showtime.theaterHall}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Seats Available</span>
                      </div>
                      <span className="text-white font-bold">
                        {showtime.availableSeats} / {showtime.totalSeats}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                        style={{ width: `${(showtime.availableSeats / showtime.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                    {showtime.availableSeats <= showtime.totalSeats * 0.2 && (
                      <div className="mt-3 flex items-center gap-2 text-red-500 font-bold text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Almost Full - Book Now!
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/seats/${showtime._id}`)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
                  >
                    Select Seats
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
