import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { posterUrl } from '@/api/tmdb'
import { getGenreName } from '@/lib/genres'
import { useAuthStore } from '@/store/authStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { addToWatchlist, removeFromWatchlist } from '@/api/firebase'
import { ROUTES } from '@/router/routes'
import { cn } from '@/lib/utils'

export default function MovieCard({ movie, variant = 'search' }) {
  const user = useAuthStore((s) => s.user)
  const addMovie = useWatchlistStore((s) => s.addMovie)
  const removeMovie = useWatchlistStore((s) => s.removeMovie)
  const inWatchlist = useWatchlistStore((s) => s.isInWatchlist(movie.id))

  const title = movie.title || movie.name || 'Unknown'
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const genre = getGenreName(movie.genre_ids)
  const poster = posterUrl(movie.poster_path, 'w342')
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null
  const detailPath = ROUTES.MOVIE_DETAIL(movie.id)

  async function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addMovie(movie)
    if (user?.uid) {
      await addToWatchlist(user.uid, movie).catch(console.error)
    }
  }

  async function handleRemove(e) {
    e.preventDefault()
    e.stopPropagation()
    removeMovie(movie.id)
    if (user?.uid) {
      await removeFromWatchlist(user.uid, movie).catch(console.error)
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-glow">
      {/* Poster */}
      <Link to={detailPath} className="relative block aspect-[2/3] w-full overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-card text-sm text-text-secondary">
            No Image
          </div>
        )}
        {/* Rating badge */}
        {rating && (
          <div className="absolute bottom-2 right-2 flex h-6 items-center rounded bg-primary px-2 text-xs font-bold text-white">
            {rating}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary">
          {[year, genre].filter(Boolean).join(' • ')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        <Link
          to={detailPath}
          className="flex h-[38px] flex-1 items-center justify-center rounded-md bg-primary text-sm font-bold text-white transition-colors hover:bg-primary-deep"
        >
          Details
        </Link>

        {variant === 'search' && (
          <button
            type="button"
            onClick={inWatchlist ? handleRemove : handleAdd}
            className={cn(
              'flex h-[38px] flex-1 items-center justify-center gap-1 rounded-md border text-sm font-bold transition-colors',
              inWatchlist
                ? 'border-primary bg-primary/10 text-primary-soft hover:bg-primary/20'
                : 'border-primary text-primary hover:bg-primary/10',
            )}
          >
            {inWatchlist ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
            {inWatchlist ? 'Saved' : '+ Watch'}
          </button>
        )}

        {variant === 'watchlist' && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-[38px] flex-1 items-center justify-center rounded-md border border-primary text-sm font-bold text-primary transition-colors hover:bg-primary/10"
          >
            ✕ Remove
          </button>
        )}
      </div>
    </div>
  )
}
