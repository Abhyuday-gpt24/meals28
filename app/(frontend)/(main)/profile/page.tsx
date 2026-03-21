import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import AddressManager from "@/app/components/address_comp/AddressManager";
import ProfileCard from "@/app/components/profile_comp/ProfileCard";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: { addresses: { orderBy: { createdAt: "desc" } } },
  });

  if (!profile) redirect("/login");

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
          <ProfileCard user={profile} />
        </div>

        {/* RIGHT COLUMN: Address Management */}
        <div className="lg:col-span-2">
          <AddressManager initialAddresses={profile.addresses} />
        </div>
      </div>
    </div>
  );
}
