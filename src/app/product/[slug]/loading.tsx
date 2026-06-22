export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square animate-pulse rounded-2xl bg-zinc-800" />
          <div className="mt-4 grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-zinc-800" />
            ))}
          </div>
        </div>
        {/* Info */}
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-800" />
          <div className="h-7 w-32 animate-pulse rounded bg-zinc-800" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="h-12 w-full max-w-xs animate-pulse rounded-lg bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
