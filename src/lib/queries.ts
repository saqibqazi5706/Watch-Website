import { defineQuery } from "next-sanity";

// Shared projections kept inline (rather than GROQ fragments) so Sanity
// TypeGen can infer literal result types per query.

/** All products, newest first — for the shop grid. */
export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(_createdAt desc){
    _id,
    name,
    "slug": slug.current,
    brand,
    sku,
    price,
    inStock,
    images,
    category->{ _id, name, "slug": slug.current }
  }
`);

/** First 8 products for the homepage "Featured" strip. */
export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(_createdAt desc)[0...8]{
    _id,
    name,
    "slug": slug.current,
    brand,
    sku,
    price,
    inStock,
    images,
    category->{ _id, name, "slug": slug.current }
  }
`);

/** Single product detail by slug. */
export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    brand,
    sku,
    price,
    inStock,
    description,
    images,
    bannerImages[]{
      ...,
      "dimensions": asset->metadata.dimensions
    },
    category->{ _id, name, "slug": slug.current, description }
  }
`);

/** All product slugs — for generateStaticParams. */
export const PRODUCT_SLUGS_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current)]{ "slug": slug.current }
`);

/** Related products in the same category (excluding the current product). */
export const RELATED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && category->slug.current == $categorySlug && slug.current != $slug][0...4]{
    _id,
    name,
    "slug": slug.current,
    brand,
    sku,
    price,
    inStock,
    images,
    category->{ _id, name, "slug": slug.current }
  }
`);

/** All categories, alphabetical — for nav, filters and the homepage. */
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    description,
    coverImage
  }
`);

/** Single category by slug — for the category page hero. */
export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    description,
    coverImage
  }
`);

/** All category slugs — for generateStaticParams. */
export const CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`);

/** Trusted price/stock lookup by product ids — used to verify orders server-side. */
export const PRODUCTS_FOR_ORDER_QUERY = defineQuery(`
  *[_type == "product" && _id in $ids]{ _id, name, price, inStock }
`);

/** Products within a category, by category slug. */
export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "product" && category->slug.current == $slug] | order(_createdAt desc){
    _id,
    name,
    "slug": slug.current,
    brand,
    sku,
    price,
    inStock,
    images,
    category->{ _id, name, "slug": slug.current }
  }
`);
