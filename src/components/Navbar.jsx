import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Film, Search } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useWatchlistStore } from "@/store/watchlistStore";
import { ROUTES } from "@/router/routes";
import { cn } from "@/lib/utils";

function UserAvatar({ user }) {
  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt="avatar"
        referrerPolicy="no-referrer"
        className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/40"
      />
    );
  }

  const initial = user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/40 text-sm font-bold text-white ring-2 ring-primary">
      {initial}
    </span>
  );
}

const navLinkClass = ({ isActive }) =>
  cn(
    "text-sm font-semibold transition-colors hover:text-primary hover:underline hover:underline-offset-6",
    isActive ? "text-primary underline underline-offset-6" : "text-text-nav",
  );

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const clearUser = useAuthStore((s) => s.clearUser);
  const clearWatchlist = useWatchlistStore((s) => s.clearWatchlist);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  async function handleLogout() {
    await signOut(auth);
    clearUser();
    clearWatchlist();
    navigate(ROUTES.LOGIN);
  }

  function handleSearch(e) {
    e.preventDefault();
    navigate(ROUTES.SEARCH);
  }

  return (
    <nav className="flex h-18.25 items-center justify-between gap-6 bg-surface-elevated px-4 sm:px-8 border-b border-primary/20">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Link to={ROUTES.HOME} className="flex shrink-0 items-center gap-2">
          <Film size={22} className="text-primary" />
          <span className="text-lg font-extrabold tracking-tight text-text-primary sm:text-xl">
            CinemaDark
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to={ROUTES.SEARCH} className={navLinkClass}>
            Browse
          </NavLink>
          <NavLink to={ROUTES.WATCHLIST} className={navLinkClass}>
            Watchlist
          </NavLink>
        </div>
      </div>

      {isLoggedIn ? (
        <>
          {/* Center nav links */}

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Search input */}
            <form onSubmit={handleSearch} className="hidden sm:flex">
              <div className="flex h-9 items-center gap-2 rounded-full bg-surface-input px-3">
                <Search size={15} className="shrink-0 text-text-secondary" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-text-muted"
                />
              </div>
            </form>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex h-9 items-center rounded-full bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary-deep"
            >
              Logout
            </button>

            {/* Avatar */}
            <UserAvatar user={user} />
          </div>
        </>
      ) : (
        <Link
          to={ROUTES.SIGNUP}
          className="flex h-9 w-21 items-center justify-center rounded-full bg-primary text-sm font-bold text-white transition-colors hover:bg-primary-deep"
        >
          Sign Up
        </Link>
      )}
    </nav>
  );
}
