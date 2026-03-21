"use client";

import { useCartStore } from "../../store/cartStore";
import { useToastStore } from "@/app/store/toastStore";
import type { SerializedMenuItem } from "@/lib/types/menu";

interface AddToCartButtonProps {
  item: SerializedMenuItem;
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  return (
    <button
      onClick={() => {
        addItem(item);
        addToast(`${item.name} added to cart!`);
      }}
      // Removed w-full, reduced padding (px-4 py-2 instead of px-6 py-3), shrunk icon
      className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-600 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="h-3.5 w-3.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      ADD
    </button>
  );
}
