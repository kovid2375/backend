import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#004d30] text-xl font-bold text-white shadow-lg">
            A
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">Aura</h1>
            <p className="text-xs text-gray-500">Marketplace</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 lg:flex">
          <a
            href="/"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            Home
          </a>

          <div className="group relative">
            <button className="flex items-center gap-1 font-medium text-gray-700 hover:text-violet-600">
              Categories
              <ChevronDown size={16} />
            </button>

            <div className="absolute left-0 top-10 hidden w-56 rounded-2xl bg-white p-3 shadow-2xl group-hover:block">
              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                Electronics
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                Fashion
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                Shoes
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                Home Decor
              </a>
            </div>
          </div>

          <a
            href="#"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            New Arrivals
          </a>

          <a
            href="#"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            Deals
          </a>
        </div>

        {/* Search */}
        <div className="hidden lg:flex">
          <div className="flex items-center rounded-full bg-gray-100 px-4 py-2 transition focus-within:ring-2 focus-within:ring-[#004d30]">
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search products..."
              className="ml-2 w-64 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Right */}
        <div className="hidden items-center gap-5 lg:flex">
          <button className="relative">
            <Heart className="text-gray-700 hover:text-red-500" />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              2
            </span>
          </button>

          <button className="relative">
            <Bell className="text-gray-700 hover:text-[#004d30]" />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#004d30] text-xs text-white">
              3
            </span>
          </button>

          <Link to="/cart" className="relative">
            <ShoppingCart className="text-gray-700 hover:text-[#004d30]" />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#004d30] text-xs text-white">
              {cartCount}
            </span>
          </Link>

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="h-11 w-11 cursor-pointer rounded-full border-2 border-[#004d30] object-cover"
          />
        </div>

        {/* Mobile */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t bg-white lg:hidden">
          <div className="space-y-2 p-5">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border p-3 outline-none"
            />

            <a href="/" className="block rounded-lg p-3 hover:bg-gray-100">
              Home
            </a>

            <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
              Categories
            </a>

            <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
              New Arrivals
            </a>

            <a href="#" className="block rounded-lg p-3 hover:bg-gray-100">
              Deals
            </a>

            <div className="flex gap-6 pt-4">
              <Heart />
              <Bell />
              <Link to="/cart">
                <ShoppingCart />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
