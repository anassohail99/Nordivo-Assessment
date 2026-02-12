import { create } from 'zustand';

interface SeatState {
  selectedSeats: string[];
  lockExpiry: Date | null;
  setSelectedSeats: (seats: string[]) => void;
  addSeat: (seatId: string) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;
  setLockExpiry: (expiry: Date | null) => void;
}

export const useSeatStore = create<SeatState>((set) => ({
  selectedSeats: [],
  lockExpiry: null,

  setSelectedSeats: (seats) => set({ selectedSeats: seats }),

  addSeat: (seatId) => set((state) => ({
    selectedSeats: [...state.selectedSeats, seatId]
  })),

  removeSeat: (seatId) => set((state) => ({
    selectedSeats: state.selectedSeats.filter(id => id !== seatId)
  })),

  clearSeats: () => set({ selectedSeats: [], lockExpiry: null }),

  setLockExpiry: (expiry) => set({ lockExpiry: expiry })
}));
