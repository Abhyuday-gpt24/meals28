"use client";

import { useState } from "react";
import { deleteMenuItem, toggleAvailability } from "@/app/actions/menu";
import MenuItemForm from "./MenuItemForm";
import type { Category } from "@/generated/prisma";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface SerializedItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isVegetarian: boolean;
  categoryId: string | null;
  category: Category | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuItemTableProps {
  items: SerializedItem[];
  categories: Category[];
}

export default function MenuItemTable({
  items,
  categories,
}: MenuItemTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedItem | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-500">Name</th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 font-semibold text-gray-500">Price</th>
              <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.isVegetarian && (
                        <span className="text-xs text-green-600">Veg</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.category?.name || "—"}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₹{item.price}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors ${
                      item.isAvailable
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this menu item?")) {
                          deleteMenuItem(item.id);
                        }
                      }}
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

        {items.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No menu items yet. Click &quot;Add Item&quot; to get started.
          </div>
        )}
      </div>

      {showForm && (
        <MenuItemForm
          categories={categories}
          initialData={editingItem ?? undefined}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
