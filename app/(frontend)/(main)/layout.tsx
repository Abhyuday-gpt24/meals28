import { Suspense } from "react";
import CategoryBar from "@/app/components/category_bar_comp/CategoryBar";
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header user={user} />
      <Suspense>
        <CategoryBar categories={categories} />
      </Suspense>
      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
