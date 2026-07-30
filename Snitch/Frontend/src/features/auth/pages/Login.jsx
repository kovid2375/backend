import { useState } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useAuth } from "../hook/useAuth";
import {useNavigate} from 'react-router-dom'

export default function Login() {
  const {handleLogin} = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await handleLogin({
      email: form.email,
      password: form.password,
    });
    navigate(user?.role === "seller" ? "/seller/dashboard" : "/");
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="flex w-full lg:w-1/2 bg-[#004D30] text-white items-center justify-center p-8 lg:p-16">
        <div className="max-w-md text-center lg:text-left flex flex-col items-center lg:items-start">
          <ShoppingBag className="w-12 h-12 lg:w-16 lg:h-16 mb-4 lg:mb-8" />

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
            SNITCH
          </h1>

          <p className="mt-4 lg:mt-6 text-zinc-400 text-sm lg:text-lg leading-relaxed lg:leading-8 hidden sm:block">
            Welcome back. Sign in to continue shopping premium fashion
            or manage your seller dashboard.
          </p>

          <div className="mt-6 lg:mt-12 grid grid-cols-2 gap-8 text-left">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">500K+</h2>
              <p className="text-zinc-400 text-xs lg:text-base">Happy Customers</p>
            </div>

            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">24/7</h2>
              <p className="text-zinc-400 text-xs lg:text-base">Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004D30]">
              Welcome Back
            </h2>

            <p className="mt-2 text-zinc-500 text-sm sm:text-base">
              Sign in to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Role Tabs */}
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isSeller: false }))}
                className={`flex-1 py-2 sm:py-3 rounded-xl font-medium transition text-sm sm:text-base border ${
                  !form.isSeller
                    ? "bg-[#004D30] text-white border-[#004D30]"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isSeller: true }))}
                className={`flex-1 py-2 sm:py-3 rounded-xl font-medium transition text-sm sm:text-base border ${
                  form.isSeller
                    ? "bg-[#004D30] text-white border-[#004D30]"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                Seller
              </button>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-1 sm:mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 sm:px-4 sm:py-3 outline-none transition focus:border-black text-sm sm:text-base"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Password
              </label>

              <div className="relative mt-1 sm:mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 outline-none transition focus:border-black text-sm sm:text-base"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-zinc-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-3 w-3 sm:h-4 sm:w-4 accent-black"
                />

                Remember me
              </label>

              <button
                type="button"
                className="font-medium text-black hover:underline"
              >
                Forgot Password?
              </button>
            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#004D30] py-2 sm:py-3 font-semibold text-white transition hover:bg-zinc-800 text-sm sm:text-base mt-2 sm:mt-0"
            >
              Sign In
            </button>

            {!form.isSeller && (
              <>
                <div className="relative py-2 sm:py-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-300"></div>
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 sm:px-4 text-xs sm:text-sm text-zinc-500">
                      OR
                    </span>
                  </div>
                </div>

                <div>
                  <a href="/api/auth/google">
                  <button 
                  type="button"
                  className="flex w-full items-center justify-center gap-2 sm:gap-3 rounded-xl border border-zinc-300 py-2 sm:py-3 font-medium transition hover:bg-zinc-100 text-sm sm:text-base"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.6 20H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.7 15.3 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.4 39.6 16.1 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20H42V20H24v8h11.3c-1.1 3.2-3.4 5.7-6.2 7.5l6.2 5.2C39.6 36.8 44 31 44 24c0-1.3-.1-2.7-.4-4z"
                    />
                  </svg>

                  Continue with Google
                </button>
                </a>
                </div>
              </>
            )}
            <p className="text-center text-xs sm:text-sm text-zinc-500 mt-4">
              Don't have an account?
              <button
              onClick={() => navigate("/register")}
                type="button"
                className="ml-2 font-semibold text-[#004D30] hover:underline"
              >
                Create Account
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}