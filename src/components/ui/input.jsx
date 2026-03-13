import { cn } from '@/lib/utils'

function Input({ label, labelExtra, className, wrapperClassName, rightSlot, ...props }) {
  return (
    <div className={cn('flex flex-col gap-[6px]', wrapperClassName)}>
      {(label || labelExtra) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {label}
            </label>
          )}
          {labelExtra}
        </div>
      )}
      <div className="relative">
        <input
          className={cn(
            'h-[46px] w-full rounded-primary border border-surface-border bg-surface-elevated px-3 text-sm text-white transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none',
            rightSlot && 'pr-10',
            className
          )}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}

export { Input }
