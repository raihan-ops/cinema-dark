export const TMDB_BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const ENDPOINTS = {
  SEARCH_MULTI: '/search/multi',
  TRENDING_ALL: (timeWindow) => `/trending/all/${timeWindow}`,
  MOVIE_DETAIL: (id) => `/movie/${id}`,
  TV_DETAIL: (id) => `/tv/${id}`,
}
