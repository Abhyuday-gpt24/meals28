import prisma from "@/lib/prisma";
import CouponTable from "@/app/components/admin_comp/CouponTable";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const serialized = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue.toNumber(),
    minOrderAmount: c.minOrderAmount?.toNumber() ?? null,
    maxDiscount: c.maxDiscount?.toNumber() ?? null,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
    isActive: c.isActive,
    expiresAt: c.expiresAt?.toISOString() ?? null,
    _count: c._count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Coupons
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage discount coupons for your customers.
        </p>
      </div>

      <CouponTable coupons={serialized} />
    </div>
  );
}
