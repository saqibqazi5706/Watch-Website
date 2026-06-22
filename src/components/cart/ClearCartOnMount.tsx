"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Clears the cart once when mounted (used on the order-confirmed page). */
export default function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
