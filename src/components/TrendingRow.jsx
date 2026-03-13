import { useNavigate } from 'react-router-dom'
import { Play, Bookmark } from 'lucide-react'
import { useTrending } from '@/features/search/useMovieSearch'
import { posterUrl } from '@/api/tmdb'
import { getGenreName } from '@/lib/genres'
import { ROUTES } from '@/router/routes'

function TrendingCard({ movie }) {
  const navigate = useNavigate()
  const title = movie.title || movie.name || 'Unknown'
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const genre = getGenreName(movie.genre_ids)
  const poster = posterUrl(movie.poster_path, 'w342')

  return (
    <div
      className="group relative flex w-[220px] shrink-0 cursor-pointer flex-col"
      onClick={() => navigate(ROUTES.MOVIE_DETAIL(movie.id))}
    >
      {/* Poster */}
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

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-primary bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            className="flex h-[30px] w-[27px] items-center justify-center rounded bg-primary text-white"
            onClick={(e) => {
              e.stopPropagation()
              navigate(ROUTES.MOVIE_DETAIL(movie.id))
            }}
          >
            <Play size={13} fill="white" strokeWidth={0} />
          </button>
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded border border-white/40 text-white hover:bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Bookmark size={14} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="truncate text-base font-bold text-text-primary">{title}</p>
        <p className="mt-1 text-sm font-medium text-text-secondary">
          {[year, genre].filter(Boolean).join(' • ')}
        </p>
      </div>
    </div>
  )
}

function TrendingCardSkeleton() {
  return (
    <div className="w-[220px] shrink-0 animate-pulse">
      <div className="h-[330px] rounded-primary bg-surface-input" />
      <div className="mt-3 h-4 w-3/4 rounded bg-surface-input" />
      <div className="mt-2 h-3 w-1/2 rounded bg-surface-input" />
    </div>
  )
}

export default function TrendingRow() {
  const { data, isLoading } = useTrending()

  const movies = data?.results
    ?.filter((m) => m.media_type !== 'person' && m.poster_path)
    .slice(0, 10) ?? []

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Trending Now</h2>
        <span className="cursor-pointer text-sm font-medium text-primary hover:underline">
          View All →
        </span>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <TrendingCardSkeleton key={i} />)
          : movies.map((movie) => <TrendingCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  )
}
