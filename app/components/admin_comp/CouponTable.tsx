"use client";

import { useState } from "react";
import { deleteCoupon, toggleCouponActive } from "@/app/actions/coupon";
import CouponForm from "./CouponForm";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface SerializedCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  _count: { orders: number };
}

export default function CouponTable({
  coupons,
}: {
  coupons: SerializedCoupon[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<SerializedCoupon | null>(
    null,
  );
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    const result = await deleteCoupon(id);
    if (!result.success) {
      setError(result.error || "Failed to delete");
    }
  }

  function formatDiscount(coupon: SerializedCoupon) {
    if (coupon.discountType === "PERCENTAGE") {
      const cap = coupon.maxDiscount ? ` (max ₹${coupon.maxDiscount})` : "";
      return `${coupon.discountValue}%${cap}`;
    }
    return `₹${coupon.discountValue}`;
  }

  function isExpired(coupon: SerializedCoupon) {
    return coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Coupon
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-500">Code</th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Discount
              </th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Min Order
              </th>
              <th className="px-6 py-3 font-semibold text-gray-500">Usage</th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Expires
              </th>
              <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-mono font-bold text-gray-900">
                  {coupon.code}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDiscount(coupon)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : "—"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {coupon.expiresAt ? (
                    <span
                      className={
                        isExpired(coupon) ? "text-red-500" : "text-gray-600"
                      }
                    >
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                      {isExpired(coupon) && " (expired)"}
                    </span>
                  ) : (
                    "Never"
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleCouponActive(coupon.id)}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors ${
                      coupon.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setShowForm(true);
                      }}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {coupons.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No coupons yet. Click &quot;Add Coupon&quot; to get started.
          </div>
        )}
      </div>

      {showForm && (
        <CouponForm
          initialData={editingCoupon ?? undefined}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
