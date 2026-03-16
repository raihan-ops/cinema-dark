import { useScrollToTop } from '@/hooks/useScrollToTop'
import { useTrending } from '@/pages/search/useMovieSearch'
import MovieCard from '@/components/features/MovieCard'
import { CardSkeleton } from '@/components/skeletons'
import { Button } from '@/components/ui/button'

export default function TrendingPage() {
  useScrollToTop()
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrending()

  const movies = data?.pages
    ?.flatMap((page) => page.results)
    ?.filter((m) => m.media_type !== 'person' && m.poster_path) ?? []

  return (
    <div className="min-h-screen bg-surface-elevated">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8">
        <h1 className="mb-8 text-3xl font-black text-text-primary sm:text-5xl">
          Trending Now
        </h1>

        {isError && (
          <div className="py-20 text-center">
            <p className="text-2xl font-bold text-white">Something went wrong</p>
            <p className="mt-2 text-base text-text-secondary">
              Could not load trending movies. Please try again.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {movies.map((movie) => (
                <MovieCard
                  key={`${movie.media_type}-${movie.id}`}
                  movie={movie}
                  variant="search"
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-10 flex justify-center">
                <Button
                  // variant="outline"
                  size="lg"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex h-12 w-[208px] items-center justify-center rounded-primary bg-surface-input text-base font-bold text-text-nav transition-colors hover:text-white disabled:opacity-60"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
