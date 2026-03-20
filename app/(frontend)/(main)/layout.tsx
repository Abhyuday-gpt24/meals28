import { Suspense } from "react";
import Sidebar from "@/app/components/side_bar_comp/Sidebar";
import Header from "@/app/components/header_comp/Header";
import prisma from "@/lib/prisma";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Suspense>
        <Sidebar categories={categories} />
      </Suspense>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
