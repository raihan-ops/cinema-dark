import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'
import SearchPage from '@/features/search/SearchPage'
import MovieDetailPage from '@/features/movie/MovieDetailPage'
import WatchlistPage from '@/features/watchlist/WatchlistPage'
import ProtectedRoute from '@/components/ProtectedRoute'

function NotFoundPage() {
  return <div>404 — Page Not Found</div>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/search" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'movie/:id', element: <MovieDetailPage /> },
      {
        path: 'watchlist',
        element: (
          <ProtectedRoute>
            <WatchlistPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
