import { create } from 'zustand'
import type { User } from '@/types/api'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: () => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  setUser: user => set({ user }),

  isAuthenticated: () => !!localStorage.getItem('nivocal_access_token') && !!get().user,

  logout: () => {
    localStorage.removeItem('nivocal_access_token')
    localStorage.removeItem('nivocal_refresh_token')
    set({ user: null })
    window.location.href = '/login'
  },
}))
