import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import ProtectedRoute from '@/components/ProtectedRoute'
import NotFoundPage from './NotFoundPage'
import { ROUTES } from './routes'

const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'))
const SignupPage = lazy(() => import('@/features/auth/SignupPage'))
const SearchPage = lazy(() => import('@/features/search/SearchPage'))
const MovieDetailPage = lazy(() => import('@/features/movie/MovieDetailPage'))
const WatchlistPage = lazy(() => import('@/features/watchlist/WatchlistPage'))

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    children: [
      { index: true, element: <Navigate to={ROUTES.SEARCH} replace /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.SIGNUP, element: <SignupPage /> },
      { path: ROUTES.SEARCH, element: <SearchPage /> },
      { path: ROUTES.MOVIE_DETAIL_PATH, element: <MovieDetailPage /> },
      {
        path: ROUTES.WATCHLIST,
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
