import { create } from 'zustand'

export const useFavoritesStore = create((set, get) => ({
    favorites: [],

    addFavorite: (jobId) =>
        set((state) => {
            if (state.favorites.includes(jobId)) return state
            return { favorites: [...state.favorites, jobId] }
        }),

    removeFavorite: (jobId) =>
        set((state) => ({
            favorites: state.favorites.filter((id) => id !== jobId),
        })),

    isFavorite: (jobId) => get().favorites.includes(jobId),

    toggleFavorite: (jobId) => {
        const { isFavorite, addFavorite, removeFavorite } = get()

        if (isFavorite(jobId)) removeFavorite(jobId)
        else addFavorite(jobId)
    },
}))
