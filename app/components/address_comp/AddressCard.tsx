"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Address } from "@/generated/prisma/client";

interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const isSelectable = typeof onSelect === "function";

  const card = (
    <div
      className={`group relative rounded-2xl border-2 p-5 shadow-sm transition-all ${
        isSelectable ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-indigo-600 bg-indigo-50/50"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
          {address.isDefault ? "Default" : "Address"}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm font-bold text-gray-900">{address.name}</p>
      <p className="text-xs text-gray-500">{address.phone}</p>
      <p className="mt-2 text-sm text-gray-700">{address.street}</p>
      <p className="text-sm text-gray-500">
        {address.city}, {address.state} {address.zipCode}
      </p>

      {selected && (
        <div className="absolute bottom-4 right-4 text-indigo-600">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );

  return card;
}
