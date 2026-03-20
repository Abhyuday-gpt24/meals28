import prisma from "@/lib/prisma";
import KanbanBoard from "@/app/components/kitchen_comp/KanbanBoard";

export default async function KitchenPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PENDING", "ACCEPTED", "PREPARING", "READY"] },
    },
    include: {
      orderItems: { include: { menuItem: true } },
      user: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Serialize Decimal fields for client component
  const serialized = orders.map((order) => ({
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toNumber(),
      menuItem: {
        ...item.menuItem,
        price: item.menuItem.price.toNumber(),
      },
    })),
  }));

  return <KanbanBoard initialOrders={serialized} />;
}
