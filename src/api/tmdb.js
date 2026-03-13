import { TMDB_BASE, TMDB_IMAGE_BASE, ENDPOINTS } from './endpoints'

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
  return tmdbFetch(ENDPOINTS.SEARCH_MULTI, { query, page })
}

export function getTrending(timeWindow = 'week') {
  return tmdbFetch(ENDPOINTS.TRENDING_ALL(timeWindow))
}

export function getMovieDetail(id) {
  return tmdbFetch(ENDPOINTS.MOVIE_DETAIL(id), { append_to_response: 'credits,videos,similar' })
}

export function getTvDetail(id) {
  return tmdbFetch(ENDPOINTS.TV_DETAIL(id), { append_to_response: 'credits,videos,similar' })
}

export { TMDB_IMAGE_BASE }

export function posterUrl(path, size = 'w500') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path, size = 'w1280') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}
