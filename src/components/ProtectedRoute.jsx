import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/router/routes'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore()
  if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />
  return children
}
