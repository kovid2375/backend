import { useState } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export default function Register() {

  const{handleRegister}=useAuth()
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
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
    await handleRegister({
        email:form.email,
        contact:form.contact,
        password:form.password,
        fullName:form.fullname,
        isSeller:form.isSeller
    })
    navigate("/")
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-black text-white items-center justify-center p-16">
        <div className="max-w-md">
          <ShoppingBag size={55} className="mb-8" />

          <h1 className="text-6xl font-black tracking-tight">
            SNITCH
          </h1>

          <p className="mt-6 text-zinc-400 text-lg leading-8">
            Join the future of fashion.
            Create your account and start shopping premium collections or
            register as a seller to grow your business.
          </p>

          <div className="mt-12 flex gap-8">
            <div>
              <h2 className="text-3xl font-bold">500K+</h2>
              <p className="text-zinc-400">Customers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">10K+</h2>
              <p className="text-zinc-400">Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900">
              Create Account
            </h2>

            <p className="text-zinc-500 mt-2">
              Welcome! Please fill in your details.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Fullname */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Full Name
              </label>

              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-black transition"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Contact
              </label>

              <input
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-black transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-black transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-12 outline-none focus:border-black transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isSeller"
                checked={form.isSeller}
                onChange={handleChange}
                className="h-5 w-5 accent-black"
              />

              <label className="text-zinc-700">
                Register as Seller
              </label>
            </div>

            {/* Button */}
            <button
              className="w-full bg-black hover:bg-zinc-800 transition text-white rounded-xl py-3 font-semibold"
            >
              Create Account
            </button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-300"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-zinc-500">
                  OR
                </span>
              </div>
            </div>
            {/* Google Button */}
            <div>
              <a href="/api/auth/google">
              <button 
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 py-3 font-medium transition hover:bg-zinc-100"
            >
              <svg
                className="h-5 w-5"
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

            <div className="text-center text-sm text-zinc-500">
              Already have an account?
              <button
                type="button"
                className="ml-2 font-semibold text-black hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}