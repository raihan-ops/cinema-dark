const TMDB_BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export function searchMovies(query, page = 1) {
  return tmdbFetch('/search/multi', { query, page })
}

export function getTrending(timeWindow = 'week') {
  return tmdbFetch(`/trending/all/${timeWindow}`)
}

export function getMovieDetail(id) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,videos,similar' })
}

export function getTvDetail(id) {
  return tmdbFetch(`/tv/${id}`, { append_to_response: 'credits,videos,similar' })
}

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(path, size = 'w500') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path, size = 'w1280') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}
