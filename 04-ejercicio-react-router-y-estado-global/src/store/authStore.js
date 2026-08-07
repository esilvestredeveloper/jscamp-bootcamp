import { create } from 'zustand'

import { useApplicationsStore } from './applicationsStore.js'

export const useAuthStore = create((set) => ({
  isLoggedIn: false,

  login: () => set({ isLoggedIn: true }),

  logout: () => {
    set({ isLoggedIn: false })
    useApplicationsStore.getState().clearApplications()
  },
}))
