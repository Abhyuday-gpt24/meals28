import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      orderItems: { include: { menuItem: true } },
      deliveryAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Order History
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Track your current orders and view past receipts.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
            <p className="text-lg font-medium text-gray-900">No orders yet</p>
            <Link
              href="/"
              className="mt-4 font-bold text-indigo-600 hover:underline"
            >
              Start browsing the menu
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-gray-50/50 px-6 py-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Order Placed
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Total
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      ₹{order.totalAmount.toNumber()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                  <p className="text-xs font-medium text-gray-400">
                    #{order.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <ul className="space-y-3">
                  {order.orderItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="mr-3 flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-900">
                        {item.quantity}x
                      </span>
                      {item.menuItem.name}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex justify-end gap-4 border-t pt-4">
                  <Link
                    href="/"
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Reorder Items
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
