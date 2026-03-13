import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { toast } from 'sonner'
import { auth } from '@/lib/firebase'
import { loadWatchlist } from '@/api/firebase'
import { useAuthStore } from '@/store/authStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { ROUTES } from '@/router/routes'

function friendlySocialError(code) {
  switch (code) {
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with a different sign-in method.'
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return ''
    default:
      return 'Social sign-in failed. Please try again.'
  }
}

export function useSocialAuth() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const setMovies = useWatchlistStore((s) => s.setMovies)
  const [loading, setLoading] = useState(null)

  async function signInWith(providerName) {
    let provider
    if (providerName === 'google') provider = new GoogleAuthProvider()
    else if (providerName === 'facebook') provider = new FacebookAuthProvider()
    else if (providerName === 'github') provider = new GithubAuthProvider()
    else return

    setLoading(providerName)
    try {
      const credential = await signInWithPopup(auth, provider)
      const user = credential.user
      setUser(user)
      try {
        const movies = await loadWatchlist(user.uid)
        setMovies(movies)
      } catch {
        // watchlist load failure should not block login
      }
      navigate(ROUTES.SEARCH)
    } catch (err) {
      const msg = friendlySocialError(err.code)
      if (msg) toast.error(msg)
    } finally {
      setLoading(null)
    }
  }

  return { signInWith, loading }
}
