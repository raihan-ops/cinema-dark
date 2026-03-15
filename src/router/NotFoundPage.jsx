import { Link } from 'react-router-dom'
import { Film } from 'lucide-react'
import { ROUTES } from './routes'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-surface-black px-8 text-center">
      <Film size={48} className="mb-4 text-text-muted" />
      <p className="text-8xl font-black text-primary">404</p>
      <p className="mt-4 text-2xl font-bold text-text-primary">Page not found</p>
      <p className="mt-2 text-base text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        to={ROUTES.SEARCH}
        className="mt-8 flex h-11 items-center rounded-primary bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-deep"
      >
        Go Home
      </Link>
    </div>
  )
}