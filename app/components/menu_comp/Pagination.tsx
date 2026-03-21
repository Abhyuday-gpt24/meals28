"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "/";
  }

  // Show at most 5 page numbers centered around current page
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 text-gray-300">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 text-gray-300">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
