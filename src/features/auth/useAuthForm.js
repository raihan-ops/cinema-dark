import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { loadWatchlist } from '@/api/firebase'
import { useAuthStore } from '@/store/authStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { ROUTES } from '@/router/routes'

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export function useAuthForm(mode) {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const setMovies = useWatchlistStore((s) => s.setMovies)

  const [fields, setFields] = useState(
    mode === 'login'
      ? { email: '', password: '', rememberMe: false }
      : { name: '', email: '', password: '', confirmPassword: '' }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (mode === 'signup' && fields.password !== fields.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      let credential
      if (mode === 'login') {
        credential = await signInWithEmailAndPassword(auth, fields.email, fields.password)
      } else {
        credential = await createUserWithEmailAndPassword(auth, fields.email, fields.password)
        if (fields.name) {
          await updateProfile(credential.user, { displayName: fields.name })
        }
      }

      const user = credential.user
      setUser(user)
      const movies = await loadWatchlist(user.uid)
      setMovies(movies)
      navigate(ROUTES.SEARCH)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return { fields, handleChange, handleSubmit, loading, error }
}
