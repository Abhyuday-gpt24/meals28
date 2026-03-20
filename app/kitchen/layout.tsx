import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-lg font-black text-gray-900">
          MEALS28 <span className="font-medium text-gray-500">Kitchen</span>
        </h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
