"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, LayoutGrid, List } from "lucide-react";
import type { Category } from "@/generated/prisma/client";

interface SidebarProps {
  categories: Pick<Category, "id" | "name">[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border bg-white p-2 text-gray-700 shadow-sm lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* MOBILE BACKDROP */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-white shadow-xl transition-all duration-300 ease-in-out
          w-72 transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-72"}
        `}
      >
        {/* TOP AREA */}
        <div className="relative flex h-20 items-center px-6 border-b">
          <Link
            href="/"
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              M
            </div>
            <span
              className={`text-xl font-black tracking-tight text-indigo-600 transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
            >
              MEALS<span className="text-gray-900">28</span>
            </span>
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-7 z-10 h-6 w-6 items-center justify-center rounded-full border bg-white text-gray-500 shadow-sm transition-transform hover:text-indigo-600"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            />
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-4 rounded-xl px-3 py-3 transition-all duration-200 ${
              pathname === "/" && !currentCategory
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LayoutGrid
              className={`h-5 w-5 shrink-0 ${
                pathname === "/" && !currentCategory
                  ? "text-indigo-600"
                  : "text-gray-400"
              }`}
            />
            <span
              className={`font-bold whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "lg:hidden" : "block"}`}
            >
              All Menu
            </span>
          </Link>

          <div className={`pt-4 pb-2 ${isCollapsed ? "lg:hidden" : "block"}`}>
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Categories
            </p>
          </div>

          {categories.map((category) => {
            const isActive = currentCategory === category.id;

            return (
              <Link
                key={category.id}
                href={`/?category=${encodeURIComponent(category.id)}`}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <List
                  className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400"}`}
                />
                <span
                  className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "lg:hidden" : "block"}`}
                >
                  {category.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
