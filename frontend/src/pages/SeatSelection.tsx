import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Film, Calendar, Clock, MapPin, Users, Ticket, ArrowLeft, Lock, CheckCircle, Loader2, AlertCircle, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import showtimeService from '../services/showtime.service';
import reservationService from '../services/reservation.service';
import { Showtime, SeatAvailability, SelectedAddOn } from '../types';
import { useSeatStore } from '../store/seatStore';
import { useAuthStore } from '../store/authStore';
import SeatMap from '../components/SeatMap';
import Timer from '../components/Timer';
import AddOnsSelection from '../components/AddOnsSelection';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const SeatSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedSeats, setSelectedSeats, lockExpiry, setLockExpiry, clearSeats } = useSeatStore();
  const { refreshUser } = useAuthStore();

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seatAvailability, setSeatAvailability] = useState<SeatAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [currentStep, setCurrentStep] = useState<'seats' | 'addons'>('seats');
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);

  useEffect(() => {
    loadShowtimeData();
    return () => {
      clearSeats();
    };
  }, [id]);

  useEffect(() => {
    if (currentStep === 'seats') {
      const interval = setInterval(loadSeatAvailability, 3000);
      return () => clearInterval(interval);
    }
  }, [id, currentStep]);

  const loadShowtimeData = async () => {
    if (!id) return;

    try {
      const data = await showtimeService.getShowtimeById(id);
      setShowtime(data);
      await loadSeatAvailability();
    } catch (error: any) {
      toast.error('Failed to load showtime');
    } finally {
      setLoading(false);
    }
  };

  const loadSeatAvailability = async () => {
    if (!id) return;

    try {
      const data = await reservationService.getSeatAvailability(id);
      setSeatAvailability(data);
    } catch (error: any) {
      console.error('Failed to refresh seat availability');
    }
  };

  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleLockSeats = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    try {
      const result = await reservationService.lockSeats(id!, selectedSeats);
      setLockExpiry(new Date(result.expiresAt));
      toast.success('Seats locked! Proceeding to add-ons...');
      await loadSeatAvailability();
      setCurrentStep('addons');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to lock seats');
    }
  };

  const handleConfirmReservation = async () => {
    if (!lockExpiry) {
      toast.error('Please lock seats first');
      return;
    }

    setConfirming(true);
    try {
      await reservationService.confirmReservation(id!, selectedSeats, selectedAddOns);
      await refreshUser();
      toast.success('Reservation confirmed!');
      clearSeats();
      navigate('/reservations');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to confirm reservation');
    } finally {
      setConfirming(false);
    }
  };

  const handleExpire = () => {
    toast.error('Your seat lock has expired. Please select again.');
    clearSeats();
    loadSeatAvailability();
  };

  const getSeatsPrice = (): number => {
    if (!seatAvailability) return 0;
    return selectedSeats.reduce((total, seatId) => {
      const seat = seatAvailability.seatMap.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const getAddOnsPrice = (): number => {
    return selectedAddOns.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getTotalPrice = (): number => {
    return getSeatsPrice() + getAddOnsPrice();
  };

  if (loading || !showtime || !seatAvailability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <div className="text-white text-2xl font-semibold">Loading seats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 lg:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              {showtime.movieId.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span className="font-medium">{showtime.theaterHall}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span className="font-medium">{new Date(showtime.startTime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="font-medium">{new Date(showtime.startTime).toLocaleTimeString()}</span>
            </div>
          </div>

          {seatAvailability.almostFull && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg">
              <AlertCircle className="w-5 h-5" />
              Almost Full - Book Now!
            </div>
          )}
        </div>

        {lockExpiry && (
          <div className="mb-6">
            <Timer expiry={lockExpiry} onExpire={handleExpire} />
          </div>
        )}

        {lockExpiry && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setCurrentStep('seats')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                currentStep === 'seats'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              1. Seats
            </button>
            <button
              onClick={() => setCurrentStep('addons')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                currentStep === 'addons'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              2. Add-ons
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentStep === 'seats' ? (
              <SeatMap
                seats={seatAvailability.seatMap}
                onSeatClick={handleSeatClick}
              />
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <AddOnsSelection
                  selectedAddOns={selectedAddOns}
                  onAddOnsChange={setSelectedAddOns}
                />
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 h-fit shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Ticket className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">
                Booking Summary
              </h2>
            </div>

            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-amber-500" />
                <div className="text-gray-400 text-sm font-medium">Selected Seats</div>
              </div>
              <div className="text-white font-bold text-lg">
                {selectedSeats.length === 0 ? (
                  <span className="text-gray-500">No seats selected</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 rounded-lg text-sm shadow-lg">
                        {seat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Seats</span>
                  <span className="text-white font-semibold">{formatCurrency(getSeatsPrice())}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Add-ons</span>
                    <span className="text-white font-semibold">{formatCurrency(getAddOnsPrice())}</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-semibold">Total</span>
                    <span className="text-amber-500 font-bold text-2xl">
                      {formatCurrency(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {!lockExpiry ? (
                <button
                  onClick={handleLockSeats}
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
                >
                  <Lock className="w-5 h-5" />
                  Lock Seats & Continue
                </button>
              ) : currentStep === 'seats' ? (
                <button
                  onClick={() => setCurrentStep('addons')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
                >
                  Continue to Add-ons
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleConfirmReservation}
                    disabled={confirming}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all"
                  >
                    {confirming ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setCurrentStep('seats')}
                    className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Seats
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    disabled={confirming}
                    className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    Skip Add-ons & Confirm
                  </button>
                </>
              )}

              {!lockExpiry && (
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-amber-500" />
                <p className="font-bold text-white text-sm">Important Information</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Seats are held for 5 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Complete payment before timer expires</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Earn 1 reward point per booking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
