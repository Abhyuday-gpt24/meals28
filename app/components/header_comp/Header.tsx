"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "../../store/cartStore";
import CartDrawer from "../cart_comp/CartDrawer";
import SearchBar from "../search_bar_comp/SearchBar";
import ProfileDropdown from "../navbar/ProfileDropdown";

type HeaderProps = {
  user: { firstName: string | null; email: string } | null;
};

export default function Header({ user }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="https://meals28.com/wp-content/uploads/2025/11/meals28-logo1.png"
            alt="Meals28"
            width={120}
            height={28}
            className="object-contain"
          />
        </Link>

        {/* Center: Search (desktop) */}
        <div className="mx-6 hidden max-w-md flex-1 lg:block">
          <SearchBar />
        </div>

        {/* Right: Cart & Profile */}
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

          {/* User Profile Dropdown */}
          <ProfileDropdown user={user} />
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
