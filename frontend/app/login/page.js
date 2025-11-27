"use client";

import Image from "next/image";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT SIDE GRADIENT */}
      <div className="hidden lg:flex flex-col items-center justify-center px-10 bg-gradient-to-br from-[#6A11CB] to-[#F88D25] text-white">
        <div className="flex flex-col items-center">

          {/* Logo */}
          <Image
            src="/login/logo.png"
            width={180}
            height={80}
            alt="Cresify Logo"
            className="mb-8"
          />

          {/* Center Image */}
          <div className="rounded-xl overflow-hidden shadow-lg mb-8">
            <Image
              src="/login/login.png"
              width={400}
              height={280}
              alt="Login Image"
              className="object-cover"
            />
          </div>
 
          {/* Text */}
          <h2 className="text-xl font-semibold text-center">
            “Your business, your future, in your hands.”
          </h2>

          <p className="text-sm text-center mt-2 opacity-80">
            “Your business, your future, in your hands.”
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN CARD */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-[#EFE9FF]">

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center">Welcome Back 👋</h2>
          <p className="text-sm text-center text-gray-500 mt-1">
            Log in to continue with your store or explore product.
          </p>

          {/* Email */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Youremail@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm bg-[#F9FAFB] focus:ring-2 focus:ring-[#C4B5FD] outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-sm bg-[#F9FAFB] focus:ring-2 focus:ring-[#C4B5FD] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="accent-[#9C6BFF]" />
              Remember me
            </label>
            <button className="text-sm text-[#F88D25]">Forgot your Password?</button>
          </div>

          {/* Login Button */}
          <button className="w-full mt-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#F88D25] to-[#E95D9F] hover:opacity-90 transition">
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google + Facebook */}
          <div className="flex gap-4">
            <button className="w-full py-3 flex items-center justify-center gap-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
              <FcGoogle className="text-xl" />
              Google
            </button>

            <button className="w-full py-3 flex items-center justify-center gap-2 text-white bg-[#1877F2] rounded-xl hover:bg-blue-600 transition">
              <FaFacebookF className="text-sm" />
              Facebook
            </button>
          </div>

          {/* Create account */}
          <p className="text-center mt-8 text-sm text-gray-600">
            Are you new here?
          </p>

          {/* Seller account */}
          <button className="w-full mt-3 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F88D25] hover:opacity-90 transition">
            Create a seller account
          </button>

          {/* Buyer / Service provider */}
          <div className="flex gap-4 mt-4">
            <button className="w-full py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
              Register as a Buyer
            </button>

            <button className="w-full py-3 border border-[#F88D25] text-[#F88D25] rounded-xl hover:bg-orange-50 transition">
              Register as a Servicer
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[#F3F8FF] border border-[#D4E6FF] rounded-xl text-sm text-gray-700">
            <p className="font-medium mb-1">🔐 Demo Credentials:</p>
            <p>Email: demo@emprendechile.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
