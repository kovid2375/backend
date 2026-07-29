import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  Settings,
  HelpCircle,
  LogOut,
  Check,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../auth/state/auth.slice";

const menuItems = [
  { to: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seller/products", label: "Products", icon: Package },
  { to: "/seller/create-product", label: "Create Product", icon: PlusSquare },
];

const generalItems = [
  { to: "/seller/settings", label: "Settings", icon: Settings },
  { to: "/seller/help", label: "Help", icon: HelpCircle },
];

function SidebarContent({ onNavigate, showCloseButton, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setUser(null));
    onNavigate?.();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-[#004d30] text-white"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    }`;

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004d30]">
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-900">Snitch</p>
            <p className="text-xs text-zinc-500">Seller Panel</p>
          </div>
        </div>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Menu
        </p>
        <div className="space-y-1">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={linkClass}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>

        <p className="mb-3 mt-8 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          General
        </p>
        <div className="space-y-1">
          {generalItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={linkClass}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>
    </>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <SidebarContent
          onNavigate={onClose}
          showCloseButton
          onClose={onClose}
        />
      </aside>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
