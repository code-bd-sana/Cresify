"use client";
import { useMyProfileQuery, useUpdateProfileMutation } from "@/feature/UserApi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiUploadCloud } from "react-icons/fi";
import { HiOutlineHomeModern } from "react-icons/hi2";

export default function StoreProfile() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const id = session?.user?.id;

  const { data: profile, isLoading, error } = useMyProfileQuery(id);
  const [updateProfile, { isLoading: profileLoading, error: updateError }] =
    useUpdateProfileMutation();

  // Form state
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    email: "",
    phoneNumber: "",
    address: "",
    category: "",
    website: "",
    storeLogo: null,
    storeLogoPreview: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [existingLogo, setExistingLogo] = useState(null);

  // Load profile data into form when it's available
  useEffect(() => {
    if (profile?.data) {
      setFormData({
        shopName: profile.data.shopName || "",
        shopDescription: profile.data.shopDescription || "",
        email: profile.data.email || "",
        phoneNumber: profile.data.phoneNumber || "",
        address: profile.data.address || "",
        category: profile.data.category || "",
        website: profile.data.website || "",
        storeLogo: null,
        storeLogoPreview: null,
      });

      // Store existing logo URL
      if (profile.data.shopLogo) {
        setExistingLogo(profile.data.shopLogo);
      }
    }
  }, [profile?.data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(t("common:fileSizeError", "File size should be less than 5MB"));
        return;
      }

      // Validate file type
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        alert(
          t(
            "common:fileTypeError",
            "Please upload only PNG, JPG, or JPEG images"
          )
        );
        return;
      }

      setFormData((prev) => ({
        ...prev,
        storeLogo: file,
        storeLogoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const uploadToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=b49a7cbd3d5227c273945bd7114783a9`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(
          data.error?.message ||
            t("common:imageUploadFailed", "Image upload failed")
        );
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.shopName.trim()) {
      alert(t("common:shopNameRequired", "Please enter shop name"));
      return;
    }

    if (!formData.shopDescription.trim()) {
      alert(
        t("common:storeDescriptionRequired", "Please enter store description")
      );
      return;
    }

    if (!formData.phoneNumber.trim()) {
      alert(t("common:phoneNumberRequired", "Please enter phone number"));
      return;
    }

    if (!formData.address.trim()) {
      alert(t("common:addressRequired", "Please enter store address"));
      return;
    }

    if (!formData.category.trim()) {
      alert(t("common:categoryRequired", "Please enter category"));
      return;
    }

    setIsUploading(true);

    try {
      let shopLogoUrl = existingLogo; // Keep existing logo by default

      // Step 1: Upload new logo to ImgBB if selected
      if (formData.storeLogo) {
        shopLogoUrl = await uploadToImgBB(formData.storeLogo);
        console.log("✅ Logo uploaded to ImgBB:", shopLogoUrl);
      }

      // Step 2: Prepare final data
      const finalData = {
        id: id,
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        category: formData.category,
        website: formData.website,
        shopLogo: shopLogoUrl,
        timestamp: new Date().toISOString(),
      };

      await updateProfile(finalData).unwrap();

      toast.success(
        t("common:storeUpdateSuccess", "Store updated successfully")
      );

      // Step 5: Update existing logo state if new logo was uploaded
      if (formData.storeLogo) {
        setExistingLogo(shopLogoUrl);
      }

      // Step 6: Clear the new logo selection from form state
      setFormData((prev) => ({
        ...prev,
        storeLogo: null,
        storeLogoPreview: null,
      }));
    } catch (error) {
      console.error("❌ Error updating store profile:", error);
      toast.error(
        t("common:storeUpdateFailed", "Failed to update store profile")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      storeLogo: null,
      storeLogoPreview: null,
    }));
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
          <p className='mt-4 text-gray-500'>
            {t("common:loadingStoreProfile", "Loading store profile...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen px-2 pt-6'>
      <Toaster />
      {/* PAGE TITLE */}
      <div>
        <h1 className='text-[28px] font-semibold text-[#1D1D1F]'>
          {t("seller:storeProfile.title", "Store Profile")}
        </h1>
        <p className='text-[#8A72BE] text-sm mt-1'>
          {t(
            "seller:storeProfile.subtitle",
            "Manage your store information and settings"
          )}
        </p>
      </div>

      <form onSubmit={handleSaveChanges}>
        {/* STORE LOGO CARD */}
        <div className='bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 mt-8'>
          <h2 className='text-[20px] font-semibold text-[#1D1D1F] mb-5'>
            {t("seller:storeProfile.logoSection.title", "Store Logo")}
          </h2>

          <div className='flex flex-col md:flex-row items-center gap-6'>
            {/* Current Logo / Preview */}
            <div className='flex flex-col items-center gap-3'>
              <div className='w-[90px] h-[90px] rounded-xl bg-[#F4EBFF] flex items-center justify-center border border-[#E8D9FF] overflow-hidden relative'>
                {formData.storeLogoPreview ? (
                  // New logo preview
                  <div className='relative w-full h-full'>
                    <Image
                      src={formData.storeLogoPreview}
                      alt={t("common:newLogoPreview", "New Logo Preview")}
                      fill
                      className='object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent'></div>
                  </div>
                ) : existingLogo ? (
                  // Existing logo from database
                  <div className='relative w-full h-full'>
                    <Image
                      src={existingLogo}
                      alt={t("common:currentStoreLogo", "Current Store Logo")}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  // Default icon
                  <HiOutlineHomeModern className='text-[40px] text-[#C39BFF]' />
                )}

                {/* Preview badge */}
                {formData.storeLogoPreview && (
                  <div className='absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full'>
                    {t("common:new", "New")}
                  </div>
                )}
              </div>

              {/* Logo info */}
              <div className='text-center'>
                {formData.storeLogoPreview ? (
                  <>
                    <p className='text-xs text-green-600 font-medium'>
                      {t("common:newLogoSelected", "New logo selected")}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formData.storeLogo?.name}
                    </p>
                    <button
                      type='button'
                      onClick={removeLogo}
                      className='text-xs text-red-600 hover:text-red-700 mt-1'>
                      {t("common:remove", "Remove")}
                    </button>
                  </>
                ) : existingLogo ? (
                  <p className='text-xs text-gray-500'>{t("")}</p>
                ) : (
                  <p className='text-xs text-gray-500'>{t("")}</p>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className='flex-1'>
              <label
                htmlFor='logo'
                className='block w-full h-[90px] border-2 border-dashed border-[#E2D7F7] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#FBF9FF] transition'>
                <FiUploadCloud className='text-[32px] text-[#D29CF7]' />
                <p className='text-sm text-[#A38CCB] mt-1'>
                  {t(
                    "seller:storeProfile.logoSection.fileHint",
                    "PNG, JPG up to 5MB"
                  )}
                </p>
                <input
                  id='logo'
                  type='file'
                  className='hidden'
                  accept='image/png, image/jpg, image/jpeg'
                  onChange={handleLogoChange}
                />
              </label>
              <div className='mt-2 text-xs text-gray-500 text-center'>
                {existingLogo ? (
                  <p>
                    {t(
                      "seller:storeProfile.logoSection.replaceHint",
                      "Current logo will be replaced if you upload a new one"
                    )}
                  </p>
                ) : (
                  <p>
                    {t("common:uploadLogoHint", "Upload a logo for your store")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STORE INFORMATION */}
        <div className='bg-white rounded-[14px] border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.06)] p-6 mt-8'>
          <h2 className='text-[20px] font-semibold text-[#1D1D1F] mb-5'>
            {t("seller:storeProfile.shopInfo.title", "Shop Information")}
          </h2>

          {/* FORM GRID */}
          <div className='flex flex-col gap-6'>
            {/* Store Name */}
            <div>
              <label className='text-sm text-[#1D1D1F] font-medium'>
                {t("seller:storeProfile.shopInfo.shopName", "Shop Name")}*
              </label>
              <input
                type='text'
                name='shopName'
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder={t(
                  "common:shopNamePlaceholder",
                  "Tech Haven Store"
                )}
                className='mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none transition'
                required
              />
            </div>

            {/* Store Description */}
            <div>
              <label className='text-sm text-[#1D1D1F] font-medium'>
                {t(
                  "seller:storeProfile.shopInfo.storeDescription",
                  "Store Description"
                )}
                *
              </label>
              <textarea
                name='shopDescription'
                value={formData.shopDescription}
                onChange={handleInputChange}
                placeholder={t(
                  "common:storeDescriptionPlaceholder",
                  "Your one-stop shop for premium tech accessories and gadgets"
                )}
                className='mt-2 w-full h-[90px] px-4 py-3 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none transition resize-none'
                required
              />
            </div>

            {/* EMAIL + PHONE */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='text-sm text-[#1D1D1F] font-medium'>
                  {t("seller:storeProfile.shopInfo.email", "Email Address")}*
                </label>
                <input
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  type='email'
                  placeholder={t(
                    "common:emailPlaceholder",
                    "contact@techhaven.com"
                  )}
                  className='mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none transition'
                  required
                />
              </div>

              <div>
                <label className='text-sm text-[#1D1D1F] font-medium'>
                  {t("seller:storeProfile.shopInfo.phone", "Phone Number")}*
                </label>
                <input
                  type='text'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder={t("common:phonePlaceholder", "(603) 555-0123")}
                  className='mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none transition'
                  required
                />
              </div>
            </div>

            {/* ADDRESS + CATEGORY */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='text-sm text-[#1D1D1F] font-medium'>
                  {t("seller:storeProfile.shopInfo.address", "Store Address")}*
                </label>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t(
                    "common:addressPlaceholder",
                    "1901 Thornridge Cir. Shiloh, Hawaii 81063"
                  )}
                  className='mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none transition'
                  required
                />
              </div>

              <div>
                <label className='text-sm text-[#1D1D1F] font-medium'>
                  {t("seller:storeProfile.shopInfo.category", "Category")}*
                </label>
                <input
                  type='text'
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder={t("common:categoryPlaceholder", "Technology")}
                  className='mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none transition'
                  required
                />
              </div>
            </div>

            {/* WEBSITE */}
            <div>
              <label className='text-sm text-[#1D1D1F] font-medium'>
                {t("seller:storeProfile.shopInfo.website", "Website")}
              </label>
              <input
                type='text'
                name='website'
                value={formData.website}
                onChange={handleInputChange}
                placeholder={t(
                  "common:websitePlaceholder",
                  "www.techhaven.com"
                )}
                className='mt-2 w-full h-[48px] px-4 rounded-xl border border-[#E8E6F2] bg-white focus:ring-2 focus:ring-[#C39BFF] outline-none transition'
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            type='submit'
            disabled={isUploading}
            className={`w-full h-[50px] mt-6 rounded-xl text-white font-medium text-[15px] bg-gradient-to-r from-[#A155FB] to-[#F68E44] hover:opacity-95 transition flex items-center justify-center ${
              isUploading ? "opacity-70 cursor-not-allowed" : ""
            }`}>
            {isUploading ? (
              <span className='flex items-center gap-2'>
                <svg
                  className='animate-spin h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                {formData.storeLogo
                  ? t("common:uploadingLogo", "Uploading Logo...")
                  : t("common:savingChanges", "Saving Changes...")}
              </span>
            ) : (
              t("seller:storeProfile.actions.saveChanges", "Save Changes")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
