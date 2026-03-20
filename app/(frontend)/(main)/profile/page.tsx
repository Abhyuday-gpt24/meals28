import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import AddressManager from "@/app/components/address_comp/AddressManager";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: { addresses: { orderBy: { createdAt: "desc" } } },
  });

  if (!profile) redirect("/login");

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    profile.email.split("@")[0];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information and delivery addresses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Personal Information */}
        <div className="space-y-6 lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex flex-col items-center border-b border-gray-100 pb-6">
                <div className="relative mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-100 shadow-lg">
                  <span className="text-3xl font-black text-indigo-600">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {displayName}
                </h2>
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email Address
                  </label>
                  <p className="mt-1 font-medium text-gray-900">
                    {profile.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone Number
                  </label>
                  <p className="mt-1 font-medium text-gray-900">
                    {profile.phone || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Address Management */}
        <div className="lg:col-span-2">
          <AddressManager initialAddresses={profile.addresses} />
        </div>
      </div>
    </div>
  );
}
