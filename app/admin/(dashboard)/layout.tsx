import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, UtensilsCrossed, Tag, Ticket, Settings, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-white">
        <div className="border-b px-6 py-5">
          <h1 className="text-lg font-black text-gray-900">MEALS28</h1>
          <p className="text-xs font-medium text-gray-500">Admin Dashboard</p>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Menu Items
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Tag className="h-4 w-4" />
            Categories
          </Link>
          <Link
            href="/admin/coupons"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Ticket className="h-4 w-4" />
            Coupons
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="mt-auto border-t p-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
