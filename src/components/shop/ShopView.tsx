"use client";

import { useMemo, useState } from "react";
import CategoryFilter from "@/components/shop/CategoryFilter";
import ProductGrid from "@/components/shop/ProductGrid";
import type { Category, Product } from "@/types";

interface ShopViewProps {
  products: Product[];
  categories: Category[];
}

export default function ShopView({ products, categories }: ShopViewProps) {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category?.slug === active);
  }, [active, products]);

  return (
    <div className="space-y-6">
      <CategoryFilter
        categories={categories}
        active={active}
        onSelect={setActive}
      />
      <ProductGrid products={filtered} />
    </div>
  );
}
