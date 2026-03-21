import { getAppSettings } from "@/app/actions/settings";
import DeliveryFeeForm from "@/app/components/admin_comp/DeliveryFeeForm";

export default async function AdminSettingsPage() {
  const settings = await getAppSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure app-wide settings for your restaurant.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Delivery</h2>
        <DeliveryFeeForm currentFee={settings.deliveryFee} />
      </div>
    </div>
  );
}
