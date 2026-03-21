import prisma from "@/lib/prisma";
import MenuGrid from "@/app/components/menu_comp/MenuGrid";
import Pagination from "@/app/components/menu_comp/Pagination";
import type { SerializedMenuItem } from "@/lib/types/menu";

const PAGE_SIZE = 12;

interface MenuPageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const searchQuery = params.q;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const categoryName = selectedCategory
    ? (
        await prisma.category.findUnique({
          where: { id: selectedCategory },
          select: { name: true },
        })
      )?.name ?? "Unknown Category"
    : null;

  const where = {
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
  };

  const [menuItems, totalCount] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: { categoryId: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.menuItem.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const serializedItems: SerializedMenuItem[] = menuItems.map((item) => ({
    ...item,
    price: item.price.toNumber(),
  }));

  if (serializedItems.length === 0 && currentPage === 1) {
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
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </main>
  );
}
