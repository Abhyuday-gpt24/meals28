"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, ShoppingBag, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

type ProfileDropdownProps = {
  user: { firstName: string | null; email: string } | null;
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Login
      </Link>
    );
  }

  const initial = (user.firstName?.[0] ?? user.email[0]).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 transition-all hover:ring-2 hover:ring-indigo-600 hover:ring-offset-2 active:scale-90"
        aria-label="Profile menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg transition-all animate-in fade-in zoom-in-95">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ShoppingBag className="h-4 w-4" />
            My Orders
          </Link>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
