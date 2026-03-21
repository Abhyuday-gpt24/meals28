"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import type { Category } from "@/generated/prisma/client";

interface CategoryBarProps {
  categories: Pick<Category, "id" | "name">[];
}

export default function CategoryBar({ categories }: CategoryBarProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="scrollbar-hide overflow-x-auto border-b bg-white">
      <div className="flex items-center gap-2 px-4 py-3 lg:px-8">
        {/* All Menu pill */}
        <Link
          href="/"
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            !currentCategory
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          All
        </Link>

        {/* Category pills */}
        {categories.map((category) => {
          const isActive = currentCategory === category.id;

          return (
            <Link
              key={category.id}
              href={`/?category=${encodeURIComponent(category.id)}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
