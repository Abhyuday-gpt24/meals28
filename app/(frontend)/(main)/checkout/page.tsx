import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getAppSettings } from "@/app/actions/settings";
import { redirect } from "next/navigation";
import CheckoutForm from "@/app/components/checkout_comp/CheckoutForm";
import Link from "next/link";

export default async function CheckoutPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const [addresses, settings] = await Promise.all([
    prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    getAppSettings(),
  ]);

  return (
    <div className="mx-auto max-w-4xl pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Checkout
        </h1>
        <p className="mt-2 text-gray-600">
          Review your items and select a delivery destination.
        </p>
      </header>

      {addresses.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed p-12 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            No delivery address found
          </h2>
          <p className="mt-2 text-gray-500">
            You need to add an address to your profile before placing an order.
          </p>
          <Link
            href="/profile"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700"
          >
            Go to Profile
          </Link>
        </div>
      ) : (
        <CheckoutForm addresses={addresses} deliveryFee={settings.deliveryFee} />
      )}
    </div>
  );
}
