import { useNavigate } from 'react-router-dom'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { useTrending } from '@/pages/search/useMovieSearch'
import { TrendingCard } from '@/components/features/TrendingCard'
import { TrendingCardSkeleton } from '@/components/skeletons'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ROUTES } from '@/router/routes'

export default function TrendingRow() {
  const { data, isLoading } = useTrending()
  const navigate = useNavigate()
  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }))

  const movies = data?.pages?.[0]?.results
    ?.filter((m) => m.media_type !== 'person' && m.poster_path)
    .slice(0, 10) ?? []

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Trending Now</h2>
        <span
          className="cursor-pointer text-sm font-medium text-primary hover:underline"
          onClick={() => navigate(ROUTES.TRENDING)}
        >
          View All →
        </span>
      </div>
      <Carousel opts={{ align: 'start', dragFree: true }} plugins={[autoplayPlugin.current]}>
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
