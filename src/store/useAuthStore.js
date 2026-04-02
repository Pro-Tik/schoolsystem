import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setCredentials: ({ user, accessToken }) => {
        set({ user, accessToken, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        // Clear storage if needed, though persist handles it
      },
    }),
    {
      name: 'class-pilot-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
