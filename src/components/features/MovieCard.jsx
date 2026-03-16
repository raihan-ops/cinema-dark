import { Link, useLocation } from 'react-router-dom'
import { Info, Trash2, Bookmark, BookmarkCheck } from 'lucide-react'
import { posterUrl } from '@/api/tmdb'
import { PosterImage } from '@/components/ui/poster-image'
import { getGenreName } from '@/lib/genres'
import { useWatchlist } from '@/pages/watchlist/useWatchlist'
import { ROUTES } from '@/router/routes'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

export default function MovieCard({ movie, variant = 'search' }) {
  const location = useLocation()
  const { addMovie, removeMovie, isInWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)

  const title = movie.title || movie.name || 'Unknown'
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const genre = getGenreName(movie.genre_ids)
  const poster = posterUrl(movie.poster_path, 'w342')
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null
  const detailPath = ROUTES.MOVIE_DETAIL(movie.id)

  async function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    await addMovie(movie)
  }

  async function handleRemove(e) {
    e.preventDefault()
    e.stopPropagation()
    await removeMovie(movie.id)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-primary border border-surface-border bg-surface-card shadow-card transform-gpu transition-all duration-300 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-glow">
      {/* Poster */}
      <Link
        to={detailPath}
        state={{ from: `${location.pathname}${location.search}` }}
        className="relative block aspect-[3/4] w-full overflow-hidden"
      >
        <PosterImage
          src={poster}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300"
          iconSize={40}
        />
        {/* Rating badge */}
        {rating && (
          <div className="absolute bottom-2 right-2 flex h-6 items-center rounded bg-primary px-2 text-xs font-bold text-white">
            {rating}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 px-3 py-2 sm:px-4 sm:py-3">
        <h3 className="line-clamp-1 text-[13px] sm:text-[15px] font-bold leading-snug text-text-primary">{title}</h3>
        <p className="text-xs sm:text-sm text-text-secondary">
          {[year, genre].filter(Boolean).join(' • ')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
        <Link
          to={detailPath}
          state={{ from: `${location.pathname}${location.search}` }}
          className={cn(buttonVariants({ size: 'default' }), 'flex-1 shrink min-w-0 w-full py-1.5')}
        >
          <Info size={14} />
          Details
        </Link>

        {variant === 'search' && (
          <Button
            size="default"
            onClick={inWatchlist ? handleRemove : handleAdd}
            className={cn(
              'flex-1 shrink min-w-0 w-full border border-primary dark:border-primary py-1.5',
              inWatchlist
                ? 'bg-primary/10 dark:bg-primary/10 text-primary-soft hover:bg-primary/20 dark:hover:bg-primary/20'
                : 'bg-transparent dark:bg-transparent text-primary hover:bg-primary/10 dark:hover:bg-primary/10',
            )}
          >
            {inWatchlist ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {inWatchlist ? 'Saved' : 'Watch'}
          </Button>
        )}

        {variant === 'watchlist' && (
          <Button
            size="default"
            className="flex-1 shrink min-w-0 w-full border border-primary dark:border-primary bg-transparent dark:bg-transparent text-primary hover:bg-primary/10 dark:hover:bg-primary/10 py-1.5"
            onClick={handleRemove}
          >
            <Trash2 size={14} />
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
