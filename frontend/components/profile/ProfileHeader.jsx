export default function ProfileHeader() {
  return (
    <div className="w-full bg-white py-8 px-6">
      {/* Title */}
      <h1 className="text-[20px] font-semibold text-[#1B1B1B]">
        My Profile
      </h1>

      {/* Subtitle link */}
      <p className="mt-2 text-[13px] text-[#9838E1] cursor-pointer">
        Manage your personal information and account settings
      </p>
    </div>
  );
}
