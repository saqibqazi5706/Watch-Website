import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3 border-b border-zinc-800 pb-8">
        <div className="h-9 w-56 animate-pulse rounded bg-zinc-800" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-zinc-800" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
