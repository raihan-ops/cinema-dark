import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const { isLoggedIn } = useAuthStore()

  return (
    <nav className="navbar-stub">
      <Link to="/">CinemaDark</Link>
      {isLoggedIn ? (
        <>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/watchlist">Watchlist</NavLink>
          <button>Logout</button>
        </>
      ) : (
        <Link to="/signup">Sign Up</Link>
      )}
    </nav>
  )
}
