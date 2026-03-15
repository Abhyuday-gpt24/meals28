import Image from "next/image";
import prisma from "@/lib/prisma";
import AddToCartButton from "../../components/AddToCartButton"; // 1. Import the new button

export default async function MenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    orderBy: { categoryId: "asc" },
  });

  if (menuItems.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-500">Menu is empty.</h2>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-extrabold text-gray-900">
        Meals28 Menu
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            <div className="relative aspect-square w-full bg-gray-100 sm:aspect-[4/3]">
              <Image
                src={item.imageUrl || "/placeholder.png"}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="flex justify-between gap-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-lg font-semibold text-indigo-600">
                    ₹{item.price.toString()}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>

              {/* 2. Inject the Client Component and pass the database record to it */}
              <AddToCartButton item={item} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
