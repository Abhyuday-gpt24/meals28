import type { SerializedMenuItem } from "@/lib/types/menu";
import MenuItemCard from "./MenuItemCard";

interface MenuGridProps {
  items: SerializedMenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
