import type { Trip } from "./types";

export function formatPrice(t: Pick<Trip, "price" | "salePrice" | "currency">) {
  const p = t.salePrice ?? t.price;
  if (!p) return null;
  return `${t.currency} ${new Intl.NumberFormat("en-PK").format(p)}`;
}
