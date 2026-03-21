import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== "DRIVER" && user.role !== "ADMIN")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="https://meals28.com/wp-content/uploads/2025/11/meals28-logo1.png"
            alt="Meals28"
            width={120}
            height={28}
            className="object-contain"
          />
          <span className="text-sm font-medium text-gray-500">Delivery</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
