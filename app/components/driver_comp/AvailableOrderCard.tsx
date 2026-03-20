"use client";

import { useState } from "react";
import { claimOrder } from "@/app/actions/delivery";
import { MapPin, Package } from "lucide-react";

interface AvailableOrderCardProps {
  order: {
    id: string;
    totalAmount: number;
    createdAt: Date;
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    user: { firstName: string | null; lastName: string | null };
    orderItems: {
      id: string;
      quantity: number;
      menuItem: { name: string };
    }[];
  };
}

export default function AvailableOrderCard({
  order,
}: AvailableOrderCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const customerName =
    [order.user.firstName, order.user.lastName].filter(Boolean).join(" ") ||
    "Customer";

  async function handleClaim() {
    setLoading(true);
    setError("");
    const result = await claimOrder(order.id);
    if (!result.success) {
      setError(result.error || "Failed to claim");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-400">
          #{order.id.slice(0, 8)}
        </p>
        <p className="text-sm font-black text-gray-900">
          ₹{order.totalAmount}
        </p>
      </div>

      <p className="mb-2 text-sm font-semibold text-gray-900">
        {customerName}
      </p>

      <div className="mb-3 flex items-start gap-2 text-sm text-gray-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <span>
          {order.deliveryAddress.street}, {order.deliveryAddress.city}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Package className="h-4 w-4" />
        {order.orderItems.length} item(s)
      </div>

      {error && (
        <p className="mb-3 text-xs text-red-600">{error}</p>
      )}

      <button
        onClick={handleClaim}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Claiming..." : "Claim Delivery"}
      </button>
    </div>
  );
}
