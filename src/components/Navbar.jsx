import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Film } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { ROUTES } from '@/router/routes'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const clearUser = useAuthStore((s) => s.clearUser)
  const clearWatchlist = useWatchlistStore((s) => s.clearWatchlist)
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut(auth)
    clearUser()
    clearWatchlist()
    navigate(ROUTES.LOGIN)
  }

  return (
    <nav className="flex h-[73px] items-center justify-between bg-surface-elevated px-4 sm:px-8">
      <Link to={ROUTES.HOME} className="flex items-center gap-2">
        <Film size={22} className="text-primary" />
        <span className="text-lg font-extrabold tracking-tight text-text-primary sm:text-xl">CinemaDark</span>
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink
            to={ROUTES.SEARCH}
            className={({ isActive }) =>
              cn(
                'text-sm font-semibold transition-colors hover:text-white',
                isActive ? 'text-white' : 'text-text-nav',
              )
            }
          >
            Search
          </NavLink>
          <NavLink
            to={ROUTES.WATCHLIST}
            className={({ isActive }) =>
              cn(
                'text-sm font-semibold transition-colors hover:text-white',
                isActive ? 'text-white' : 'text-text-nav',
              )
            }
          >
            Watchlist
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-text-nav transition-colors hover:text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to={ROUTES.SIGNUP}
          className="flex h-9 w-[84px] items-center justify-center rounded-lg bg-primary text-sm font-bold text-white transition-colors hover:bg-primary-deep"
        >
          Sign Up
        </Link>
      )}
    </nav>
  )
}
