import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFoundPage from "./NotFoundPage";
import { ROUTES } from "./routes";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage"),
);
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const SearchPage = lazy(() => import("@/pages/search/SearchPage"));
const MovieDetailPage = lazy(() => import("@/pages/movie/MovieDetailPage"));
const WatchlistPage = lazy(() => import("@/pages/watchlist/WatchlistPage"));
const TrendingPage = lazy(() => import("@/pages/trending/TrendingPage"));

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
      { path: ROUTES.TRENDING, element: <TrendingPage /> },
      {
        path: ROUTES.MOVIE_DETAIL_PATH,
        element: <MovieDetailPage />,
      },
      {
        path: ROUTES.WATCHLIST,
        element: (
          <ProtectedRoute>
            <WatchlistPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
