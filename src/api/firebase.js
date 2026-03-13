import { db } from '@/lib/firebase'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'

const watchlistRef = (uid) => doc(db, 'users', uid, 'data', 'watchlist')

export async function loadWatchlist(uid) {
  const snap = await getDoc(watchlistRef(uid))
  return snap.exists() ? snap.data().movies ?? [] : []
}

export async function addToWatchlist(uid, movie) {
  await setDoc(watchlistRef(uid), { movies: arrayUnion(movie) }, { merge: true })
}

export async function removeFromWatchlist(uid, movie) {
  await updateDoc(watchlistRef(uid), { movies: arrayRemove(movie) })
}
