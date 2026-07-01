import type { PortableTextBlock } from "@portabletext/types";

/** A Sanity image object with optional alt text (as stored in documents). */
export interface SanityImageWithAlt {
  _type: "image";
  _key?: string;
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// ---------------------------------------------------------------------------
// Sanity content types (products & categories live in Sanity, not Supabase).
// Shapes match the GROQ projections in src/lib/queries.ts.
// ---------------------------------------------------------------------------

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: SanityImageWithAlt | null;
}

/** A stacked "description" image shown below the product, with its real size. */
export interface BannerImage extends SanityImageWithAlt {
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand?: string | null;
  sku?: string | null;
  price: number;
  inStock: boolean;
  /** Portable Text — only fetched on the product detail query. */
  description?: PortableTextBlock[] | null;
  images?: SanityImageWithAlt[] | null;
  /** Long promo/description strips shown stacked below the product. */
  bannerImages?: BannerImage[] | null;
  category?: Category | null;
}

// ---------------------------------------------------------------------------
// Order types (orders & order_items live in Supabase).
// ---------------------------------------------------------------------------

export type PaymentMethod = "cod" | "bank_transfer";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  street: string;
  city: string;
  postal_code: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: Address;
  payment_method: PaymentMethod;
  receipt_url: string | null;
  status: OrderStatus;
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  /** Sanity product `_id` (text, not a Supabase FK). */
  product_id: string;
  /** Denormalised so order history survives product edits/deletions. */
  product_name: string;
  quantity: number;
  price: number;
}

// ---------------------------------------------------------------------------
// Client-side cart & checkout.
// ---------------------------------------------------------------------------

/** A product line held in the cart (persisted to localStorage). */
export interface CartItem {
  /** Sanity product `_id`. */
  id: string;
  name: string;
  slug: string;
  price: number;
  /** Resolved Sanity image URL (built via urlFor), or null. */
  image: string | null;
  brand: string | null;
  quantity: number;
}

/** Shape of the checkout form submitted by the customer. */
export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  street: string;
  city: string;
  postal_code: string;
  payment_method: PaymentMethod;
}
