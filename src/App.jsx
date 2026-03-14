import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { loadWatchlist } from '@/api/firebase'

export default function App() {
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.clearUser)
  const setMovies = useWatchlistStore((s) => s.setMovies)
  const clearWatchlist = useWatchlistStore((s) => s.clearWatchlist)

  // Prevent ProtectedRoute from flashing /login before Firebase resolves the session
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        const movies = await loadWatchlist(user.uid).catch(() => [])
        setMovies(movies)
      } else {
        clearUser()
        clearWatchlist()
      }
      setAuthReady(true)
    })
    return unsubscribe
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-border border-t-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-black font-sans text-text-primary">
      <Navbar />
      <ErrorBoundary>
        <PageTransition>
          <main className="pb-16 sm:pb-0">
            <Outlet />
          </main>
        </PageTransition>
      </ErrorBoundary>
      <Footer />
      <BottomNav />
      <Toaster />
    </div>
  )
}
