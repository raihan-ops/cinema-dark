export default function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-surface-black">
      <div className="h-120 w-full bg-surface-elevated" />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="-mt-50 flex flex-col gap-8 md:flex-row md:gap-10">
          <div className="mx-auto h-82.5 w-55 shrink-0 rounded-primary bg-surface-input md:mx-0" />
          <div className="flex-1 space-y-4 pt-0 md:pt-32.5">
            <div className="h-9 w-1/2 rounded bg-surface-input" />
            <div className="h-4 w-1/3 rounded bg-surface-input" />
            <div className="h-4 w-2/3 rounded bg-surface-input" />
            <div className="mt-6 flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-19 w-24 rounded-primary bg-surface-input"
                />
              ))}
            </div>
            <div className="h-11 w-44 rounded-primary bg-surface-input" />
          </div>
        </div>
        <div className="mt-12 space-y-3">
          <div className="h-5 w-32 rounded bg-surface-input" />
          <div className="h-4 w-full rounded bg-surface-input" />
          <div className="h-4 w-5/6 rounded bg-surface-input" />
          <div className="h-4 w-4/6 rounded bg-surface-input" />
        </div>
      </div>
    </div>
  );
}
