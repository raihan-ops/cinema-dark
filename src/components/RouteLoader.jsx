import { Film } from 'lucide-react'

export default function RouteLoader({ fullScreen = false }) {
  return (
    <div
      className={[
        'flex items-center justify-center bg-surface-black',
        fullScreen ? 'min-h-screen' : 'min-h-[calc(100vh-73px)] w-full',
      ].join(' ')}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Icon ring */}
        <div className="relative flex size-15 items-center justify-center rounded-full border-2 border-surface-border bg-surface-elevated shadow-glow">
          <Film size={24} className="text-primary" />
          {/* spinning arc overlay */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>

        {/* Label */}
        <span className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase">
          Loading...
        </span>

        {/* Progress bar */}
        <div className="h-0.5 w-40 overflow-hidden rounded-full bg-surface-border">
          <div className="h-full w-full origin-left animate-[progress_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}