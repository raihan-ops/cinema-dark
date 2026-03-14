import { toast } from 'sonner'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useAuthStore } from '@/store/authStore'
import { addToWatchlist, removeFromWatchlist } from '@/api/firebase'

export function useWatchlist() {
  const movies = useWatchlistStore((s) => s.movies)
  const _addMovie = useWatchlistStore((s) => s.addMovie)
  const _removeMovie = useWatchlistStore((s) => s.removeMovie)
  const isInWatchlist = useWatchlistStore((s) => s.isInWatchlist)
  const user = useAuthStore((s) => s.user)

  async function addMovie(movie) {
    _addMovie(movie)
    toast.success('Added to Watchlist', {
      description: movie.title || movie.name,
    })
    if (user?.uid) {
      await addToWatchlist(user.uid, movie).catch(console.error)
    }
  }

  async function removeMovie(movieId) {
    const movie = movies.find((m) => m.id === movieId)
    _removeMovie(movieId)
    toast.success('Removed from Watchlist', {
      description: movie?.title || movie?.name,
    })
    if (user?.uid) {
      await removeFromWatchlist(user.uid, movieId).catch(console.error)
    }
  }

  return { movies, addMovie, removeMovie, isInWatchlist }
}
