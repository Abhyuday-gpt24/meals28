"use client";

import { useState } from "react";
import { markDelivered } from "@/app/actions/delivery";
import { MapPin, CheckCircle } from "lucide-react";

interface ActiveDeliveryCardProps {
  order: {
    id: string;
    totalAmount: number;
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

export default function ActiveDeliveryCard({
  order,
}: ActiveDeliveryCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const customerName =
    [order.user.firstName, order.user.lastName].filter(Boolean).join(" ") ||
    "Customer";

  async function handleDeliver() {
    setLoading(true);
    setError("");
    const result = await markDelivered(order.id);
    if (!result.success) {
      setError(result.error || "Failed to mark delivered");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/30 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-indigo-400">
          #{order.id.slice(0, 8)}
        </p>
        <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
          OUT FOR DELIVERY
        </span>
      </div>

      <p className="mb-2 text-sm font-semibold text-gray-900">
        {customerName}
      </p>

      <div className="mb-3 flex items-start gap-2 text-sm text-gray-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
        <div>
          <p>{order.deliveryAddress.street}</p>
          <p>
            {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
            {order.deliveryAddress.zipCode}
          </p>
        </div>
      </div>

      <ul className="mb-4 space-y-1">
        {order.orderItems.map((item) => (
          <li key={item.id} className="text-sm text-gray-600">
            <span className="font-medium">{item.quantity}x</span>{" "}
            {item.menuItem.name}
          </li>
        ))}
      </ul>

      <p className="mb-4 text-right text-lg font-black text-gray-900">
        ₹{order.totalAmount}
      </p>

      {error && (
        <p className="mb-3 text-xs text-red-600">{error}</p>
      )}

      <button
        onClick={handleDeliver}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
      >
        <CheckCircle className="h-4 w-4" />
        {loading ? "Updating..." : "Mark Delivered"}
      </button>
    </div>
  );
}
