import { Dialog } from '@base-ui/react/dialog'
import { useNavigate } from 'react-router-dom'
import { LogIn, X, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/uiStore'
import { ROUTES } from '@/router/routes'
import { cn } from '@/lib/utils'

export function AuthPromptDialog() {
  const open = useUiStore((s) => s.authPromptOpen)
  const closeAuthPrompt = useUiStore((s) => s.closeAuthPrompt)
  const navigate = useNavigate()

  function handleLogin() {
    closeAuthPrompt()
    navigate(ROUTES.LOGIN)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => !isOpen && closeAuthPrompt()}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm',
            'transition-opacity duration-200',
            'data-ending-style:opacity-0 data-starting-style:opacity-0'
          )}
        />
        <Dialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-sm',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-xl border border-surface-border bg-surface-elevated p-6 shadow-card',
            'transition-all duration-200',
            'data-ending-style:opacity-0 data-ending-style:scale-95',
            'data-starting-style:opacity-0 data-starting-style:scale-95'
          )}
        >
          {/* Close button */}
          <Dialog.Close
            render={
              <button className="cursor-pointer absolute top-4 right-4 rounded-md p-1 text-text-muted transition-colors hover:text-text-primary" />
            }
          >
            <X size={16} />
          </Dialog.Close>

          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Film size={24} className="text-primary" />
          </div>

          {/* Title */}
          <Dialog.Title className="mb-1 text-lg font-bold text-text-primary">
            Sign in required
          </Dialog.Title>

          {/* Description */}
          <Dialog.Description className="mb-6 text-sm text-text-secondary">
            You need to be logged in to add movies to your watchlist.
          </Dialog.Description>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={closeAuthPrompt}
            >
              Cancel
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary-deep" onClick={handleLogin}>
              <LogIn size={15} />
              Login
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
