import { NavLink, useNavigate } from "react-router-dom";
import { Home, Compass, Bookmark, Search, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useWatchlistStore } from "@/store/watchlistStore";
import { ROUTES } from "@/router/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, to: ROUTES.HOME },
  { label: "Browse", icon: Compass, to: ROUTES.SEARCH },
  { label: "Watchlist", icon: Bookmark, to: ROUTES.WATCHLIST },
  { label: "Search", icon: Search, to: ROUTES.SEARCH },
];

export default function BottomNav() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const clearUser = useAuthStore((s) => s.clearUser);
  const clearWatchlist = useWatchlistStore((s) => s.clearWatchlist);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    clearUser();
    clearWatchlist();
    navigate(ROUTES.LOGIN);
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch border-t border-primary/20 bg-surface-elevated">
      {navItems.map(({ label, icon: Icon, to }) => (
        <NavLink
          key={label}
          to={to}
          end={to === ROUTES.HOME}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors",
              isActive ? "text-primary" : "text-text-muted",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Exit / Logout */}
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-text-muted transition-colors hover:text-primary"
        >
          <LogOut size={20} strokeWidth={1.75} />
          <span>Exit</span>
        </button>
      ) : (
        <NavLink
          to={ROUTES.LOGIN}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors",
              isActive ? "text-primary" : "text-text-muted",
            )
          }
        >
          {({ isActive }) => (
            <>
              <LogOut size={20} strokeWidth={isActive ? 2.5 : 1.75} />
              <span>Login</span>
            </>
          )}
        </NavLink>
      )}
    </nav>
  );
}
