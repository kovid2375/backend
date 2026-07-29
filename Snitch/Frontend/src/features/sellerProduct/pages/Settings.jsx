import { useSelector } from "react-redux";
import { Bell, Shield, User } from "lucide-react";

export default function Settings() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 lg:text-3xl">Settings</h1>
        <p className="mt-1 text-zinc-500">
          Manage your seller account preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004d30]/10">
              <User className="h-5 w-5 text-[#004d30]" />
            </div>
            <h2 className="text-base font-bold text-zinc-900">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-500">
                Full Name
              </label>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {user?.fullName || "—"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-500">Email</label>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {user?.email || "—"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-500">Role</label>
              <p className="mt-1 text-sm font-semibold capitalize text-zinc-900">
                {user?.role || "seller"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004d30]/10">
              <Bell className="h-5 w-5 text-[#004d30]" />
            </div>
            <h2 className="text-base font-bold text-zinc-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            {["Order updates", "Product reviews", "Promotional emails"].map(
              (item) => (
                <label
                  key={item}
                  className="flex items-center justify-between text-sm text-zinc-700"
                >
                  {item}
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-[#004d30]"
                  />
                </label>
              )
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004d30]/10">
              <Shield className="h-5 w-5 text-[#004d30]" />
            </div>
            <h2 className="text-base font-bold text-zinc-900">Security</h2>
          </div>
          <p className="text-sm text-zinc-500">
            Password and security settings will be available in a future update.
            Contact support if you need to update your account credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
