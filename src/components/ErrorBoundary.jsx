import { Component } from 'react'
import { Film } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-surface-black px-8 text-center">
          <Film size={48} className="mb-4 text-text-muted" />
          <p className="text-5xl font-black text-primary">Error</p>
          <p className="mt-4 text-2xl font-bold text-text-primary">Something went wrong</p>
          <p className="mt-2 max-w-[420px] text-base text-text-secondary">
            An unexpected error occurred. Refresh the page or navigate back home.
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex h-11 items-center rounded-primary border border-surface-border px-5 text-sm font-bold text-text-nav transition-colors hover:text-white"
            >
              Refresh
            </button>
            <a
              href="/search"
              className="flex h-11 items-center rounded-primary bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-deep"
            >
              Go Home
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
