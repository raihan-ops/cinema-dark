import { useTrending } from '@/features/search/useMovieSearch'
import { TrendingCard } from '@/components/TrendingCard'
import { TrendingCardSkeleton } from '@/components/skeletons'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

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
      <Carousel opts={{ align: 'start', dragFree: true }}>
        <CarouselContent className="-ml-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="pl-5 basis-auto">
                  <TrendingCardSkeleton />
                </CarouselItem>
              ))
            : movies.map((movie) => (
                <CarouselItem key={movie.id} className="pl-5 basis-auto">
                  <TrendingCard movie={movie} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4 border-surface-border bg-surface-elevated text-text-secondary hover:bg-primary hover:text-white hover:border-primary disabled:opacity-0" />
        <CarouselNext className="hidden sm:flex -right-4 border-surface-border bg-surface-elevated text-text-secondary hover:bg-primary hover:text-white hover:border-primary disabled:opacity-0" />
      </Carousel>
    </div>
  )
}
