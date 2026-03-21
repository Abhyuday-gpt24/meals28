import prisma from "@/lib/prisma";
import MenuGrid from "@/app/components/menu_comp/MenuGrid";
import Pagination from "@/app/components/menu_comp/Pagination";
import type { SerializedMenuItem } from "@/lib/types/menu";

const PAGE_SIZE = 12;

// Priority order for "All Menu" view — lower index = shown first
const CATEGORY_PRIORITY = [
  "Snacks",
  "Chinese",
  "South Indian",
  "Sandwiches & Burgers",
  "Drinks",
  "Curries & Sabji",
  "Pasta & Soups",
];

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

  const isAllMenu = !selectedCategory && !searchQuery;

  // Build a category name → priority map for sorting
  let categoryPriorityMap: Map<string, number> | null = null;
  if (isAllMenu) {
    const allCategories = await prisma.category.findMany({
      select: { id: true, name: true },
    });
    categoryPriorityMap = new Map();
    for (const cat of allCategories) {
      const idx = CATEGORY_PRIORITY.indexOf(cat.name);
      categoryPriorityMap.set(cat.id, idx === -1 ? CATEGORY_PRIORITY.length : idx);
    }
  }

  const [menuItems, totalCount] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
      // Fetch all for priority sort on "All Menu", otherwise paginate normally
      ...(isAllMenu ? {} : { skip: (currentPage - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    }),
    prisma.menuItem.count({ where }),
  ]);

  // Apply priority sort for "All Menu" then paginate in memory
  let sortedItems = menuItems;
  if (isAllMenu && categoryPriorityMap) {
    sortedItems = [...menuItems].sort((a, b) => {
      const pa = categoryPriorityMap!.get(a.categoryId ?? "") ?? CATEGORY_PRIORITY.length;
      const pb = categoryPriorityMap!.get(b.categoryId ?? "") ?? CATEGORY_PRIORITY.length;
      return pa - pb || a.name.localeCompare(b.name);
    });
    sortedItems = sortedItems.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const serializedItems: SerializedMenuItem[] = sortedItems.map((item) => ({
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
