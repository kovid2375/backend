import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Terminal
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { handleRegister } = useAuth();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const submitForm = async (event) => {
    event.preventDefault();
    const success = await handleRegister(email, username, password);
    if (success) {
      navigate("/login");
    }
  };

  const getStrengthWidth = () => {
    if (password.length === 0) return "0%";
    if (password.length < 6) return "33%";
    if (password.length < 10) return "66%";
    return "100%";
  };

  const getStrengthColor = () => {
    if (password.length < 6) return "bg-red-500/60";
    if (password.length < 10) return "bg-amber-500/60";
    return "bg-green-500/60";
  };

  return (
    <div className="min-h-screen w-screen bg-[#0e0e0e] text-neutral-200 font-sans flex flex-col items-center justify-center px-4 py-8 relative select-none">
      <div className="w-full max-w-[420px]">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#202020] border border-neutral-800/80 flex items-center justify-center text-white">
            <Terminal size={20} className="text-neutral-200" />
          </div>
          <div className="text-left">
            <h1 className="font-extrabold text-white text-[16px] tracking-tight leading-tight">AI Assistant</h1>
            <span className="text-[10px] tracking-widest text-neutral-500 font-bold uppercase block">
              Technical Precision
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-900 bg-[#131313] p-8 md:p-10 shadow-2xl relative">
          {/* Header */}
          <div className="mb-8 text-left">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Create account
            </h2>
            <p className="mt-1 text-[13px] text-neutral-500 font-medium">
              Join to initialize your personalized workspace.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submitForm} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-[9.5px] font-bold text-neutral-500 uppercase tracking-widest"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <User
                  size={16}
                  className="absolute left-3.5 text-neutral-600"
                />
                <input
                  id="fullName"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Alex Rivera"
                  className="h-11 w-full rounded-xl border border-neutral-800 bg-[#181818] pl-11 pr-4 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[9.5px] font-bold text-neutral-500 uppercase tracking-widest"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail
                  size={16}
                  className="absolute left-3.5 text-neutral-600"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="h-11 w-full rounded-xl border border-neutral-800 bg-[#181818] pl-11 pr-4 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[9.5px] font-bold text-neutral-500 uppercase tracking-widest"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={16}
                  className="absolute left-3.5 text-neutral-600"
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-neutral-800 bg-[#181818] pl-11 pr-4 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                  required
                />
              </div>

              {/* Password Strength Indicator */}
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: getStrengthWidth() }}
                  />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-500">
                  Strength
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 w-3.5 h-3.5 rounded border-neutral-800 bg-[#181818] text-neutral-200 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                required
              />
              <label
                htmlFor="terms"
                className="text-[11.5px] leading-relaxed text-neutral-500"
              >
                I agree to the{" "}
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white hover:underline transition-all cursor-pointer font-medium"
                >
                  Terms
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white hover:underline transition-all cursor-pointer font-medium"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-200 font-extrabold text-[#0e0e0e] text-sm transition-all hover:bg-white active:scale-[0.98] cursor-pointer shadow-sm disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Registering..." : "Create Account"}
              {!loading && <ArrowRight size={15} className="stroke-[2.5]" />}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
            <p className="text-xs text-neutral-500 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Footer Credit */}
        <span className="text-[9px] font-bold tracking-widest text-neutral-700 uppercase mt-8 block text-center">
          Deep Intelligence &bull; Secure Setup
        </span>
      </div>
    </div>
  );
};

export default Register;