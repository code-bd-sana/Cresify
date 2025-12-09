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

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Load profile data into form when available
  useEffect(() => {
    if (profile?.data) {
      setProfileData({
        name: profile.data.name || "",
        email: profile.data.email || "",
        phoneNumber: profile.data.phoneNumber || "",
      });
    }
  }, [profile?.data]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
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


    const response =  await changePassword(passwordChangeData);

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
    toast.success("Password Change Successfully")
  
} catch (error) {
  toast.error(error?.data?.message)
}

  };

  const saveChangesHandler = async(e) => {
    e.preventDefault();

    // Validation
    if (!profileData.name.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!profileData.phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }

    // Prepare profile update data
    const profileUpdateData = {
      id: id,
      name: profileData.name,

      phoneNumber: profileData.phoneNumber,

      updateType: "profile_update",
    };

    // Log to console

    await updateProfile(profileUpdateData)


    // Show success message
   toast.success('Profile information save')
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
          Profile Information
        </h2>

        <form onSubmit={saveChangesHandler}>
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
            Save Changes
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

          {/* Update Button */}
          <button
            type="submit"
            className="mt-8 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition hover:scale-[1.02]"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}