export default function TrendingCardSkeleton() {
  return (
    <div className="w-[220px] shrink-0 animate-pulse">
      <div className="h-[330px] rounded-primary bg-surface-input" />
      <div className="mt-3 h-4 w-3/4 rounded bg-surface-input" />
      <div className="mt-2 h-3 w-1/2 rounded bg-surface-input" />
    </div>
  )
}
