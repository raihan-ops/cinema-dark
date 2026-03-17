import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { useDebounce } from '@/hooks/useDebounce'
import { useMovieSearch } from './useMovieSearch'
import TrendingRow from '@/components/features/TrendingRow'
import MovieCard from '@/components/features/MovieCard'
import { CardSkeleton } from '@/components/skeletons'
import { cn } from '@/lib/utils'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV', value: 'tv' },
]

export default function SearchPage() {
  useScrollToTop()
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const filter = searchParams.get('filter') ?? 'all'
  const debouncedQuery = useDebounce(query, 300)

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovieSearch(debouncedQuery)

  const allResults = data?.pages.flatMap((p) => p.results) ?? []
  const filtered =
    filter === 'all'
      ? allResults.filter((m) => m.media_type !== 'person')
      : allResults.filter((m) => m.media_type === filter)

  function handleInputChange(e) {
    const value = e.target.value
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) {
          next.set('q', value)
          next.delete('filter')
        } else {
          next.delete('q')
          next.delete('filter')
        }
        return next
      },
      { replace: true },
    )
  }

  function handleFilterChange(value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'all') {
          next.delete('filter')
        } else {
          next.set('filter', value)
        }
        return next
      },
      { replace: true },
    )
  }

  function handleClear() {
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface-elevated">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8">
        {/* Hero heading */}
        <h1 className="mb-8 text-center text-3xl font-black leading-none text-text-primary sm:text-5xl">
          Find your next obsession.
        </h1>

        {/* Search bar */}
        <div className="mx-auto mb-12 flex h-14 max-w-[672px] items-center gap-3 rounded-primary bg-surface-input px-4">
          <Search size={20} className="shrink-0 text-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search movies, actors, or genres"
            className="flex-1 bg-transparent text-base font-medium text-white outline-none placeholder:text-text-secondary sm:text-lg"
          />
          {query && (
            <button
              onClick={handleClear}
              className="cursor-pointer shrink-0 rounded-full p-1 text-text-secondary transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        {!debouncedQuery ? (
          <TrendingRow />
        ) : (
          <>
            {/* Section header + filter tabs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-text-primary">Search Results</h2>
              <div className="flex gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => handleFilterChange(f.value)}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-xs font-bold transition-colors',
                      filter === f.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-input text-text-muted hover:text-white',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {isError && (
              <div className="py-20 text-center">
                <p className="text-2xl font-bold text-white">Something went wrong</p>
                <p className="mt-2 text-base text-text-secondary">
                  Could not load results. Please try again.
                </p>
              </div>
            )}

            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Results grid */}
            {!isLoading && !isError && filtered.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                  {filtered.map((movie) => (
                    <MovieCard
                      key={`${movie.media_type}-${movie.id}`}
                      movie={movie}
                      variant="search"
                    />
                  ))}
                </div>

                {hasNextPage && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="flex h-12 w-[208px] items-center justify-center rounded-primary bg-surface-input text-base font-bold text-text-nav transition-colors hover:text-white disabled:opacity-60"
                    >
                      {isFetchingNextPage ? 'Loading…' : 'Load More Results'}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* No results */}
            {!isLoading && !isError && filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-2xl font-bold text-white">No results found</p>
                <p className="mt-2 text-base text-text-secondary">
                  Try different keywords or check spelling.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
