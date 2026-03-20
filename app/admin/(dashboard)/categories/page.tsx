import prisma from "@/lib/prisma";
import CategoryForm from "@/app/components/admin_comp/CategoryForm";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { menuItems: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Categories
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Organize your menu with categories.
        </p>
      </div>

      <CategoryForm categories={categories} />
    </div>
  );
}
