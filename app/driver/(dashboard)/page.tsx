import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import AvailableOrderCard from "@/app/components/driver_comp/AvailableOrderCard";
import ActiveDeliveryCard from "@/app/components/driver_comp/ActiveDeliveryCard";

export default async function DriverPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const [availableOrders, myDeliveries] = await Promise.all([
    prisma.order.findMany({
      where: { status: "READY", driverId: null },
      include: {
        orderItems: { include: { menuItem: { select: { name: true } } } },
        deliveryAddress: true,
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.order.findMany({
      where: { driverId: user.id, status: "OUT_FOR_DELIVERY" },
      include: {
        orderItems: { include: { menuItem: { select: { name: true } } } },
        deliveryAddress: true,
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Serialize Decimal fields
  const serializeOrders = (orders: typeof availableOrders) =>
    orders.map((o) => ({
      ...o,
      totalAmount: o.totalAmount.toNumber(),
      orderItems: o.orderItems.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
      })),
    }));

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* My Active Deliveries */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          My Active Deliveries
        </h2>
        {myDeliveries.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed py-8 text-center text-sm text-gray-400">
            No active deliveries
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {serializeOrders(myDeliveries).map((order) => (
              <ActiveDeliveryCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* Available Orders */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Available Orders
        </h2>
        {availableOrders.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed py-8 text-center text-sm text-gray-400">
            No orders ready for delivery
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {serializeOrders(availableOrders).map((order) => (
              <AvailableOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
