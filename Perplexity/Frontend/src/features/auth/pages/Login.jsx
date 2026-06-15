import React, { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import { useAuth } from "../hook/useAuth";

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const user=useSelector(state=>state.auth.user)
    const loading=useSelector(state=>state.auth.loading)

    const{handleLogin}=useAuth()
    const navigate=useNavigate()

    const submitForm=async (event)=>{
        event.preventDefault()

        const payload={
            email,
            password
        }
        await handleLogin(payload)
        navigate("/")
    }
    if(!loading && user){
        return <Navigate to="/" replace/>
    }
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[20%] top-[30%] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-[15%] top-[60%] h-[350px] w-[350px] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center px-4 py-10 md:px-10">
        <div className="w-full max-w-[440px]">
          {/* Logo */}
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-blue-300">
              MindStream AI
            </h1>

            <p className="text-sm text-slate-400">
              Intelligent synthesis for modern workflows.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-8 backdrop-blur-xl md:p-10">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white">
                Welcome Back
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Please enter your credentials to continue.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submitForm} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event)=>setEmail(event.target.value)}
                    placeholder="name@company.com"
                    className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-300 transition hover:text-blue-200"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event)=>setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-300 font-semibold text-slate-900 transition hover:brightness-110 active:scale-[0.98]"
              >
                Sign In
                <ArrowRight size={18} />
              </button>
            </form>
            {/* Footer */}
            <p className="mt-8 text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <button onClick={()=>navigate("/register")} className="font-semibold text-blue-300 hover:underline">
                Register
              </button>
            </p>
          </div>

          {/* Bottom Footer */}
          <footer className="mt-10 text-center text-xs text-slate-600 transition hover:text-slate-400">
            © 2024 MindStream AI Research. Built for clarity and speed.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Login;