import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/sanity";
import type { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  const cover = imageUrl(category.coverImage, 600, 400);

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex aspect-[3/2] items-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
    >
      {cover && (
        <Image
          src={cover}
          alt={category.coverImage?.alt ?? category.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      <div className="relative p-5">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {category.name}
        </h3>
        <span className="text-sm text-amber-400">Shop now →</span>
      </div>
    </Link>
  );
}
