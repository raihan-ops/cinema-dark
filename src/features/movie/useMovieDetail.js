import { useQuery } from '@tanstack/react-query'
import { getMovieDetail, getTvDetail } from '@/api/tmdb'

// Try movie endpoint first; if it throws fall back to TV
async function fetchDetail(id) {
  try {
    const data = await getMovieDetail(id)
    return { ...data, media_type: 'movie' }
  } catch {
    const data = await getTvDetail(id)
    return { ...data, media_type: 'tv' }
  }
}

export function useMovieDetail(id) {
  return useQuery({
    queryKey: ['detail', id],
    queryFn: () => fetchDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  })
}
