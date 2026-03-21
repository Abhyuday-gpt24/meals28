"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateOrderStatus } from "@/app/actions/kitchen";
import OrderCard from "./OrderCard";
import type { OrderStatus } from "@/generated/prisma/client";

interface SerializedOrder {
  id: string;
  status: OrderStatus;
  specialNotes: string | null;
  createdAt: Date;
  totalAmount: number;
  user: { firstName: string | null; lastName: string | null; email: string };
  orderItems: {
    id: string;
    quantity: number;
    unitPrice: number;
    menuItem: { name: string; price: number; id: string; description: string | null; imageUrl: string | null; isAvailable: boolean; isVegetarian: boolean; categoryId: string | null; createdAt: Date; updatedAt: Date };
  }[];
}

const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: "PENDING", label: "New Orders", color: "border-amber-300" },
  { status: "ACCEPTED", label: "Accepted", color: "border-blue-300" },
  { status: "PREPARING", label: "Preparing", color: "border-orange-300" },
  { status: "READY", label: "Ready", color: "border-green-300" },
];

export default function KanbanBoard({
  initialOrders,
}: {
  initialOrders: SerializedOrder[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  // Real-time subscription for live updates
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Order",
        },
        () => {
          // Refresh server data on any order change
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // Keep in sync with server refreshes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  async function handleMove(orderId: string, newStatus: OrderStatus) {
    setLoadingId(orderId);

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    const result = await updateOrderStatus(orderId, newStatus);

    if (!result.success) {
      // Revert on failure
      setOrders(initialOrders);
    }

    setLoadingId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => {
        const columnOrders = orders.filter((o) => o.status === col.status);

        return (
          <div key={col.status} className="space-y-4">
            <div
              className={`flex items-center justify-between rounded-lg border-t-4 bg-white px-4 py-3 ${col.color}`}
            >
              <h2 className="text-sm font-bold text-gray-900">{col.label}</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                {columnOrders.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMove={handleMove}
                  loading={loadingId === order.id}
                />
              ))}

              {columnOrders.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-400">
                  No orders
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
