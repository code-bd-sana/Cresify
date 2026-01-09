"use client";

import { useLoginMutation } from "@/feature/UserApi";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
  const [login, { isLoading }] = useLoginMutation();
  
  // Language state - শুধুমাত্র লগিন পেজের জন্য
  const [language, setLanguage] = useState('en'); // 'en' বা 'es'

  // লগিন পেজের ভিতরে ট্রান্সলেশন objects
  const translations = {
    en: {
      title: "Welcome Back 👋",
      subtitle: "Log in to continue with your store or explore products.",
      form: {
        email: "Email",
        emailPlaceholder: "Youremail@example.com",
        password: "Password",
        passwordPlaceholder: "••••••••",
        rememberMe: "Remember me",
        forgotPassword: "Forgot your Password?",
        submit: "Login"
      },
      newHere: "Are you new here?",
      createSeller: "Create a seller account",
      registerBuyer: "Register as a Buyer",
      registerProvider: "Register as a Service Provider",
      testCredentials: {
        title: "Try these test credentials:",
        email: "Email:",
        password: "Password:",
        note: "Click Login button to see data in console"
      },
      errors: {
        loginFailed: "Login failed. Please check your credentials."
      }
    },
    es: {
      title: "Bienvenido de nuevo 👋",
      subtitle: "Inicia sesión para continuar con tu tienda o explorar productos.",
      form: {
        email: "Correo electrónico",
        emailPlaceholder: "Tucorreo@ejemplo.com",
        password: "Contraseña",
        passwordPlaceholder: "••••••••",
        rememberMe: "Recordarme",
        forgotPassword: "¿Olvidaste tu contraseña?",
        submit: "Iniciar sesión"
      },
      newHere: "¿Eres nuevo aquí?",
      createSeller: "Crear una cuenta de vendedor",
      registerBuyer: "Registrarse como Comprador",
      registerProvider: "Registrarse como Proveedor de Servicios",
      testCredentials: {
        title: "Prueba estas credenciales de prueba:",
        email: "Correo:",
        password: "Contraseña:",
        note: "Haz clic en el botón Iniciar sesión para ver los datos en la consola"
      },
      errors: {
        loginFailed: "Inicio de sesión fallido. Por favor, verifica tus credenciales."
      }
    }
  };

  // বর্তমান ভাষার ট্রান্সলেশন নেয়া
  const t = translations[language];

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

    try {
      const data = {
        email: formData.email,
        password: formData?.password,
      };

      const response = await login(data);

      console.log(response?.data, "login response");

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
      toast.error(error?.data?.message || t.errors.loginFailed);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
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
            priority
          />

          {/* Center Image */}
          <div className='rounded-xl overflow-hidden shadow-lg mb-8'>
            <Image
              src='/login/login.png'
              width={400}
              height={280}
              alt='Login Image'
              className='object-cover'
              priority
            />
          </div>

          {/* Text - Language based */}
          <h2 className='text-xl font-semibold text-center'>
            {language === 'en' 
              ? "Your business, your future, in your hands."
              : "Tu negocio, tu futuro, en tus manos."}
          </h2>
          <p className='text-sm text-center mt-2 opacity-80'>
            {language === 'en'
              ? "Start your journey with Cresify today"
              : "Comienza tu viaje con Cresify hoy"}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN CARD */}
      <div className='flex items-center justify-center px-4 py-10'>
        <div className='w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-[#EFE9FF]'>
          
          {/* Language Switcher Buttons - শুধুমাত্র লগিন পেজে */}
          <div className='flex justify-end mb-6'>
            <div className='inline-flex rounded-lg border border-gray-200 p-1'>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-sm rounded-md transition ${language === 'en' ? 'bg-[#6A11CB] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1 text-sm rounded-md transition ${language === 'es' ? 'bg-[#6A11CB] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Español
              </button>
            </div>
          </div>

          {/* Heading */}
          <h2 className='text-2xl font-semibold text-center'>
            {t.title}
          </h2>
          <p className='text-sm text-center text-gray-500 mt-1'>
            {t.subtitle}
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className='mt-6'>
              <label className='text-sm font-medium text-gray-700'>
                {t.form.email}
              </label>
              <div className='relative mt-1'>
                <FiMail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.form.emailPlaceholder}
                  className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm bg-[#F9FAFB] focus:ring-2 focus:ring-[#C4B5FD] outline-none transition'
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className='mt-4'>
              <label className='text-sm font-medium text-gray-700'>
                {t.form.password}
              </label>
              <div className='relative mt-1'>
                <FiLock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t.form.passwordPlaceholder}
                  className='w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-sm bg-[#F9FAFB] focus:ring-2 focus:ring-[#C4B5FD] outline-none transition'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9C6BFF] transition'
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            {/* <div className='flex items-center justify-between mt-3'>
              <label className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'>
                <input
                  type='checkbox'
                  className='accent-[#9C6BFF] cursor-pointer'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {t.form.rememberMe}
              </label>
              <button
                type='button'
                className='text-sm text-[#F88D25] hover:text-[#E95D9F] transition cursor-pointer'
                onClick={handleForgotPassword}
              >
                {t.form.forgotPassword}
              </button>
            </div> */}

            {/* Login Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#F88D25] to-[#E95D9F] hover:opacity-90 transition hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <span className='flex items-center justify-center'>
                  <svg className='animate-spin h-5 w-5 mr-2 text-white' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                  </svg>
                  {t.form.submit}...
                </span>
              ) : (
                t.form.submit
              )}
            </button>
          </form>

          {/* Create account */}
          <p className='text-center mt-8 text-sm text-gray-600'>
            {t.newHere}
          </p>

          {/* Seller account */}
          <Link href='/register/seller'>
            <button className='w-full mt-3 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F88D25] hover:opacity-90 transition hover:shadow-lg cursor-pointer'>
              {t.createSeller}
            </button>
          </Link>

          {/* Buyer / Service provider */}
          <div className='flex gap-3 mt-4'>
            {/* Buyer Button */}
            <Link href='/register/buyer' className='flex-1'>
              <button className='w-full py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition text-center hover:border-[#9C6BFF] hover:text-[#9C6BFF] cursor-pointer'>
                {t.registerBuyer}
              </button>
            </Link>

            {/* Service Provider Button */}
            <Link href='/register/provider' className='flex-1'>
              <button className='w-full py-3 border border-[#F88D25] text-[#F88D25] rounded-xl hover:bg-orange-50 transition text-center hover:border-[#E95D9F] hover:text-[#E95D9F] cursor-pointer'>
                {t.registerProvider}
              </button>
            </Link>
          </div>

          {/* Test Credentials Note */}
          <div className='mt-6 p-4 bg-gradient-to-r from-[#F3F8FF] to-[#FFF3E5] border border-[#D4E6FF] rounded-xl text-sm text-gray-700'>
            <p className='font-medium mb-2 text-[#6A11CB] flex items-center gap-2'>
              <span className='text-lg'>🔐</span>
              {t.testCredentials.title}
            </p>
            <div className='space-y-1'>
              <p className='flex items-center gap-2'>
                <span className='text-[#F88D25]'>📧</span>
                <span className='font-medium'>{t.testCredentials.email}</span>
                <code className='bg-gray-100 px-2 py-1 rounded text-[#6A11CB]'>
                  demo@cresify.com
                </code>
              </p>
              <p className='flex items-center gap-2'>
                <span className='text-[#F88D25]'>🔑</span>
                <span className='font-medium'>{t.testCredentials.password}</span>
                <code className='bg-gray-100 px-2 py-1 rounded text-[#6A11CB]'>
                  demo123
                </code>
              </p>
            </div>
            <p className='mt-2 text-xs text-gray-500'>
              {t.testCredentials.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}