import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Film, Ticket, User, LogOut, Menu, X, Star } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Film, label: 'Movies' },
    { path: '/reservations', icon: Ticket, label: 'My Bookings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-950 rounded-lg text-white hover:bg-amber-500 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-slate-950 border-r border-slate-800 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-72
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Film className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                CineReserve
              </h1>
              <p className="text-xs text-gray-500">Premium Cinema</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all
                ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-900'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* User Info Card */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">
                  {user?.name}
                </div>
                <div className="text-gray-500 text-xs truncate">{user?.email}</div>
              </div>
            </div>

            {/* Reward Points */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-xs text-gray-400">Reward Points</span>
              </div>
              <span className="text-amber-500 font-bold">{user?.rewardPoints}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl font-medium transition-all border border-red-600/20 hover:border-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
