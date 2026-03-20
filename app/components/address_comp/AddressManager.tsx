"use client";

import { useState } from "react";
import AddressModal from "./AddressModal";
import type { Address } from "@/generated/prisma";

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
        >
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {initialAddresses.map((address) => (
          <div
            key={address.id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                {address.isDefault ? "Default" : "Address"}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {address.street}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {address.city}, {address.state} {address.zipCode}
            </p>
          </div>
        ))}

        {/* Big Add New Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
        >
          <svg
            className="mb-2 h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="text-sm font-semibold">Add New Address</span>
        </button>
      </div>

      {/* The Actual Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
