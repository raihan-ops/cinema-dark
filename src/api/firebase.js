import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'

// users/{uid}/wishlist/{movieId}  ← each movie is its own document
const wishlistCol = (uid) => collection(db, 'users', uid, 'wishlist')
const wishlistDoc = (uid, movieId) =>
  doc(db, 'users', uid, 'wishlist', String(movieId))

// Normalize to avoid storing undefined fields that break Firestore
function normalize(movie) {
  return {
    id: movie.id,
    title: movie.title ?? null,
    name: movie.name ?? null,
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    release_date: movie.release_date ?? null,
    first_air_date: movie.first_air_date ?? null,
    vote_average: movie.vote_average ?? null,
    genre_ids: movie.genre_ids ?? [],
    media_type: movie.media_type ?? null,
    overview: movie.overview ?? null,
  }
}

export async function loadWatchlist(uid) {
  const snap = await getDocs(wishlistCol(uid))
  return snap.docs.map((d) => d.data())
}

export async function addToWatchlist(uid, movie) {
  await setDoc(wishlistDoc(uid, movie.id), normalize(movie))
}

// Takes movieId (number or string), not the full movie object
export async function removeFromWatchlist(uid, movieId) {
  await deleteDoc(wishlistDoc(uid, movieId))
}
