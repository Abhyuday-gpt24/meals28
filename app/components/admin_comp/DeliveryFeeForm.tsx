"use client";

import { useState } from "react";
import { updateDeliveryFee } from "@/app/actions/settings";

export default function DeliveryFeeForm({
  currentFee,
}: {
  currentFee: number;
}) {
  const [fee, setFee] = useState(currentFee.toString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const numFee = parseFloat(fee);
    if (isNaN(numFee) || numFee < 0) {
      setMessage({ type: "error", text: "Please enter a valid non-negative amount" });
      setLoading(false);
      return;
    }

    const result = await updateDeliveryFee(numFee);
    setLoading(false);

    if (result.success) {
      setMessage({ type: "success", text: "Delivery fee updated" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Delivery Fee (₹)
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.01"
            min="0"
            value={fee}
            onChange={(e) => {
              setFee(e.target.value);
              setMessage(null);
            }}
            className="w-48 rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Set to 0 for free delivery.
        </p>
      </div>

      {message && (
        <p
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
