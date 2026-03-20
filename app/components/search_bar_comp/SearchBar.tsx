"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default HTML form submission reload

    if (query.trim()) {
      // Push the user to the menu page with their search query in the URL
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      // If they clear the search and hit enter, just take them to the full menu
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      {/* Search Icon */}
      <svg
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>

      {/* Input Field */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for dishes..."
        className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
      />

      {/* Clear Button (Only shows if there is text) */}
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </form>
  );
}
