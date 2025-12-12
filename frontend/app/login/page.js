"use client";

import { useLoginMutation } from "@/feature/UserApi";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading, loading }] = useLoginMutation();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = session.user.role;
      if (role === "admin") {
        router.push("/dashboard/admin-dashboard");
      } else if (role === "provider") {
        router.push("/dashboard/service-provider-dashboard");
      } else if (role === "seller") {
        router.push("/dashboard/store-profile");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Create a beautiful console output

    try {
      const data = {
        email: formData.email,
        password: formData?.password,
      };

      const response = await login(data);

      console.log(response?.data, "kire response");

      if (response?.error) {
        toast.error(response?.error?.data?.message);
        return;
      }

      const res = await signIn("credentials", {
        redirect: false,
        email: response?.data?.data?.email,
        role: response?.data?.data?.role,
        _id: response?.data?.data?._id,
      });

      // Redirect based on role
      const role = response?.data?.data?.role;
      if (role === "admin") {
        window.location.href = "/dashboard/admin-dashboard";
      } else if (role === "provider") {
        window.location.href = "/dashboard/service-provider-dashboard";
      } else if (role === "seller") {
        window.location.href = "/dashboard/store-profile";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }

    // Here you would typically make API call
    // For example:
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });

    // Show success message
  };

  const handleGoogleLogin = () => {
    // Google login logic here
  };

  return (
    <div className='min-h-screen w-full grid grid-cols-1 lg:grid-cols-2'>
      <Toaster />
      {/* LEFT SIDE GRADIENT */}
      <div className='hidden lg:flex flex-col items-center justify-center px-10 bg-gradient-to-br from-[#6A11CB] to-[#F88D25] text-white'>
        <div className='flex flex-col items-center'>
          {/* Logo */}
          <Image
            src='/login/logo.png'
            width={180}
            height={80}
            alt='Cresify Logo'
            className='mb-8'
          />

          {/* Center Image */}
          <div className='rounded-xl overflow-hidden shadow-lg mb-8'>
            <Image
              src='/login/login.png'
              width={400}
              height={280}
              alt='Login Image'
              className='object-cover'
            />
          </div>

          {/* Text */}
          <h2 className='text-xl font-semibold text-center'>
            "Your business, your future, in your hands."
          </h2>
          <p className='text-sm text-center mt-2 opacity-80'>
            "Your business, your future, in your hands."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN CARD */}
      <div className='flex items-center justify-center px-4 py-10'>
        <div className='w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-[#EFE9FF]'>
          {/* Heading */}
          <h2 className='text-2xl font-semibold text-center'>
            Welcome Back 👋
          </h2>
          <p className='text-sm text-center text-gray-500 mt-1'>
            Log in to continue with your store or explore product.
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className='mt-6'>
              <label className='text-sm font-medium text-gray-700'>Email</label>
              <div className='relative mt-1'>
                <FiMail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Youremail@example.com'
                  className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm bg-[#F9FAFB] focus:ring-2 focus:ring-[#C4B5FD] outline-none transition'
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className='mt-4'>
              <label className='text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative mt-1'>
                <FiLock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='••••••••'
                  className='w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-sm bg-[#F9FAFB] focus:ring-2 focus:ring-[#C4B5FD] outline-none transition'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9C6BFF] transition'>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className='flex items-center justify-between mt-3'>
              <label className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'>
                <input
                  type='checkbox'
                  className='accent-[#9C6BFF] cursor-pointer'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type='button'
                className='text-sm text-[#F88D25] hover:text-[#E95D9F] transition cursor-pointer'
                onClick={() => console.log("Forgot password clicked")}>
                Forgot your Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              className='w-full mt-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#F88D25] to-[#E95D9F] hover:opacity-90 transition hover:shadow-lg cursor-pointer'>
              Login
            </button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-4 my-6'>
            <div className='flex-1 h-px bg-gray-200'></div>
            <span className='text-sm text-gray-400'>Or continue with</span>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className='w-full py-3 flex items-center justify-center gap-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition hover:border-[#4285F4] hover:shadow-sm cursor-pointer'>
            <FcGoogle className='text-xl' />
            Google
          </button>

          {/* Create account */}
          <p className='text-center mt-8 text-sm text-gray-600'>
            Are you new here?
          </p>

          {/* Seller account */}
          <Link href='/register/seller'>
            <button className='w-full mt-3 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F88D25] hover:opacity-90 transition hover:shadow-lg cursor-pointer'>
              Create a seller account
            </button>
          </Link>

          {/* Buyer / Service provider - দুটো বোতাম পাশাপাশি */}
          <div className='flex gap-3 mt-4'>
            {/* Buyer Button */}
            <Link href='/register/buyer' className='flex-1'>
              <button className='w-full py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition text-center hover:border-[#9C6BFF] hover:text-[#9C6BFF] cursor-pointer'>
                Register as a Buyer
              </button>
            </Link>

            {/* Service Provider Button */}
            <Link href='/register/provider' className='flex-1'>
              <button className='w-full py-3 border border-[#F88D25] text-[#F88D25] rounded-xl hover:bg-orange-50 transition text-center hover:border-[#E95D9F] hover:text-[#E95D9F] cursor-pointer'>
                Register as a Service Provider
              </button>
            </Link>
          </div>

          {/* Test Credentials Note */}
          <div className='mt-6 p-4 bg-gradient-to-r from-[#F3F8FF] to-[#FFF3E5] border border-[#D4E6FF] rounded-xl text-sm text-gray-700'>
            <p className='font-medium mb-2 text-[#6A11CB] flex items-center gap-2'>
              <span className='text-lg'>🔐</span>
              Try these test credentials:
            </p>
            <div className='space-y-1'>
              <p className='flex items-center gap-2'>
                <span className='text-[#F88D25]'>📧</span>
                <span className='font-medium'>Email:</span>
                <code className='bg-gray-100 px-2 py-1 rounded text-[#6A11CB]'>
                  demo@cresify.com
                </code>
              </p>
              <p className='flex items-center gap-2'>
                <span className='text-[#F88D25]'>🔑</span>
                <span className='font-medium'>Password:</span>
                <code className='bg-gray-100 px-2 py-1 rounded text-[#6A11CB]'>
                  demo123
                </code>
              </p>
            </div>
            <p className='mt-2 text-xs text-gray-500'>
              Click Login button to see data in console
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
