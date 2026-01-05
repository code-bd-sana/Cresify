"use client";

import {
  useChangePasswordMutation,
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/feature/UserApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import RegisterAdmin from "./RegisterAdmin";

export default function AccountSettings() {
  const { t } = useTranslation("seller");
  const { data: session } = useSession();
  const id = session?.user?.id;
  const role = session?.user?.role;

  const { data: profile, isLoading, error } = useMyProfileQuery(id);
  const [updateProfile, { isLoading: profileLoading, error: updateError }] =
    useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  // Profile Information State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  // Service Information State
  const [serviceData, setServiceData] = useState({
    serviceName: "",
    serviceCategory: "",
    serviceArea: "",
    serviceDescription: "",
    yearsOfExperience: "",
    serviceRadius: "",
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Hourly Rate State
  const [hourlyRateData, setHourlyRateData] = useState({
    hourlyRate: "",
  });

  // Service Categories Options
  const serviceCategories = [
    "cleaning",
    "plumbing",
    "electrical",
    "carpentry",
    "painting",
    "gardening",
    "moving",
    "appliance repair",
    "handyman",
    "other",
  ];

  // Service Areas Options (You can add more as needed)
  const serviceAreas = [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Rangpur",
    "Mymensingh",
    "Comilla",
    "Narayanganj",
  ];

  // Service Radius Options (in kilometers)
  const serviceRadiusOptions = [
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 15, label: "15 km" },
    { value: 20, label: "20 km" },
    { value: 25, label: "25 km" },
    { value: 30, label: "30 km" },
    { value: 50, label: "50 km" },
    { value: 100, label: "100 km" },
  ];

  // Years of Experience Options
  const yearsOfExperienceOptions = [
    "Less than 1 year",
    "1-2 years",
    "2-5 years",
    "5-10 years",
    "10+ years",
    "15+ years",
    "20+ years",
  ];

  // Load profile data into form when available
  useEffect(() => {
    if (profile?.data) {
      setProfileData({
        name: profile.data.name || "",
        email: profile.data.email || "",
        phoneNumber: profile.data.phoneNumber || "",
      });

      // Load service data if available
      setServiceData({
        serviceName: profile.data.serviceName || "",
        serviceCategory: profile.data.serviceCategory || "",
        serviceArea: profile.data.serviceArea || "",
        serviceDescription: profile.data.serviceDescription || "",
        yearsOfExperience: profile.data.yearsOfExperience || "",
        serviceRadius: profile.data.serviceRadius || "",
      });

      // If user has hourlyRate field, load it
      if (profile.data.hourlyRate !== undefined) {
        setHourlyRateData({
          hourlyRate: profile.data.hourlyRate.toString() || "",
        });
      }
    }
  }, [profile?.data]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (e) => {                    
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHourlyRateChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setHourlyRateData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const changePasswordHandler = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!passwordData.currentPassword.trim()) {
        toast.error(t("settings.password.errors.currentRequired"));
        return;
      }

      if (!passwordData.newPassword.trim()) {
        toast.error(t("settings.password.errors.newRequired"));
        return;
      }

      if (!passwordData.confirmNewPassword.trim()) {
        toast.error(t("settings.password.errors.confirmRequired"));
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        toast.error(t("settings.password.errors.passwordMismatch"));
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error(t("settings.password.errors.minLength"));
        return;
      }

      // Prepare password change data
      const passwordChangeData = {
        id: id,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
        timestamp: new Date().toISOString(),
        changeType: "password_update",
      };

      const response = await changePassword(passwordChangeData);

      if (response.error) {
        toast.error(response.error?.data?.message);
        return;
      }

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      // Show success message
      toast.success(t("settings.password.success"));
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const saveProfileChangesHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!profileData.name.trim()) {
      toast.error(t("settings.profile.errors.nameRequired"));
      return;
    }

    if (!profileData.phoneNumber.trim()) {
      toast.error(t("settings.profile.errors.phoneRequired"));
      return;
    }

    // Prepare profile update data
    const profileUpdateData = {
      id: id,
      name: profileData.name,
      phoneNumber: profileData.phoneNumber,
      updateType: "profile_update",
    };

    try {
      await updateProfile(profileUpdateData);
      toast.success(t("settings.profile.success"));
    } catch (error) {
      toast.error(t("settings.profile.error"));
    }
  };

  const saveServiceChangesHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!serviceData.serviceName.trim()) {
      toast.error(t("settings.service.errors.serviceNameRequired"));
      return;
    }

    if (!serviceData.serviceCategory.trim()) {
      toast.error(t("settings.service.errors.categoryRequired"));
      return;
    }

    if (!serviceData.serviceArea.trim()) {
      toast.error(t("settings.service.errors.areaRequired"));
      return;
    }

    if (!serviceData.serviceDescription.trim()) {
      toast.error(t("settings.service.errors.descriptionRequired"));
      return;
    }

    if (!serviceData.yearsOfExperience.trim()) {
      toast.error(t("settings.service.errors.experienceRequired"));
      return;
    }

    if (!serviceData.serviceRadius) {
      toast.error(t("settings.service.errors.radiusRequired"));
      return;
    }

    // Prepare service update data
    const serviceUpdateData = {
      id: id,
      serviceName: serviceData.serviceName,
      serviceCategory: serviceData.serviceCategory,
      serviceArea: serviceData.serviceArea,
      serviceDescription: serviceData.serviceDescription,
      yearsOfExperience: serviceData.yearsOfExperience,
      serviceRadius: serviceData.serviceRadius,
      updateType: "service_update",
    };

    try {
      await updateProfile(serviceUpdateData);
      toast.success(t("settings.service.success"));
    } catch (error) {
      toast.error(t("settings.service.error"));
    }
  };

  const updateHourlyRateHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!hourlyRateData.hourlyRate.trim()) {
      toast.error(t("settings.pricing.errors.hourlyRateRequired"));
      return;
    }

    const hourlyRate = parseFloat(hourlyRateData.hourlyRate);
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      toast.error(t("settings.pricing.errors.validHourlyRate"));
      return;
    }

    if (hourlyRate > 1000) {
      toast.error(t("settings.pricing.errors.maxHourlyRate"));
      return;
    }

    // Prepare hourly rate update data
    const hourlyRateUpdateData = {
      id: id,
      hourlyRate: hourlyRate,
      updateType: "hourly_rate_update",
    };

    try {
      await updateProfile(hourlyRateUpdateData);
      toast.success(t("settings.pricing.success", { rate: hourlyRate }));
    } catch (error) {
      toast.error(t("settings.pricing.error"));
    }
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
          <p className='mt-4 text-gray-500'>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen px-2 pt-6'>
      <Toaster />

      {/* PAGE TITLE */}
      <h1 className='text-[28px] font-semibold text-gray-900'>
        {t("settings.accountSettings.title")}
      </h1>
      <p className='text-[#9C6BFF] text-sm mt-1'>
        {t("settings.accountSettings.subtitle")}
      </p>

      {/* PROFILE INFORMATION CARD */}
      <div className='bg-white mt-8 rounded-xl shadow-sm border border-gray-100 p-8'>
        <h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
          {t("settings.profile.title")}
        </h2>

        <form onSubmit={saveProfileChangesHandler}>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Full Name */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.profile.form.fullName")}
              </label>
              <input
                type='text'
                name='name'
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder={t("settings.profile.form.fullNamePlaceholder")}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition'
              />
            </div>

            {/* Email */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.profile.form.email")}
              </label>
              <input
                type='email'
                name='email'
                value={profileData.email}
                onChange={handleProfileChange}
                readOnly
                className='px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-purple-300 outline-none transition'
              />
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.profile.form.emailHint")}
              </p>
            </div>

            {/* Phone */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.profile.form.phone")}
              </label>
              <input
                type='text'
                name='phoneNumber'
                value={profileData.phoneNumber}
                onChange={handleProfileChange}
                placeholder={t("settings.profile.form.phonePlaceholder")}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition'
              />
            </div>
          </div>

          {/* Save Changes Button */}
          <button
            type='submit'
            className='mt-8 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]'>
            {t("settings.profile.form.save")}
          </button>
        </form>
      </div>

      {/* SERVICE INFORMATION CARD */}
      <div
        className={`bg-white mt-10 rounded-xl shadow-sm border border-gray-100 p-8 ${
          role !== "provider" ? "hidden" : ""
        }`}>
        <h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
          {t("settings.service.title")}
        </h2>

        <form onSubmit={saveServiceChangesHandler}>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Service Name */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.service.form.serviceName")}
              </label>
              <input
                type='text'
                name='serviceName'
                value={serviceData.serviceName}
                onChange={handleServiceChange}
                placeholder={t("settings.service.form.serviceNamePlaceholder")}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition'
              />
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.service.form.serviceNameHint")}
              </p>
            </div>

            {/* Service Category */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.service.form.category")}
              </label>
              <select
                name='serviceCategory'
                value={serviceData.serviceCategory}
                onChange={handleServiceChange}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white'>
                <option value=''>
                  {t("settings.service.form.selectCategory")}
                </option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.service.form.categoryHint")}
              </p>
            </div>

            {/* Service Area */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.service.form.area")}
              </label>
              <select
                name='serviceArea'
                value={serviceData.serviceArea}
                onChange={handleServiceChange}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white'>
                <option value=''>
                  {t("settings.service.form.selectArea")}
                </option>
                {serviceAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.service.form.areaHint")}
              </p>
            </div>

            {/* Service Radius */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.service.form.radius")}
              </label>
              <select
                name='serviceRadius'
                value={serviceData.serviceRadius}
                onChange={handleServiceChange}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white'>
                <option value=''>
                  {t("settings.service.form.selectRadius")}
                </option>
                {serviceRadiusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.service.form.radiusHint")}
              </p>
            </div>

            {/* Years of Experience */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.service.form.experience")}
              </label>
              <select
                name='yearsOfExperience'
                value={serviceData.yearsOfExperience}
                onChange={handleServiceChange}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white'>
                <option value=''>
                  {t("settings.service.form.selectExperience")}
                </option>
                {yearsOfExperienceOptions.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.service.form.experienceHint")}
              </p>
            </div>

            {/* Service Description */}
            <div className='flex flex-col md:col-span-2'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.service.form.description")}
              </label>
              <textarea
                name='serviceDescription'
                value={serviceData.serviceDescription}
                onChange={handleServiceChange}
                placeholder={t("settings.service.form.descriptionPlaceholder")}
                rows={4}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition resize-none'
              />
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.service.form.descriptionHint")}
              </p>
            </div>
          </div>

          {/* Save Service Changes Button */}
          <button
            type='submit'
            className='mt-8 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]'>
            {t("settings.service.form.update")}
          </button>
        </form>
      </div>

      {/* HOURLY RATE CARD (For Providers) */}
      <div
        className={` bg-white mt-10 rounded-xl shadow-sm border border-gray-100 p-8 ${
          role !== "provider" ? "hidden" : ""
        }`}>
        <h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
          {t("settings.pricing.title")}
        </h2>

        <div className='mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100'>
          <div className='flex items-start'>
            <div className='flex-shrink-0 mt-0.5'>
              <svg
                className='w-5 h-5 text-blue-500'
                fill='currentColor'
                viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800'>
                {t("settings.pricing.currentInfo")}
              </h3>
              <div className='mt-2 text-sm text-blue-700 grid grid-cols-1 md:grid-cols-2 gap-2'>
                <p>
                  <span className='font-semibold'>
                    {t("settings.pricing.service")}:
                  </span>{" "}
                  {profile?.data?.serviceName || t("common.notSet")}
                </p>
                <p>
                  <span className='font-semibold'>
                    {t("settings.pricing.category")}:
                  </span>{" "}
                  {profile?.data?.serviceCategory || t("common.notSet")}
                </p>
                <p>
                  <span className='font-semibold'>
                    {t("settings.pricing.area")}:
                  </span>{" "}
                  {profile?.data?.serviceArea || t("common.notSet")}
                </p>
                <p>
                  <span className='font-semibold'>
                    {t("settings.pricing.experience")}:
                  </span>{" "}
                  {profile?.data?.yearsOfExperience || t("common.notSet")}
                </p>
                <p>
                  <span className='font-semibold'>
                    {t("settings.pricing.hourlyRate")}:
                  </span>{" "}
                  ${profile?.data?.hourlyRate || t("common.notSet")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={updateHourlyRateHandler}>
          {/* Hourly Rate Input */}
          <div className='flex flex-col mb-6'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              {t("settings.pricing.form.hourlyRate")}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500'>$</span>
              </div>
              <input
                type='text'
                name='hourlyRate'
                value={hourlyRateData.hourlyRate}
                onChange={handleHourlyRateChange}
                placeholder={t("settings.pricing.form.hourlyRatePlaceholder")}
                className='pl-8 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition'
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <span className='text-gray-500'>/ hour</span>
              </div>
            </div>
            <div className='flex justify-between mt-1'>
              <p className='text-xs text-gray-500'>
                {t("settings.pricing.form.hourlyRateHint")}
              </p>
              {hourlyRateData.hourlyRate && (
                <p className='text-xs font-medium text-purple-600'>
                  {t("settings.pricing.form.yourRate", {
                    rate: hourlyRateData.hourlyRate,
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Pricing Tips */}
          <div className='mb-4 p-4 bg-green-50 rounded-lg border border-green-100'>
            <h4 className='text-sm font-medium text-green-800 mb-2'>
              {t("settings.pricing.tips.title")}
            </h4>
            <ul className='text-xs text-green-700 space-y-1'>
              <li>• {t("settings.pricing.tips.marketResearch")}</li>
              <li>• {t("settings.pricing.tips.experience")}</li>
              <li>• {t("settings.pricing.tips.travelCosts")}</li>
              <li>• {t("settings.pricing.tips.competitivePricing")}</li>
            </ul>
          </div>

          {/* Update Hourly Rate Button */}
          <button
            type='submit'
            className='px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]'>
            {t("settings.pricing.form.update")}
          </button>
        </form>
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className='bg-white mt-10 rounded-xl shadow-sm border border-gray-100 p-8'>
        <h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
          {t("settings.password.title")}
        </h2>

        <form onSubmit={changePasswordHandler}>
          {/* Current Password */}
          <div className='flex flex-col mb-6'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              {t("settings.password.form.current")}
            </label>
            <input
              type='password'
              name='currentPassword'
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder={t("settings.password.form.currentPlaceholder")}
              className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition'
            />
          </div>

          {/* New Password Row */}
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.password.form.new")}
              </label>
              <input
                type='password'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder={t("settings.password.form.newPlaceholder")}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition'
              />
              <p className='text-xs text-gray-500 mt-1'>
                {t("settings.password.form.hint")}
              </p>
            </div>

            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                {t("settings.password.form.confirm")}
              </label>
              <input
                type='password'
                name='confirmNewPassword'
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder={t("settings.password.form.confirmPlaceholder")}
                className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition'
              />
              {passwordData.newPassword && passwordData.confirmNewPassword && (
                <p
                  className={`text-xs mt-1 ${
                    passwordData.newPassword === passwordData.confirmNewPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  {passwordData.newPassword === passwordData.confirmNewPassword
                    ? t("settings.password.form.match")
                    : t("settings.password.form.mismatch")}
                </p>
              )}
            </div>
          </div>


          {/* Password Requirements */}
          <div className='mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100'>
            <h4 className='text-sm font-medium text-yellow-800 mb-2'>
              {t("settings.password.requirements.title")}
            </h4>
            <ul className='text-xs text-yellow-700 space-y-1'>
              <li>• {t("settings.password.requirements.minLength")}</li>
              <li>• {t("settings.password.requirements.letters")}</li>
              <li>• {t("settings.password.requirements.numbers")}</li>
              <li>• {t("settings.password.requirements.personalInfo")}</li>
            </ul>
          </div>

          {/* Update Button */}
          <button
            type='submit'
            className='mt-4 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]'>
            {t("settings.password.form.update")}
          </button>
        </form>

        


        
          <RegisterAdmin />
      </div>
    </div>
  );
}
