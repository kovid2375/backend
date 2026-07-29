import { Bell, Mail, Menu, Search } from "lucide-react";
import { useSelector } from "react-redux";

export default function Header({ onMenuClick }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search task..."
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#004d30] focus:bg-white"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800">
          <Mail className="h-5 w-5" />
        </button>
        <button className="relative rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-zinc-200 pl-2 sm:gap-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-zinc-900">
              {user?.fullName || "Seller"}
            </p>
            <p className="text-xs text-zinc-500">{user?.email || ""}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#004d30] text-sm font-bold text-white sm:h-10 sm:w-10">
            {user?.fullName?.charAt(0)?.toUpperCase() || "S"}
          </div>
        </div>
      </div>
    </header>
  );
}
