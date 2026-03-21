"use client";

import { useState, useEffect } from "react";
import { addAddress, updateAddress } from "@/app/actions/user";
import type { Address } from "@/generated/prisma/client";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
}

export default function AddressModal({
  isOpen,
  onClose,
  address,
}: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!address;

  // Reset form when modal opens with different address
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen, address]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
    };

    const result = isEditing
      ? await updateAddress(address.id, payload)
      : await addAddress(payload);

    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Something went wrong.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipient Name
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={address?.name ?? ""}
                placeholder="John Doe"
                className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                defaultValue={address?.phone ?? ""}
                placeholder="9876543210"
                className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              required
              defaultValue={address?.street ?? ""}
              placeholder="123 Main St, Apt 4B"
              className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                defaultValue={address?.city ?? ""}
                placeholder="Agra"
                className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                required
                defaultValue={address?.state ?? ""}
                placeholder="UP"
                className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ZIP / PIN Code
            </label>
            <input
              type="text"
              name="zipCode"
              required
              defaultValue={address?.zipCode ?? ""}
              placeholder="282001"
              className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-70"
            >
              {isLoading
                ? "Saving..."
                : isEditing
                  ? "Update Address"
                  : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
