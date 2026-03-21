"use client";

import { useState } from "react";
import AddressModal from "./AddressModal";
import AddressCard from "./AddressCard";
import { deleteAddress } from "@/app/actions/user";
import { Plus } from "lucide-react";
import type { Address } from "@/generated/prisma/client";

interface AddressManagerProps {
  initialAddresses: Address[];
  /** When provided, enables selection mode and reports the selected address ID */
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export default function AddressManager({
  initialAddresses,
  selectedId,
  onSelect,
}: AddressManagerProps) {
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
        <h3 className="text-xl font-bold text-gray-900">
          {onSelect ? "Select Delivery Address" : "Saved Addresses"}
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
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
          <AddressCard
            key={address.id}
            address={address}
            selected={selectedId === address.id}
            onSelect={onSelect ? () => onSelect(address.id) : undefined}
            onEdit={() => handleEdit(address)}
            onDelete={() => handleDelete(address.id)}
          />
        ))}

        {/* Add New Card */}
        <button
          onClick={handleAdd}
          className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition-all hover:border-indigo-300 hover:text-indigo-600"
        >
          <Plus className="mb-2 h-8 w-8" />
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
