"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // 1. Pull exactly what we need from the Zustand store
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // 2. Calculate the financial totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 3. Lock background scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* 4. THE BACKDROP OVERLAY */}
      {/* Fades in and closes the drawer when clicked outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 5. THE SLIDE-OUT DRAWER */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[28rem] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Drawer Body (Scrollable Cart Items) */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            // Empty State
            <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-200">
                <svg
                  className="h-10 w-10"
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
              </div>
              <p className="text-lg font-medium text-gray-900">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-500">
                {"Looks like you haven't added any delicious meals yet."}
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-indigo-50 px-6 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-100"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            // List of Items
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  {/* Item Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-gray-50">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="font-black text-gray-900 ml-2">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>

                    {/* Controls Row */}
                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-lg border bg-white shadow-sm">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-indigo-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer (Checkout Section) */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50 px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium text-gray-500">
                Subtotal
              </span>
              <span className="text-xl font-black text-gray-900">
                ₹{subtotal}
              </span>
            </div>
            <p className="mb-6 text-xs text-gray-500">
              Taxes and delivery calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={onClose} // Close drawer when navigating
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
            >
              Go to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
