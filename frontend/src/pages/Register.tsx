import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Film, Mail, Lock, User, Loader2, Ticket } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      toast.success('Welcome to CineReserve!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
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
            Begin Your Cinema
            <span className="block text-amber-500">Journey Today</span>
          </h2>

          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Join thousands of movie enthusiasts who trust CineReserve for their entertainment needs.
            Create an account to unlock exclusive benefits and seamless booking.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Ticket className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Priority Booking</p>
                <p className="text-sm text-slate-400">Get first access to new releases</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Film className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Personalized Experience</p>
                <p className="text-sm text-slate-400">Tailored recommendations just for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 bg-slate-900 p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  minLength={6}
                  required
                />
              </div>
              <p className="text-slate-500 text-xs mt-2">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
