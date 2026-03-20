import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SerializedMenuItem } from "@/lib/types/menu";

// 1. Define the shape of a Cart Item (SerializedMenuItem + Quantity)
export interface CartItem extends SerializedMenuItem {
  quantity: number;
}

// 2. Define the shape of the Store (State + Actions)
interface CartState {
  items: CartItem[];
  addItem: (item: SerializedMenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// 3. Create the Store with Persistence
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            // If it's already in the cart, just bump the quantity
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          // If it's new, add it with a quantity of 1
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "meals28-cart", // The key used in localStorage
    },
  ),
);
