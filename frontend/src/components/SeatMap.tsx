import { Seat } from '../types';
import { useSeatStore } from '../store/seatStore';
import { Crown, Sparkles, CheckCircle2, X, Lock } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seatId: string) => void;
}

const SeatMap = ({ seats, onSeatClick }: SeatMapProps) => {
  const { selectedSeats } = useSeatStore();

  const maxRow = Math.max(...seats.map(s => s.row));
  const maxCol = Math.max(...seats.map(s => s.column));

  const getSeatColor = (seat: Seat): string => {
    if (seat.status === 'booked') return 'bg-gray-600 cursor-not-allowed opacity-50';
    if (seat.status === 'locked-by-other') return 'bg-amber-600 cursor-not-allowed';
    if (seat.status === 'locked-by-me' || selectedSeats.includes(seat.id)) {
      return 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30';
    }

    switch (seat.type) {
      case 'vip':
        return 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700';
      case 'premium':
        return 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700';
      default:
        return 'bg-slate-700 hover:bg-slate-600';
    }
  };

  const getSeatLabel = (seat: Seat): string => {
    return `${String.fromCharCode(64 + seat.row)}${seat.column}`;
  };

  const getSeatIcon = (seat: Seat) => {
    if (seat.status === 'booked') return <X className="w-3 h-3" />;
    if (seat.status === 'locked-by-other') return <Lock className="w-3 h-3" />;
    if (seat.status === 'locked-by-me' || selectedSeats.includes(seat.id)) {
      return <CheckCircle2 className="w-3 h-3" />;
    }
    if (seat.type === 'vip') return <Crown className="w-3 h-3" />;
    if (seat.type === 'premium') return <Sparkles className="w-3 h-3" />;
    return null;
  };

  const renderSeat = (row: number, col: number) => {
    const seat = seats.find(s => s.row === row && s.column === col);

    if (!seat) {
      return <div key={`${row}-${col}`} className="w-12 h-12" />;
    }

    const isDisabled = seat.status === 'booked' || seat.status === 'locked-by-other';
    const icon = getSeatIcon(seat);

    return (
      <button
        key={seat.id}
        onClick={() => !isDisabled && onSeatClick(seat.id)}
        disabled={isDisabled}
        className={`w-12 h-12 rounded-t-lg text-white text-xs font-bold border border-slate-600 flex flex-col items-center justify-center gap-0.5 ${getSeatColor(seat)}`}
        title={`${getSeatLabel(seat)} - ${seat.type.toUpperCase()} - $${seat.price}`}
      >
        {icon}
        <span className="text-[10px]">{getSeatLabel(seat)}</span>
      </button>
    );
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 lg:p-8 rounded-xl shadow-xl">
      <div className="mb-12 text-center">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-4 px-12 lg:px-16 rounded-xl border border-amber-600 shadow-lg shadow-amber-500/30">
            <span className="text-white font-bold text-lg lg:text-xl tracking-wider">SCREEN</span>
          </div>
        </div>
        <div className="mt-3 text-gray-400 text-sm">All eyes this way</div>
      </div>

      <div className="flex flex-col gap-3 items-center mb-8 overflow-x-auto">
        {Array.from({ length: maxRow }, (_, i) => i + 1).map(row => (
          <div key={row} className="flex gap-2 items-center">
            <div className="w-6 text-gray-400 text-xs font-bold text-right">
              {String.fromCharCode(64 + row)}
            </div>
            {Array.from({ length: maxCol }, (_, i) => i + 1).map(col => renderSeat(row, col))}
            <div className="w-6 text-gray-400 text-xs font-bold text-left">
              {String.fromCharCode(64 + row)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-700 rounded-t-lg border border-slate-600" />
          <span className="text-gray-300 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-t-lg border border-slate-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-300 font-medium">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-t-lg border border-slate-600 flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-300 font-medium">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-t-lg border border-slate-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-300 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-t-lg border border-slate-600 opacity-50 flex items-center justify-center">
            <X className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-300 font-medium">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
