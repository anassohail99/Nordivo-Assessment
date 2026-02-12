import { useEffect, useState } from 'react';
import { Ticket, Calendar, Clock, MapPin, DollarSign, Award, X, Loader2, CheckCircle, AlertCircle, Film, ShoppingBag } from 'lucide-react';
import reservationService from '../services/reservation.service';
import { Reservation } from '../types';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';
import movieService from '../services/movie.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshUser } = useAuthStore();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getUserReservations();
      setReservations(data);
    } catch (error: any) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(id);
      await refreshUser();
      toast.success('Reservation cancelled');
      loadReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel reservation');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'cancelled':
        return 'bg-red-600';
      case 'expired':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'expired':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <div className="text-white text-2xl font-semibold">Loading reservations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 lg:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            My Reservations
          </h1>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 text-xl">No reservations found</div>
            <p className="text-gray-500 mt-2">Start booking your favorite movies!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map(reservation => (
              <div
                key={reservation._id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all shadow-xl"
              >
                <div className="md:flex">
                  <div className="md:w-56 relative overflow-hidden">
                    <img
                      src={movieService.getImageUrl(reservation.showtimeId.movieId.posterPath)}
                      alt={reservation.showtimeId.movieId.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                          {reservation.showtimeId.movieId.title}
                        </h2>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            <span className="font-medium">
                              {formatDate(reservation.showtimeId.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="font-medium">
                              {formatTime(reservation.showtimeId.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            <span className="font-medium">
                              {reservation.showtimeId.theaterHall}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`${getStatusColor(reservation.status)} text-white px-5 py-2.5 rounded-xl font-bold uppercase text-sm flex items-center gap-2 h-fit shadow-lg`}>
                        {getStatusIcon(reservation.status)}
                        {reservation.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Ticket className="w-4 h-4 text-amber-500" />
                          <div className="text-gray-400 text-sm font-medium">Seats</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {reservation.seats.map(seat => (
                            <span key={seat} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-amber-500" />
                          <div className="text-gray-400 text-sm font-medium">Total Amount</div>
                        </div>
                        <div className="space-y-1">
                          {reservation.seatsAmount !== undefined && (
                            <>
                              <div className="text-xs text-gray-400">
                                Seats: {formatCurrency(reservation.seatsAmount)}
                              </div>
                              {reservation.addOnsAmount > 0 && (
                                <div className="text-xs text-gray-400">
                                  Add-ons: {formatCurrency(reservation.addOnsAmount)}
                                </div>
                              )}
                            </>
                          )}
                          <div className="text-amber-500 font-bold text-2xl">
                            {formatCurrency(reservation.totalAmount)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          <div className="text-gray-400 text-sm font-medium">Reward Points</div>
                        </div>
                        <div className="text-amber-500 font-bold text-2xl">
                          +{reservation.rewardPointsEarned}
                        </div>
                      </div>
                    </div>

                    {reservation.selectedAddOns && reservation.selectedAddOns.length > 0 && (
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <ShoppingBag className="w-4 h-4 text-amber-500" />
                          <div className="text-gray-400 text-sm font-medium">Add-ons Purchased</div>
                        </div>
                        <div className="space-y-2">
                          {reservation.selectedAddOns.map((addOn, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-300">
                                {addOn.quantity}x {addOn.name}
                              </span>
                              <span className="text-white font-semibold">
                                {formatCurrency(addOn.price * addOn.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(reservation._id)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all"
                      >
                        <X className="w-5 h-5" />
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
