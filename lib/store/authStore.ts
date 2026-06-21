import { User } from "@/types/auth";
import { create } from "zustand";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuthState: (user: User | null) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  setAuthState: (user) => set({ user, isAuthenticated: !!user }),
  clearAuthState: () => set({ user: null, isAuthenticated: false }),
}));
