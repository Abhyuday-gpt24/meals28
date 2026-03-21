"use client";

import { useState } from "react";
import { useCartStore } from "@/app/store/cartStore";
import { placeOrder } from "@/app/actions/order";
import { applyCoupon } from "@/app/actions/coupon";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import AddressManager from "@/app/components/address_comp/AddressManager";
import type { Address } from "@/generated/prisma/client";

export default function CheckoutForm({
  addresses,
  deliveryFee,
}: {
  addresses: Address[];
  deliveryFee: number;
}) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedCoupon?.discount ?? 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");

    const result = await applyCoupon(couponCode, subtotal);

    if (result.success) {
      setAppliedCoupon({ code: result.code!, discount: result.discount! });
      setCouponCode("");
    } else {
      setCouponError(result.error || "Invalid coupon");
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    setIsSubmitting(true);

    const payload = {
      addressId: selectedAddressId,
      items: items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
      couponCode: appliedCoupon?.code || "",
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
      {/* LEFT: Address Selection (reuses profile address cards) */}
      <section>
        <AddressManager
          initialAddresses={addresses}
          selectedId={selectedAddressId}
          onSelect={setSelectedAddressId}
        />
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

        {/* Coupon Section */}
        <div className="border-b py-6">
          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
              <div>
                <span className="text-sm font-bold text-green-700">
                  {appliedCoupon.code}
                </span>
                <span className="ml-2 text-sm text-green-600">
                  − ₹{appliedCoupon.discount} off
                </span>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="rounded p-1 text-green-600 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Have a coupon?
              </label>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm uppercase text-gray-900 outline-none focus:border-indigo-600"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-xs text-red-500">{couponError}</p>
              )}
            </div>
          )}
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
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>− ₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-3 text-lg font-black text-gray-900">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting || items.length === 0 || !selectedAddressId}
          className="mt-8 w-full rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
        </button>
      </section>
    </div>
  );
}
