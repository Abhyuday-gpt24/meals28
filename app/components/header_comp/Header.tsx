"use client";

import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import CartDrawer from "../cart_comp/CartDrawer";
import SearchBar from "../search_bar_comp/SearchBar"; // Import our new component
import Link from "next/link";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md lg:px-8">
        {/* Left Side: Mobile Spacing */}
        <div className="flex flex-1 items-center gap-4 lg:hidden">
          {/* Spacing for mobile hamburger menu */}
        </div>

        {/* Center: The new SearchBar Component */}
        <div className="hidden flex-1 items-center lg:flex">
          <SearchBar />
        </div>

        {/* Right Side: Cart & Profile */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center p-2 text-gray-600 transition-colors hover:text-indigo-600"
            aria-label="Open Cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.112 16.851a.75.75 0 0 1-.747.799H3.03a.75.75 0 0 1-.747-.799l1.112-16.851a.75.75 0 0 1 .747-.741h14.59a.75.75 0 0 1 .747.741Z"
              />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white transition-transform group-active:scale-90">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <Link
            href="/profile"
            className="group relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-indigo-200 bg-indigo-100 transition-all hover:ring-2 hover:ring-indigo-600 hover:ring-offset-2 active:scale-90"
            title="View Profile"
          >
            <svg
              className="mt-1.5 h-7 w-full text-indigo-500 transition-colors group-hover:text-indigo-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </Link>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
