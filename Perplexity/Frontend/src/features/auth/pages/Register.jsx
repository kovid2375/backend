import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  HelpCircle,
  Shield,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const [password, setPassword] = useState("");

  const navigate=useNavigate()

  

  const getStrengthWidth = () => {
    if (password.length === 0) return "0%";
    if (password.length < 6) return "33%";
    if (password.length < 10) return "66%";
    return "100%";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1326] text-white">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-300/10 blur-3xl animate-pulse" />
      </div>

      {/* Main */}
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 md:px-8">
        {/* Logo */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-blue-300">
            MindStream
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Intelligent synthesis at the speed of thought.
          </p>
        </div>

        {/* Register Card */}
        <div className="w-full max-w-[440px] rounded-2xl border border-slate-700/40 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="mb-2 text-4xl font-bold text-white">
              Join us.
            </h2>

            <p className="text-slate-400">
              Create your MindStream account to get started.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-blue-300"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="fullName"
                  type="text"
                  placeholder="Alex Rivera"
                  className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-300"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-300"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20"
                />
              </div>

              {/* Password Strength */}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-blue-300 transition-all duration-500"
                    style={{ width: getStrengthWidth() }}
                  />
                </div>

                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  Strength
                </span>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 rounded border-slate-600 bg-slate-800 text-blue-300 focus:ring-blue-300"
              />

              <label
                htmlFor="terms"
                className="text-sm leading-relaxed text-slate-400"
              >
                I agree to the{" "}
                <button
                  type="button"
                  className="text-blue-300 hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-blue-300 hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-300 font-semibold text-slate-900 transition hover:shadow-[0_0_20px_rgba(173,198,255,0.3)] active:scale-[0.98]"
            >
              Create Account

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 border-t border-slate-700/40 pt-8 text-center">
            <p className="text-slate-400">
              Already have an account?
              <button onClick={()=>navigate("/login")} className="ml-1 font-semibold text-blue-300 hover:underline">
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-12 flex gap-6">
          <button className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-300">
            <HelpCircle size={18} />
            Help Center
          </button>

          <button className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-300">
            <Shield size={18} />
            Security
          </button>
        </div>
      </main>
    </div>
  );
};

export default Register;