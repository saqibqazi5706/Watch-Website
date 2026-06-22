/**
 * Static site identity. Store name/tagline are brand constants (safe to
 * hardcode). Contact + payment details must always come from env vars.
 */
export const SITE = {
  name: "OLEVS",
  tagline: "Timeless precision, delivered.",
} as const;

/** Primary nav links shown in the navbar. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
