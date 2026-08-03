import { create } from 'zustand'

export const useApplicationsStore = create((set, get) => ({
    applications: [],

    apply: (jobId) =>
        set((state) => {
            if (state.applications.includes(jobId)) return state
            return { applications: [...state.applications, jobId] }
        }),

    hasApplied: (jobId) => get().applications.includes(jobId),

    clearApplications: () => set({ applications: [] }),
}))
