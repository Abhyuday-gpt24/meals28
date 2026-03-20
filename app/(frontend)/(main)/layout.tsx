import { Suspense } from "react";
import Sidebar from "@/app/components/side_bar_comp/Sidebar";
import Header from "@/app/components/header_comp/Header";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, authUser] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
    getAuthenticatedUser(),
  ]);

  const user = authUser
    ? { firstName: authUser.firstName, email: authUser.email }
    : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Suspense>
        <Sidebar categories={categories} />
      </Suspense>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
