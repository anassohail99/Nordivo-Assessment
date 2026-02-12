import { create } from 'zustand';
import { User } from '../types';
import authService from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  initAuth: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  initAuth: () => {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated, isInitialized: true });
  },

  refreshUser: async () => {
    try {
      const user = await authService.refreshProfile();
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  }
}));
