"use client";

import { useState } from "react";
import { createMenuItem, updateMenuItem } from "@/app/actions/menu";
import type { Category } from "@/generated/prisma";

interface MenuItemFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
    isVegetarian: boolean;
    categoryId: string | null;
  };
  onClose: () => void;
}

export default function MenuItemForm({
  categories,
  initialData,
  onClose,
}: MenuItemFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      description: (form.get("description") as string) || undefined,
      price: parseFloat(form.get("price") as string),
      imageUrl: (form.get("imageUrl") as string) || undefined,
      isAvailable: form.get("isAvailable") === "on",
      isVegetarian: form.get("isVegetarian") === "on",
      categoryId: (form.get("categoryId") as string) || null,
    };

    const result = isEditing
      ? await updateMenuItem(initialData.id, payload)
      : await createMenuItem(payload);

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          {isEditing ? "Edit Menu Item" : "Create Menu Item"}
        </h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              defaultValue={initialData?.name}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={initialData?.description ?? ""}
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price (₹)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.price}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={initialData?.categoryId ?? ""}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              name="imageUrl"
              defaultValue={initialData?.imageUrl ?? ""}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isAvailable"
                type="checkbox"
                defaultChecked={initialData?.isAvailable ?? true}
                className="rounded"
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isVegetarian"
                type="checkbox"
                defaultChecked={initialData?.isVegetarian ?? true}
                className="rounded"
              />
              Vegetarian
            </label>
          </div>

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
