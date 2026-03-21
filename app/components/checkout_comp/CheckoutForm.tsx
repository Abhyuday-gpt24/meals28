"use client";

import { useState } from "react";
import { useCartStore } from "@/app/store/cartStore";
import { placeOrder } from "@/app/actions/order";
import { useRouter } from "next/navigation";
import type { Address } from "@/generated/prisma/client";

export default function CheckoutForm({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    setIsSubmitting(true);

    // Prepare the Zod-compatible payload
    const payload = {
      addressId: selectedAddressId,
      items: items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
    };

    const result = await placeOrder(payload);

    if (result.success) {
      clearCart();
      router.push(`/orders?success=true&orderId=${result.orderId}`);
    } else {
      alert(result.error || "Order failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* LEFT: Address Selection */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">1. Delivery Address</h2>
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                selectedAddressId === addr.id
                  ? "border-indigo-600 bg-indigo-50/50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="address"
                className="sr-only"
                onChange={() => setSelectedAddressId(addr.id)}
                checked={selectedAddressId === addr.id}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">
                  {addr.street}
                </span>
                <span className="text-xs text-gray-500">
                  {addr.city}, {addr.state} {addr.zipCode}
                </span>
              </div>
              {selectedAddressId === addr.id && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
      </section>

      {/* RIGHT: Order Summary */}
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          2. Order Summary
        </h2>
        <div className="space-y-4 border-b pb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm text-gray-600"
            >
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold text-gray-900">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-6">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-lg font-black text-gray-900">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting || items.length === 0}
          className="mt-8 w-full rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
        </button>
      </section>
    </div>
  );
}
