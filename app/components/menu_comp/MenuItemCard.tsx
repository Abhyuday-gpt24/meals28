import Image from "next/image";
import AddToCartButton from "../cart_comp/AddToCartButton";
import type { SerializedMenuItem } from "@/lib/types/menu";

export default function MenuItemCard({ item }: { item: SerializedMenuItem }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:shadow-lg">
      {/* 1. COMPACT IMAGE CONTAINER */}
      {/* Replaced aspect-square with a fixed h-40/h-48 to heavily reduce vertical bloat */}
      <div className="relative h-40 w-full bg-gray-50 sm:h-48">
        <Image
          src={item.imageUrl || "/placeholder.png"}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Compact Veg Badge */}
        {item.isVegetarian && (
          <div className="absolute right-2 top-2 rounded bg-white/90 p-1 shadow-sm backdrop-blur-sm">
            <div className="flex h-3 w-3 items-center justify-center rounded-sm border-[1.5px] border-green-600">
              <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
            </div>
          </div>
        )}
      </div>

      {/* 2. COMPACT CONTENT CONTAINER */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Text wrappers with min-w-0 to prevent flexbox text overflow issues */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              {item.category?.name || "Menu Item"}
            </p>
            <h3 className="truncate text-base font-bold text-gray-900">
              {item.name}
            </h3>
          </div>

          <p className="shrink-0 text-lg font-black text-gray-900">
            ₹{item.price.toString()}
          </p>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {item.description}
        </p>

        {/* 3. INLINE BUTTON ALIGNMENT */}
        {/* Pushes the button to the bottom right instead of taking a whole row */}
        <div className="mt-4 flex flex-1 items-end justify-end">
          <AddToCartButton item={item} />
        </div>
      </div>
    </div>
  );
}
