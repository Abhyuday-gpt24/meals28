import { Clock } from "lucide-react";
import type { OrderStatus } from "@/generated/prisma";

interface OrderCardProps {
  order: {
    id: string;
    status: OrderStatus;
    specialNotes: string | null;
    createdAt: Date;
    totalAmount: number;
    user: { firstName: string | null; lastName: string | null; email: string };
    orderItems: {
      id: string;
      quantity: number;
      menuItem: { name: string };
    }[];
  };
  onMove: (orderId: string, newStatus: OrderStatus) => void;
  loading: boolean;
}

const nextStatus: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  PENDING: { label: "Accept", status: "ACCEPTED" },
  ACCEPTED: { label: "Start Preparing", status: "PREPARING" },
  PREPARING: { label: "Mark Ready", status: "READY" },
};

export default function OrderCard({ order, onMove, loading }: OrderCardProps) {
  const elapsed = Math.round(
    (Date.now() - new Date(order.createdAt).getTime()) / 60000,
  );
  const customerName =
    [order.user.firstName, order.user.lastName].filter(Boolean).join(" ") ||
    order.user.email.split("@")[0];
  const next = nextStatus[order.status];

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-400">
          #{order.id.slice(0, 8)}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {elapsed}m
        </div>
      </div>

      <p className="mb-2 text-sm font-semibold text-gray-900">
        {customerName}
      </p>

      <ul className="mb-3 space-y-1">
        {order.orderItems.map((item) => (
          <li key={item.id} className="text-sm text-gray-600">
            <span className="font-medium">{item.quantity}x</span>{" "}
            {item.menuItem.name}
          </li>
        ))}
      </ul>

      {order.specialNotes && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {order.specialNotes}
        </p>
      )}

      {next && (
        <button
          onClick={() => onMove(order.id, next.status)}
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {next.label}
        </button>
      )}
    </div>
  );
}
