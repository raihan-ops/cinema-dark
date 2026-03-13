import { Toaster as Sonner } from 'sonner'

function Toaster({ ...props }) {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toaster: 'group toaster',
          toast:
            'group toast flex items-start gap-3 rounded-primary border border-surface-border bg-surface-elevated text-text-primary shadow-card',
          title: 'text-sm font-semibold text-text-primary',
          description: 'text-xs text-text-secondary',
          actionButton:
            'rounded-primary bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary-deep',
          cancelButton:
            'rounded-primary bg-surface-card px-3 py-1 text-xs font-semibold text-text-muted hover:text-white',
          closeButton:
            'border-surface-border bg-surface-card text-text-muted hover:text-white',
          error:
            'border-primary/30 bg-primary/10 text-primary-soft',
          success:
            'border-success/30 bg-success/10 text-success',
          warning:
            'border-warning/30 bg-warning/10 text-warning',
          info:
            'border-white/10 bg-surface-elevated text-text-primary',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
