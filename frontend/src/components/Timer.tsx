import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTimeRemaining } from '../utils/formatters';

interface TimerProps {
  expiry: Date;
  onExpire: () => void;
}

const Timer = ({ expiry, onExpire }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isLowTime, setIsLowTime] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const formatted = formatTimeRemaining(expiry);
      setTimeRemaining(formatted);

      const remaining = expiry.getTime() - Date.now();
      setIsLowTime(remaining < 60000 && remaining > 0);

      if (formatted === 'Expired') {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry, onExpire]);

  return (
    <div className={`rounded-xl border shadow-lg ${
      isLowTime
        ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-600 shadow-red-500/30 animate-pulse'
        : 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-600 shadow-amber-500/30'
    }`}>
      <div className="px-6 py-4 flex items-center justify-center gap-3">
        {isLowTime ? (
          <AlertTriangle className="w-6 h-6 text-white" />
        ) : (
          <Clock className="w-6 h-6 text-white" />
        )}
        <div className="text-center">
          <div className="text-white font-bold text-lg">
            {timeRemaining}
          </div>
          <div className="text-white/90 text-xs font-medium">
            {isLowTime ? 'Hurry! Time running out' : 'Time remaining'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
