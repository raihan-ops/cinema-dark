export default function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-primary bg-surface-card">
      <div className="aspect-[2/3] w-full bg-surface-border" />
      <div className="p-4">
        <div className="mb-2 h-4 w-3/4 rounded bg-surface-border" />
        <div className="mb-4 h-3 w-1/2 rounded bg-surface-border" />
        <div className="flex gap-2">
          <div className="h-[38px] flex-1 rounded-primary bg-surface-border" />
          <div className="h-[38px] flex-1 rounded-primary bg-surface-border" />
        </div>
      </div>
    </div>
  )
}
