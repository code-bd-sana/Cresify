"use client";

import { useChangePasswordMutation, useMyProfileQuery } from "@/feature/UserApi";
import {
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  KeyRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfileOverviewPage() {
  const { data } = useSession();
  const user = data?.user;
  const { data: profile, isLoading, loading } = useMyProfileQuery(user?.id);
  const [changePassword, {isLoading:changePasswordLoading}] = useChangePasswordMutation()
  console.log(profile, "Profile is ready to implement");

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    id:user?.id
  });

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      id: user?.id,
      [name]: value,
    });
  };

  // Handle password update
  const handleUpdatePassword = async() => {
    // Log password data to console

    // Validation
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (!passwordData.confirmPassword) {
      toast.error("Please confirm your new password");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {

         console.log("Password Data:", passwordData);
         const finalData ={
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          id: user?.id
         }


        const result =  await changePassword(finalData);
        console.log(result, "Result is here");
   
         if(result.error){
          toast.error(result?.error?.data?.message);
          return;

         }
               toast.success("Password chagne successfully");
    
      
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message)
    }
    // Show success message
    toast.success("Password update request sent! Check console for data.");
    
    // Here you would typically call an API to update the password
    // Example: updatePasswordMutation(passwordData);
    
    // Reset form after submission
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="w-full bg-[#F7F7FA] pb-10 px-4 flex justify-center">
      <Toaster/>
      <div className="w-full max-w-[900px]">
        {/* ---------------- PROFILE OVERVIEW ---------------- */}
        <section className="bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-[#1B1B1B] mb-5">
            Profile Overview
          </h2>

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative h-[95px] w-[95px] rounded-full overflow-hidden border-[3px] border-white shadow-md">
              <img src="/user.png" className="h-full w-full object-cover" />
              <button className="absolute bottom-0 right-0 h-[28px] w-[28px] rounded-full bg-[#9838E1] flex items-center justify-center">
                <Camera className="h-[14px] w-[14px] text-white" />
              </button>
            </div>
            <p className="text-[12px] text-[#9838E1] mt-[6px] cursor-pointer">
              Change Photo
            </p>
          </div>

          {/* USER DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full name */}
            <div>
              <label className="block text-[12px] mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue={profile?.data?.name}
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white px-3 focus:outline-none"
                  placeholder="Jane Cooper"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="text"
                  defaultValue={profile?.data?.email}
                  readOnly
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white pl-10 pr-3 focus:outline-none"
                  placeholder="jane@domain.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[12px] mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="text"
                  defaultValue={profile?.data?.phoneNumber}
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white pl-10 pr-3 focus:outline-none"
                  placeholder="+880 555 0100"
                />
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-[12px] mb-1">Member Since</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="text"
                  defaultValue={profile?.data?.createdAt}
                  className="w-full text-[13px] h-[38px] rounded-[8px] border border-[#ECE6F7] bg-white pl-10 pr-3 focus:outline-none"
                  placeholder="January 2023"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- SECURITY SETTINGS ---------------- */}
        <section className="bg-white rounded-[14px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6">
          <h3 className="text-[15px] font-semibold text-[#1B1B1B] mb-4">
            Security Settings
          </h3>

          <div className="space-y-3">
            {/* Current password */}
            <div>
              <label className="block text-[12px] mb-1">Current Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-[38px] pl-10 pr-3 rounded-[8px] border border-[#ECE6F7] focus:outline-none text-[13px]"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-[12px] mb-1">New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-[38px] pl-10 pr-3 rounded-[8px] border border-[#ECE6F7] text-[13px] focus:outline-none"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[12px] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9838E1]" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-[38px] pl-10 pr-3 rounded-[8px] border border-[#ECE6F7] text-[13px] focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

    
      

            {/* Update Button */}
            <button
              onClick={handleUpdatePassword}
              className="w-full h-[44px] rounded-[8px] text-[13px] text-white font-medium mt-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              style={{
                background: "linear-gradient(90deg,#9838E1,#F68E44)",
              }}
            >
              Update Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}