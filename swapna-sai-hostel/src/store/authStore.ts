import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  adminEmail: string | null;
  setAuth: (token: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      adminEmail: null,
      setAuth: (token, email) => set({ token, adminEmail: email }),
      logout: () => set({ token: null, adminEmail: null }),
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
