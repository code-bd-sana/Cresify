"use client";

export default function AccountSettings() {
  return (
    <div className="w-full min-h-screen px-2 pt-6">

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

        <div className="grid md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              defaultValue="John Seller"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              defaultValue="contact@techhaven.com"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="text"
              defaultValue="(603) 555-0123"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <button
          className="mt-8 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition"
        >
          Save Changes
        </button>
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white mt-10 rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
          Change Password
        </h2>

        {/* Current Password */}
        <div className="flex flex-col mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Current Password*
          </label>
          <input
            type="password"
            defaultValue="KVNDLX"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
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
              defaultValue="KXNDKCVK"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Confirm New Password*
            </label>
            <input
              type="password"
              defaultValue="DKJBCDD"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>
        </div>

        {/* Update Button */}
        <button
          className="mt-8 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#9C6BFF] to-[#F78A3B] shadow-md hover:opacity-90 transition"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
