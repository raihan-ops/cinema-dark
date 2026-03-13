import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWatchlist } from './useWatchlist'
import MovieCard from '@/components/MovieCard'
import { ROUTES } from '@/router/routes'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function WatchlistPage() {
  const { movies } = useWatchlist()

  return (
    <div className="min-h-screen bg-surface-black">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black text-text-primary">My Watchlist</h1>
          {movies.length > 0 && (
            <p className="mt-2 text-base text-text-secondary">
              {movies.length} {movies.length === 1 ? 'title' : 'titles'} saved
            </p>
          )}
        </motion.div>

        {movies.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center py-28 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-surface-border bg-surface-elevated">
              <Bookmark size={32} className="text-text-muted" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-text-primary">Nothing saved yet</h2>
            <p className="mt-3 max-w-[400px] text-base text-text-secondary">
              Movies and TV shows you bookmark will appear here. Start browsing to build your list.
            </p>
            <Link
              to={ROUTES.SEARCH}
              className="mt-8 flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-deep"
            >
              Browse Titles
            </Link>
          </motion.div>
        ) : (
          /* Grid with stagger */
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
          >
            {movies.map((movie) => (
              <motion.div key={movie.id} variants={item}>
                <MovieCard movie={movie} variant="watchlist" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
