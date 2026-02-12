import { useEffect, useState } from 'react';
import movieService from '../services/movie.service';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import toast from 'react-hot-toast';
import { Film, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await movieService.getMovies(page);
      setMovies(data.movies);
      setTotalPages(data.total_pages);
    } catch (error: any) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-2xl font-medium">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Film className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Now Playing
              </h1>
              <p className="text-gray-400 text-sm lg:text-base mt-1">Discover the latest blockbusters and reserve your seats</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 transition-all shadow-lg shadow-amber-500/20"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
            <span className="text-white font-medium">
              Page <span className="text-amber-500 font-bold">{page}</span> of <span className="text-amber-500 font-bold">{totalPages}</span>
            </span>
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 transition-all shadow-lg shadow-amber-500/20"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
