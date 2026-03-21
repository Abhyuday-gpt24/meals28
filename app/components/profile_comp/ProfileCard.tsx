"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/user";
import { Pencil, X } from "lucide-react";

interface ProfileCardProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    createdAt: Date;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phone, setPhone] = useState(user.phone || "");

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email.split("@")[0];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateProfile({ firstName, lastName, phone });

    setLoading(false);
    if (result.success) {
      setIsEditing(false);
    } else {
      const details = result.details
        ? Object.entries(result.details)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join("; ")
        : "";
      setError(details || result.error || "Something went wrong");
    }
  }

  function handleCancel() {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhone(user.phone || "");
    setError("");
    setIsEditing(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="p-6">
        <div className="flex flex-col items-center border-b border-gray-100 pb-6">
          <div className="relative mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-100 shadow-lg">
            <span className="text-3xl font-black text-indigo-600">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-500">
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 pt-6">
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <p className="mt-1 text-sm text-gray-400">{user.email}</p>
              <p className="text-xs text-gray-400">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <p className="mt-1 font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Phone Number
              </label>
              <p className="mt-1 font-medium text-gray-900">
                {user.phone || "Not set"}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
