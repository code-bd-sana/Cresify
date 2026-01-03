"use client";
import { useCreateUserMutation } from "@/feature/UserApi";
import logo from "@/public/logo.png";
import Image from "next/image";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const RegisterAdmin = () => {
  const { t } = useTranslation("seller");
  const [createUser, { isLoading: userLoading }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error(t("settings.adminRegistration.form.errors.allFields"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("settings.adminRegistration.form.errors.passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t("settings.adminRegistration.form.errors.passwordLength"));
      return;
    }

    // Prepare data with dummy values
    const adminData = {
      email: formData.email,
      password: formData.password,
      role: "admin",
      name: `Admin ${formData.email.split("@")[0]}`,
      phoneNumber: "+1 (555) 123-4567",
      status: "active",
      // Add other required dummy fields here
      registrationDate: new Date().toISOString(),
      nationalId: "ADMIN-" + Date.now().toString().slice(-6),
      serviceName: "Platform Administration",
      serviceCategory: "management",
      serviceArea: "Global",
      serviceRedius: 0,
      hourlyRate: 0,
      yearsofExperience: "5+ years",
      serviceDescription: "System administration",
      country: "Global",
      region: "HQ",
      city: "Virtual",
      address: "Admin Headquarters",
      servicesImage: [],
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    };

    try {
      const response = await createUser(adminData);

      if (response.error) {
        throw new Error(
          response.error.data?.message ||
            t("settings.adminRegistration.errors.registrationFailed")
        );
      }

      toast.success(t("settings.adminRegistration.success"));
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      toast.error(
        error.message || t("settings.adminRegistration.errors.general")
      );
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Toaster />
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-lg shadow-md p-8'>
          <div className='text-center mb-8'>
            <Image
              src={logo}
              width={120}
              height={45}
              alt='Cresify Logo'
              className='mx-auto mb-4'
            />
            <h1 className='text-2xl font-bold text-gray-900'>
              {t("settings.adminRegistration.title")}
            </h1>
            <p className='text-gray-600 mt-2'>
              {t("settings.adminRegistration.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t("settings.adminRegistration.form.email")}
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none'
                placeholder={t(
                  "settings.adminRegistration.form.emailPlaceholder"
                )}
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t("settings.adminRegistration.form.password")}
              </label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none'
                placeholder={t(
                  "settings.adminRegistration.form.passwordPlaceholder"
                )}
                minLength={6}
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t("settings.adminRegistration.form.confirmPassword")}
              </label>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none'
                placeholder={t(
                  "settings.adminRegistration.form.confirmPasswordPlaceholder"
                )}
                minLength={6}
                required
              />
            </div>

            <div className='bg-blue-50 p-3 rounded-lg border border-blue-100'>
              <p className='text-sm text-blue-800'>
                {t("settings.adminRegistration.form.info")}
              </p>
            </div>

            <button
              type='submit'
              disabled={userLoading}
              className='w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50'>
              {userLoading
                ? t("settings.adminRegistration.actions.creating")
                : t("settings.adminRegistration.actions.create")}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <a
              href='/login'
              className='text-sm text-gray-600 hover:text-purple-600 hover:underline'>
              {t("settings.adminRegistration.actions.backToLogin")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
