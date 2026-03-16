import { useInfiniteQuery } from '@tanstack/react-query'
import { searchMovies, getTrending } from '@/api/tmdb'

export function useMovieSearch(query) {
  return useInfiniteQuery({
    queryKey: ['movies', 'search', query],
    queryFn: ({ pageParam = 1 }) => searchMovies(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTrending() {
  return useInfiniteQuery({
    queryKey: ['movies', 'trending'],
    queryFn: ({ pageParam = 1 }) => getTrending('week', pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 30,
  })
}
