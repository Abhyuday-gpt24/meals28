"use client";

import { useState } from "react";
import { createCoupon, updateCoupon } from "@/app/actions/coupon";

interface CouponFormProps {
  initialData?: {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    minOrderAmount: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    isActive: boolean;
    expiresAt: string | null;
  };
  onClose: () => void;
}

export default function CouponForm({ initialData, onClose }: CouponFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      code: form.get("code") as string,
      discountType: form.get("discountType") as string,
      discountValue: parseFloat(form.get("discountValue") as string),
      minOrderAmount: (form.get("minOrderAmount") as string) || undefined,
      maxDiscount: (form.get("maxDiscount") as string) || undefined,
      usageLimit: (form.get("usageLimit") as string) || undefined,
      isActive: form.get("isActive") === "on",
      expiresAt: (form.get("expiresAt") as string) || undefined,
    };

    const result = isEditing
      ? await updateCoupon(initialData.id, payload)
      : await createCoupon(payload);

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      const details = result.details
        ? Object.entries(result.details)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join("; ")
        : "";
      setError(details || result.error || "Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          {isEditing ? "Edit Coupon" : "Create Coupon"}
        </h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                name="code"
                defaultValue={initialData?.code}
                required
                placeholder="e.g. SAVE20"
                className="w-full rounded-lg border px-3 py-2 text-sm uppercase text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                name="discountType"
                defaultValue={initialData?.discountType ?? "PERCENTAGE"}
                className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Discount Value
              </label>
              <input
                name="discountValue"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.discountValue}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Max Discount (₹)
              </label>
              <input
                name="maxDiscount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.maxDiscount ?? ""}
                placeholder="For % type only"
                className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Min Order Amount (₹)
              </label>
              <input
                name="minOrderAmount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.minOrderAmount ?? ""}
                placeholder="Optional"
                className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Usage Limit
              </label>
              <input
                name="usageLimit"
                type="number"
                min="1"
                defaultValue={initialData?.usageLimit ?? ""}
                placeholder="Unlimited if empty"
                className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Expires At
            </label>
            <input
              name="expiresAt"
              type="datetime-local"
              defaultValue={initialData?.expiresAt ?? ""}
              className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-900">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={initialData?.isActive ?? true}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 accent-indigo-600"
            />
            Active
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
