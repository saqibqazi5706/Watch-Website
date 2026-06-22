import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-40 animate-pulse rounded bg-zinc-800" />
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-zinc-800" />
        ))}
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
