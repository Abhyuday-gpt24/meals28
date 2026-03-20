import prisma from "@/lib/prisma";
import MenuItemTable from "@/app/components/admin_comp/MenuItemTable";

export default async function AdminMenuPage() {
  const [menuItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Serialize Decimal price for client component
  const serializedItems = menuItems.map((item) => ({
    ...item,
    price: item.price.toNumber(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Menu Items
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create, edit, and manage your restaurant menu.
        </p>
      </div>

      <MenuItemTable items={serializedItems} categories={categories} />
    </div>
  );
}
