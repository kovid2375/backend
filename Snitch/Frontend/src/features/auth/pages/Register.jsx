import { useState } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";
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