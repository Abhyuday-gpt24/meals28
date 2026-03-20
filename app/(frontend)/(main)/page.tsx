import prisma from "@/lib/prisma";
import MenuGrid from "@/app/components/menu_comp/MenuGrid";
import type { SerializedMenuItem } from "@/lib/types/menu";

interface MenuPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const searchQuery = params.q;

  const categoryName = selectedCategory
    ? (
        await prisma.category.findUnique({
          where: { id: selectedCategory },
          select: { name: true },
        })
      )?.name ?? "Unknown Category"
    : null;

  const menuItems = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
      ...(selectedCategory ? { category: { id: selectedCategory } } : {}),
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" as const } },
              {
                description: {
                  contains: searchQuery,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { categoryId: "asc" },
  });

  const serializedItems: SerializedMenuItem[] = menuItems.map((item) => ({
    ...item,
    price: item.price.toNumber(),
  }));

  if (serializedItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : selectedCategory
              ? "No items in this category"
              : "Our kitchen is currently resting"}
        </h2>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {(selectedCategory || searchQuery) && (
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : categoryName}
          </h1>
        </div>
      )}
      <MenuGrid items={serializedItems} />
    </main>
  );
}
