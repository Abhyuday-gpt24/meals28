"use client";
import type { MenuItem } from "@db";
import { useCartStore } from "../store/cartStore";

// We pass the raw MenuItem data from the Server Component down to this Client Component
export default function AddToCartButton({ item }: { item: MenuItem }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() => addItem(item)}
      className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-95"
    >
      Add to Cart
    </button>
  );
}
