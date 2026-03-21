"use client";

import { useState } from "react";
import AddressModal from "./AddressModal";
import { deleteAddress } from "@/app/actions/user";
import { Pencil, Trash2 } from "lucide-react";
import type { Address } from "@/generated/prisma/client";

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [error, setError] = useState("");

  function handleAdd() {
    setEditingAddress(null);
    setIsModalOpen(true);
  }

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    setError("");
    const result = await deleteAddress(id);
    if (!result.success) {
      setError(result.error || "Failed to delete address");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
        >
          Add New
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {initialAddresses.map((address) => (
          <div
            key={address.id}
            className="group rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                {address.isDefault ? "Default" : "Address"}
              </span>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(address)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-900">{address.name}</p>
            <p className="text-xs text-gray-500">{address.phone}</p>
            <p className="mt-2 text-sm text-gray-700">{address.street}</p>
            <p className="text-sm text-gray-500">
              {address.city}, {address.state} {address.zipCode}
            </p>
          </div>
        ))}

        {/* Big Add New Card */}
        <button
          onClick={handleAdd}
          className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition-all hover:border-indigo-300 hover:text-indigo-600"
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

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
      />
    </div>
  );
}
