"use client";

import { useChangePasswordMutation, useMyProfileQuery, useUpdateProfileMutation } from "@/feature/UserApi";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AccountSettings() {
  const { data: session } = useSession();
  const id = session?.user?.id;

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
    "other"
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
    "Narayanganj"
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
    "20+ years"
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
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setHourlyRateData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const changePasswordHandler = async(e) => {
    e.preventDefault();

    try {
      // Validation
      if (!passwordData.currentPassword.trim()) {
        alert("Please enter current password");
        return;
      }

      if (!passwordData.newPassword.trim()) {
        alert("Please enter new password");
        return;
      }

      if (!passwordData.confirmNewPassword.trim()) {
        alert("Please confirm new password");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        alert("New passwords do not match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        alert("New password must be at least 6 characters long");
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

      if(response.error){
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
      toast.success("Password changed successfully");
  
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const saveProfileChangesHandler = async(e) => {
    e.preventDefault();

    // Validation
    if (!profileData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!profileData.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
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
      toast.success('Profile information saved successfully');
    } catch (error) {
      toast.error('Failed to save profile information');
    }
  };

  const saveServiceChangesHandler = async(e) => {
    e.preventDefault();

    // Validation
    if (!serviceData.serviceName.trim()) {
      toast.error("Please enter service name");
      return;
    }

    if (!serviceData.serviceCategory.trim()) {
      toast.error("Please select service category");
      return;
    }

    if (!serviceData.serviceArea.trim()) {
      toast.error("Please select service area");
      return;
    }

    if (!serviceData.serviceDescription.trim()) {
      toast.error("Please enter service description");
      return;
    }

    if (!serviceData.yearsOfExperience.trim()) {
      toast.error("Please select years of experience");
      return;
    }

    if (!serviceData.serviceRadius) {
      toast.error("Please select service radius");
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
      toast.success('Service information updated successfully');
    } catch (error) {
      toast.error('Failed to update service information');
    }
  };

  const updateHourlyRateHandler = async(e) => {
    e.preventDefault();

    // Validation
    if (!hourlyRateData.hourlyRate.trim()) {
      toast.error("Please enter hourly rate");
      return;
    }

    const hourlyRate = parseFloat(hourlyRateData.hourlyRate);
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      toast.error("Please enter a valid hourly rate (greater than 0)");
      return;
    }

    if (hourlyRate > 1000) {
      toast.error("Hourly rate cannot exceed $1000");
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
      toast.success(`Hourly rate updated to $${hourlyRate}`);
    } catch (error) {
      toast.error('Failed to update hourly rate');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-500">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-2 pt-6">
      <Toaster/>
      
      {/* PAGE TITLE */}
      <h1 className="text-[28px] font-semibold text-gray-900">
        Account Settings
      </h1>
      <p className="text-[#9C6BFF] text-sm mt-1">
        Manage your account preferences and security
      </p>

      {/* PROFILE INFORMATION CARD */}
      <div className="bg-white mt-8 rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
          Personal Information
        </h2>

        <form onSubmit={saveProfileChangesHandler}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                readOnly
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-purple-300 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition"
              />
            </div>
          </div>

          {/* Save Changes Button */}
          <button
            type="submit"
            className="mt-8 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]"
          >
            Save Personal Information
          </button>
        </form>
      </div>

      {/* SERVICE INFORMATION CARD */}
      <div className="bg-white mt-10 rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
          Service Information
        </h2>

        <form onSubmit={saveServiceChangesHandler}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Service Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Service Name*
              </label>
              <input
                type="text"
                name="serviceName"
                value={serviceData.serviceName}
                onChange={handleServiceChange}
                placeholder="e.g., Home Cleaning, Plumbing Service"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">Name of your service</p>
            </div>

            {/* Service Category */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Service Category*
              </label>
              <select
                name="serviceCategory"
                value={serviceData.serviceCategory}
                onChange={handleServiceChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white"
              >
                <option value="">Select a category</option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Type of service you provide</p>
            </div>

            {/* Service Area */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Service Area*
              </label>
              <select
                name="serviceArea"
                value={serviceData.serviceArea}
                onChange={handleServiceChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white"
              >
                <option value="">Select your service area</option>
                {serviceAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">City where you provide service</p>
            </div>

            {/* Service Radius */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Service Radius*
              </label>
              <select
                name="serviceRadius"
                value={serviceData.serviceRadius}
                onChange={handleServiceChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white"
              >
                <option value="">Select service radius</option>
                {serviceRadiusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Maximum distance you can travel</p>
            </div>

            {/* Years of Experience */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Years of Experience*
              </label>
              <select
                name="yearsOfExperience"
                value={serviceData.yearsOfExperience}
                onChange={handleServiceChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition bg-white"
              >
                <option value="">Select experience level</option>
                {yearsOfExperienceOptions.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Your professional experience</p>
            </div>

            {/* Service Description */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Service Description*
              </label>
              <textarea
                name="serviceDescription"
                value={serviceData.serviceDescription}
                onChange={handleServiceChange}
                placeholder="Describe your service in detail..."
                rows={4}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Detailed description of your service</p>
            </div>
          </div>

          {/* Save Service Changes Button */}
          <button
            type="submit"
            className="mt-8 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]"
          >
            Update Service Information
          </button>
        </form>
      </div>

      {/* HOURLY RATE CARD (For Providers) */}
      <div className="bg-white mt-10 rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
          Pricing Information
        </h2>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Current Service Information
              </h3>
              <div className="mt-2 text-sm text-blue-700 grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><span className="font-semibold">Service:</span> {profile?.data?.serviceName || "Not set"}</p>
                <p><span className="font-semibold">Category:</span> {profile?.data?.serviceCategory || "Not set"}</p>
                <p><span className="font-semibold">Area:</span> {profile?.data?.serviceArea || "Not set"}</p>
                <p><span className="font-semibold">Experience:</span> {profile?.data?.yearsOfExperience || "Not set"}</p>
                <p><span className="font-semibold">Hourly Rate:</span> ${profile?.data?.hourlyRate || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={updateHourlyRateHandler}>
          {/* Hourly Rate Input */}
          <div className="flex flex-col mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Hourly Rate ($)*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                name="hourlyRate"
                value={hourlyRateData.hourlyRate}
                onChange={handleHourlyRateChange}
                placeholder="Enter your hourly rate"
                className="pl-8 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">/ hour</span>
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">Enter amount in USD (Min: $5, Max: $1000)</p>
              {hourlyRateData.hourlyRate && (
                <p className="text-xs font-medium text-purple-600">
                  Your rate: ${hourlyRateData.hourlyRate} per hour
                </p>
              )}
            </div>
          </div>

          {/* Pricing Tips */}
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="text-sm font-medium text-green-800 mb-2">Pricing Tips</h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Research market rates for similar services in your area</li>
              <li>• Consider your experience level and expertise</li>
              <li>• Factor in travel costs and service radius</li>
              <li>• Competitive pricing attracts more customers</li>
            </ul>
          </div>

          {/* Update Hourly Rate Button */}
          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]"
          >
            Update Hourly Rate
          </button>
        </form>
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white mt-10 rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
          Change Password
        </h2>

        <form onSubmit={changePasswordHandler}>
          {/* Current Password */}
          <div className="flex flex-col mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Current Password*
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition"
            />
          </div>

          {/* New Password Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                New Password*
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Confirm New Password*
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none transition"
              />
              {passwordData.newPassword && passwordData.confirmNewPassword && (
                <p className={`text-xs mt-1 ${
                  passwordData.newPassword === passwordData.confirmNewPassword 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {passwordData.newPassword === passwordData.confirmNewPassword 
                    ? "✓ Passwords match" 
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Password Requirements</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include numbers for better security</li>
              <li>• Avoid using personal information</li>
            </ul>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="mt-4 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}