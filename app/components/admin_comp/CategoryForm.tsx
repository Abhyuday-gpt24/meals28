"use client";

import { useState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/menu";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface CategoryWithCount {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { menuItems: number };
}

export default function CategoryForm({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await createCategory({ name, description: description || undefined });
    if (result.success) {
      setShowCreate(false);
      setName("");
      setDescription("");
    } else {
      setError(result.error || "Failed to create");
    }
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setError("");
    const result = await updateCategory(id, { name, description: description || undefined });
    if (result.success) {
      setEditingId(null);
      setName("");
      setDescription("");
    } else {
      setError(result.error || "Failed to update");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const result = await deleteCategory(id);
    if (!result.success) {
      setError(result.error || "Failed to delete");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowCreate(true);
            setEditingId(null);
            setName("");
            setDescription("");
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="flex items-end gap-3 rounded-xl border bg-white p-4"
        >
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-500">Name</th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Description
              </th>
              <th className="px-6 py-3 font-semibold text-gray-500">Items</th>
              <th className="px-6 py-3 font-semibold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) =>
              editingId === cat.id ? (
                <tr key={cat.id} className="bg-indigo-50/30">
                  <td className="px-6 py-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded border px-2 py-1 text-sm text-gray-900"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded border px-2 py-1 text-sm text-gray-900"
                    />
                  </td>
                  <td className="px-6 py-3">{cat._count.menuItems}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleUpdate(e, cat.id)}
                        className="rounded bg-indigo-600 px-3 py-1 text-xs font-bold text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded border px-3 py-1 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cat.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cat._count.menuItems}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setName(cat.name);
                          setDescription(cat.description || "");
                          setShowCreate(false);
                        }}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No categories yet. Click &quot;Add Category&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
