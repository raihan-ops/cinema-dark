import { create } from 'zustand'

export const useWatchlistStore = create((set, get) => ({
  movies: [],
  addMovie: (movie) => {
    const exists = get().movies.some((m) => m.id === movie.id)
    if (!exists) {
      set((state) => ({ movies: [...state.movies, movie] }))
    }
  },
  removeMovie: (movieId) =>
    set((state) => ({ movies: state.movies.filter((m) => m.id !== movieId) })),
  setMovies: (movies) => set({ movies }),
  clearWatchlist: () => set({ movies: [] }),
  isInWatchlist: (movieId) => get().movies.some((m) => m.id === movieId),
}))
