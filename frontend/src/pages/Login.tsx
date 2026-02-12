import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Film, Mail, Lock, Loader2, Ticket } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 bg-slate-950 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 border-l border-t border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-r border-b border-amber-500"></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-500 rounded-lg">
              <Film className="w-8 h-8 text-slate-950" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">CineReserve</h1>
              <p className="text-sm text-slate-400">Premium Cinema Experience</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Welcome Back to the
            <span className="block text-amber-500">Big Screen</span>
          </h2>

          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Your premier destination for booking the latest blockbusters and timeless classics.
            Reserve your perfect seat and enjoy an unforgettable cinema experience.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Ticket className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Easy Booking</p>
                <p className="text-sm text-slate-400">Reserve seats in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Film className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Latest Releases</p>
                <p className="text-sm text-slate-400">All your favorite movies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 bg-slate-900 p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
