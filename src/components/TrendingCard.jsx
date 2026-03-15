import { useNavigate } from 'react-router-dom'
import { Play, Bookmark, BookmarkCheck } from 'lucide-react'
import { posterUrl } from '@/api/tmdb'
import { getGenreName } from '@/lib/genres'
import { useWatchlist } from '@/features/watchlist/useWatchlist'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/button'

export function TrendingCard({ movie }) {
  const navigate = useNavigate()
  const { addMovie, removeMovie, isInWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)

  const title = movie.title || movie.name || 'Unknown'
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const genre = getGenreName(movie.genre_ids)
  const poster = posterUrl(movie.poster_path, 'w342')

  async function handleBookmark(e) {
    e.stopPropagation()
    if (inWatchlist) {
      await removeMovie(movie.id)
    } else {
      await addMovie(movie)
    }
  }

  return (
    <div
      className="group relative flex w-[220px] shrink-0 cursor-pointer flex-col"
      onClick={() => navigate(ROUTES.MOVIE_DETAIL(movie.id))}
    >
      <div className="relative h-[330px] w-full overflow-hidden rounded-primary">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-primary bg-surface-card text-sm text-text-secondary">
            No Image
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-primary bg-black/60 opacity-100 transition-opacity duration-200 pointer-events-auto sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto sm:group-focus-within:opacity-100 sm:group-focus-within:pointer-events-auto">
          <Button
            type="button"
            size="icon-sm"
            className="h-[30px] w-[27px] bg-primary text-white hover:bg-primary/90"
            aria-label={`Open ${title}`}
            onClick={(e) => {
              e.stopPropagation()
              navigate(ROUTES.MOVIE_DETAIL(movie.id))
            }}
          >
            <Play size={13} fill="white" strokeWidth={0} />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className={`h-[30px] w-[30px] rounded border transition-colors ${
              inWatchlist
                ? 'border-primary bg-primary/20 text-primary hover:bg-primary/25'
                : 'border-white/40 text-white hover:bg-white/10'
            }`}
            aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
            onClick={handleBookmark}
          >
            {inWatchlist ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <p className="truncate text-base font-bold text-text-primary">{title}</p>
        <p className="mt-1 text-sm font-medium text-primary">
          {[year, genre].filter(Boolean).join(' • ')}
        </p>
      </div>
    </div>
  )
}
