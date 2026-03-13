import { useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useMovieSearch } from './useMovieSearch'
import TrendingRow from '@/components/TrendingRow'
import MovieCard from '@/components/MovieCard'
import { cn } from '@/lib/utils'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV', value: 'tv' },
]

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg bg-surface-card">
      <div className="aspect-[2/3] w-full bg-surface-border" />
      <div className="p-4">
        <div className="mb-2 h-4 w-3/4 rounded bg-surface-border" />
        <div className="mb-4 h-3 w-1/2 rounded bg-surface-border" />
        <div className="flex gap-2">
          <div className="h-[38px] flex-1 rounded-md bg-surface-border" />
          <div className="h-[38px] flex-1 rounded-md bg-surface-border" />
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
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

  return (
    <div className="min-h-screen bg-surface-elevated">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8">
        {/* Hero heading */}
        <h1 className="mb-8 text-center text-3xl font-black leading-none text-text-primary sm:text-5xl">
          Find your next obsession.
        </h1>

        {/* Search bar */}
        <div className="mx-auto mb-12 flex h-14 max-w-[672px] items-center gap-3 rounded-lg bg-surface-input px-4">
          <Search size={20} className="shrink-0 text-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setFilter('all')
            }}
            placeholder="Search movies, actors, or genres"
            className="flex-1 bg-transparent text-base font-medium text-white outline-none placeholder:text-text-secondary sm:text-lg"
          />
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
                    onClick={() => setFilter(f.value)}
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
                      className="flex h-12 w-[208px] items-center justify-center rounded-lg bg-surface-input text-base font-bold text-text-nav transition-colors hover:text-white disabled:opacity-60"
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
