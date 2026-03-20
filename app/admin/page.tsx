import prisma from "@/lib/prisma";
import { Package, IndianRupee, Clock, UtensilsCrossed } from "lucide-react";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, pendingOrders, totalMenuItems, revenueToday] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.menuItem.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: today } },
      }),
    ]);

  const stats = [
    {
      label: "Orders Today",
      value: ordersToday,
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Revenue Today",
      value: `₹${revenueToday._sum.totalAmount?.toNumber() ?? 0}`,
      icon: IndianRupee,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "Menu Items",
      value: totalMenuItems,
      icon: UtensilsCrossed,
      color: "text-indigo-600 bg-indigo-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your restaurant today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
