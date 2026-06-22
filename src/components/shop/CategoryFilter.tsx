"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  active: string; // category slug, or "all"
  onSelect: (slug: string) => void;
}

export default function CategoryFilter({
  categories,
  active,
  onSelect,
}: CategoryFilterProps) {
  const pills = [{ _id: "all", name: "All", slug: "all" }, ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((c) => {
        const isActive = active === c.slug;
        return (
          <button
            key={c._id}
            type="button"
            onClick={() => onSelect(c.slug)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              isActive
                ? "border-amber-400 bg-amber-400 font-semibold text-zinc-950"
                : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
            )}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
