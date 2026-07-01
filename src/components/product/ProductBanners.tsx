import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import type { BannerImage } from "@/types";

/**
 * Long "description" images stacked full-width below the product details.
 * Uses each image's real dimensions so tall strips render at natural aspect.
 */
export default function ProductBanners({
  banners,
}: {
  banners: BannerImage[];
}) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="mt-16 border-t border-zinc-800 pt-10">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-white">
        Product details
      </h2>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {banners.map((banner, i) => {
          const width = banner.dimensions?.width ?? 1000;
          const height = banner.dimensions?.height ?? 1000;
          return (
            <Image
              key={banner._key ?? i}
              src={urlFor(banner).width(1200).auto("format").url()}
              alt={banner.alt ?? "Product detail"}
              width={width}
              height={height}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full rounded-lg"
            />
          );
        })}
      </div>
    </section>
  );
}
