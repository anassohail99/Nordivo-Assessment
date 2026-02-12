import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Film, User, LogOut, Ticket, Star } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Film className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-semibold text-white">
              CineReserve
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  <Film className="w-5 h-5" />
                  <span>Movies</span>
                </Link>
                <Link
                  to="/reservations"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  <Ticket className="w-5 h-5" />
                  <span>My Bookings</span>
                </Link>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <div className="text-white font-medium">{user?.name}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {user?.rewardPoints} points
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
