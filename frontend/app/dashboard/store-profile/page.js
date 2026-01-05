"use client";
import { useMyProfileQuery, useUpdateProfileMutation } from "@/feature/UserApi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { 
  FiUploadCloud, 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiGlobe,
  FiHome,
  FiCamera,
  FiShoppingBag,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiImage,
  FiEdit2,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiCopy,
  FiLink,
  FiSearch
} from "react-icons/fi";
import { TbBuildingStore } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { 
  AiFillStar, 
  AiOutlineHeart, 
  AiOutlineShareAlt, 
  AiOutlineShoppingCart,
  AiOutlineEye,
  AiOutlineShop,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineGlobal,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineLinkedin
} from "react-icons/ai";
import { BsShieldCheck, BsStarFill } from "react-icons/bs";
import { useMyProductQuery } from "@/feature/ProductApi";

export default function StoreProfile() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const id = session?.user?.id;

  const { data: profile, isLoading, error } = useMyProfileQuery(id);
  const { data: productResponse, isLoading: productsLoading } = useMyProductQuery({ id, limit: 10, skip: 0 });
  
  const products = productResponse?.data || [];
  const totalProducts = productResponse?.total || 0;

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
    shopLogo: null,
    shopLogoPreview: null,
    
    // Service information
    serviceName: "",
    serviceCategory: "",
    serviceArea: "",
    serviceDescription: "",
    
    // Social media links
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    
    // Services images
    servicesImage: [],
    servicesImagePreviews: [],
    
    // Store status
    isActive: true,
    
    // Store policies
    returnPolicy: "",
    shippingPolicy: "",
    privacyPolicy: ""
  });

  const [isUploading, setIsUploading] = useState(false);
  const [existingLogo, setExistingLogo] = useState(null);
  const [existingServicesImages, setExistingServicesImages] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 9;

  // Generate store URL
  useEffect(() => {
    if (formData.shopName) {
      const slug = formData.shopName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setStoreUrl(`${window.location.origin}/store/${_id}`);
    }
  }, [formData.shopName, id]);

  // Load profile data into form when it's available
  useEffect(() => {
    if (profile?.data) {
      const data = profile.data;
      setFormData({
        shopName: data.shopName || "",
        shopDescription: data.shopDescription || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        category: data.category || "",
        website: data.website || "",
        shopLogo: null,
        shopLogoPreview: null,
        
        serviceName: data.serviceName || "",
        serviceCategory: data.serviceCategory || "",
        serviceArea: data.serviceArea || "",
        serviceDescription: data.serviceDescription || "",
        
        instagram: data.instagram || "",
        facebook: data.facebook || "",
        twitter: data.twitter || "",
        linkedin: data.linkedin || "",
        
        servicesImage: [],
        servicesImagePreviews: [],
        
        isActive: data.isActive !== undefined ? data.isActive : true,
        
        returnPolicy: data.returnPolicy || "",
        shippingPolicy: data.shippingPolicy || "",
        privacyPolicy: data.privacyPolicy || ""
      });

      if (data.shopLogo) {
        setExistingLogo(data.shopLogo);
      }
      
      if (data.servicesImage && Array.isArray(data.servicesImage)) {
        setExistingServicesImages(data.servicesImage);
      }
    }
  }, [profile?.data]);

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyStoreUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success(t("seller:storeUrlCopied"));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("seller:fileSizeError"));
        return;
      }

      if (!file.type.match(/image\/(png|jpg|jpeg|webp)/)) {
        toast.error(t("seller:fileTypeError"));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        shopLogo: file,
        shopLogoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleServicesImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: ${t("seller:fileSizeError")}`);
        return false;
      }
      if (!file.type.match(/image\/(png|jpg|jpeg|webp)/)) {
        toast.error(`${file.name}: ${t("seller:fileTypeError")}`);
        return false;
      }
      return true;
    }).slice(0, 10 - (existingServicesImages.length + formData.servicesImage.length));

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      servicesImage: [...prev.servicesImage, ...validFiles],
      servicesImagePreviews: [...prev.servicesImagePreviews, ...newPreviews]
    }));
  };

  const removeServicesImage = (index) => {
    setFormData(prev => ({
      ...prev,
      servicesImage: prev.servicesImage.filter((_, i) => i !== index),
      servicesImagePreviews: prev.servicesImagePreviews.filter((_, i) => i !== index)
    }));
  };

  const removeExistingServicesImage = (index) => {
    setExistingServicesImages(prev => prev.filter((_, i) => i !== index));
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
            t("seller:imageUploadFailed")
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
    const requiredFields = {
      shopName: t("seller:shopNameRequired"),
      shopDescription: t("seller:storeDescriptionRequired"),
      phoneNumber: t("seller:phoneNumberRequired"),
      address: t("seller:addressRequired"),
      category: t("seller:categoryRequired"),
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData[field]?.toString().trim()) {
        toast.error(message);
        return;
      }
    }

    setIsUploading(true);

    try {
      let shopLogoUrl = existingLogo;
      
      // Upload new logo if selected
      if (formData.shopLogo) {
        shopLogoUrl = await uploadToImgBB(formData.shopLogo);
      }

      // Upload services images
      const uploadedServicesImages = [...existingServicesImages];
      for (const imageFile of formData.servicesImage) {
        const imageUrl = await uploadToImgBB(imageFile);
        uploadedServicesImages.push(imageUrl);
      }

      // Prepare final data
      const finalData = {
        id: id,
        // Store information
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        category: formData.category,
        website: formData.website,
        shopLogo: shopLogoUrl,
        
        // Service information
        serviceName: formData.serviceName,
        serviceCategory: formData.serviceCategory,
        serviceArea: formData.serviceArea,
        serviceDescription: formData.serviceDescription,
        
        // Social media
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        
        // Services images
        servicesImage: uploadedServicesImages,
        
        // Store policies
        returnPolicy: formData.returnPolicy,
        shippingPolicy: formData.shippingPolicy,
        privacyPolicy: formData.privacyPolicy,
        
        // Store status
        isActive: formData.isActive,
        
        timestamp: new Date().toISOString(),
      };

      await updateProfile(finalData).unwrap();

      toast.success(t("seller:storeUpdateSuccess"));

      // Update existing states
      if (formData.shopLogo) {
        setExistingLogo(shopLogoUrl);
      }
      setExistingServicesImages(uploadedServicesImages);

      // Clear temporary states
      setFormData(prev => ({
        ...prev,
        shopLogo: null,
        shopLogoPreview: null,
        servicesImage: [],
        servicesImagePreviews: []
      }));

    } catch (error) {
      console.error("Error updating store profile:", error);
      toast.error(t("seller:storeUpdateFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      shopLogo: null,
      shopLogoPreview: null,
    }));
  };

  const allServicesImages = [...existingServicesImages, ...formData.servicesImagePreviews];

  if (isLoading) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent mb-6'></div>
          <p className='text-gray-700 text-lg font-medium animate-pulse'>
            {t("seller:loadingStoreProfile")}
          </p>
        </div>
      </div>
    );
  }

  // Generate stars function
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <BsStarFill key={i} className='text-[#FFA534] text-[17px]' />
        );
      } else {
        stars.push(
          <BsStarFill key={i} className='text-[#E0E0E0] text-[17px]' />
        );
      }
    }
    return stars;
  };

  // Enhanced Preview Component with real products
  const StorePreview = () => {
    // Use real products data
    const previewProducts = products.slice(0, 3); // Show first 3 products in preview
    
    // Calculate average rating
    const averageRating = products.length > 0 
      ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length 
      : 0;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto">
        {/* Store Header Banner */}
        <div className="relative h-[400px] bg-gradient-to-r  from-purple-600 via-purple-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-[1350px] mx-auto px-6 w-full">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Store Logo */}
                <div className="relative">
                  <div className="w-48 h-48 rounded-3xl overflow-hidden border-8 border-white/30 bg-white shadow-2xl">
                    {existingLogo || formData.shopLogoPreview ? (
                      <Image 
                        src={existingLogo || formData.shopLogoPreview} 
                        alt={formData.shopName || "Store Logo"} 
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <AiOutlineShop className="text-6xl text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl">
                    <FiShoppingBag className="text-3xl text-purple-600" />
                  </div>
                </div>

                {/* Store Info */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                      {formData.shopName || t("seller:storeProfile.shopInfo.shopName")}
                    </h1>
                    <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {formData.category || t("seller:storeProfile.shopInfo.category")}
                    </span>
                  </div>
                  
                  <p className="text-xl opacity-90 mb-6 max-w-3xl">
                    {formData.shopDescription || t("seller:storeProfile.shopInfo.storeDescription")}
                  </p>

                  {/* Store Stats */}
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <BsStarFill className="text-yellow-400 text-xl" />
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      <span className="opacity-80">{t("dashboard:avgRating")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AiOutlineShoppingCart className="text-xl" />
                      <span className="font-semibold">{previewProducts.length}</span>
                      <span className="opacity-80">{t("dashboard:products")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AiOutlineShop className="text-xl" />
                      <span className="font-semibold">{t("seller:storeSince")} {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                      <BsShieldCheck className="text-white" />
                      <span className="text-sm font-medium">{t("seller:verifiedProducts")}</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4">
                    {formData.phoneNumber && (
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                        <AiOutlinePhone />
                        <span>{formData.phoneNumber}</span>
                      </div>
                    )}
                    {formData.address && (
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                        <AiOutlineEnvironment />
                        <span>{formData.address}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                        <AiOutlineMail />
                        <span>{formData.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="flex gap-3">
              {formData.website && (
                <a 
                  href={formData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineGlobal className="text-xl text-white" />
                </a>
              )}
              {formData.instagram && (
                <a 
                  href={formData.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineInstagram className="text-xl text-white" />
                </a>
              )}
              {formData.facebook && (
                <a 
                  href={formData.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  <AiOutlineFacebook className="text-xl text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-6 right-6 z-20 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
          >
            <FiX className="text-2xl text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className='max-w-[1350px] mx-auto px-6  -mt-4 relative z-20 pb-16'>
          {/* Store Info Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("seller:aboutThisStore")}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {formData.shopDescription || t("seller:storeWelcomeMessage")}
                </p>
                
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">{t("seller:storeRating")}</div>
                    <div className="flex items-center gap-2">
                      <BsStarFill className="text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{t("seller:basedOnProducts")} {previewProducts.length} {t("seller:products")}</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">{t("seller:totalProducts")}</div>
                    <div className="text-2xl font-bold text-gray-900">{previewProducts.length}</div>
                    <div className="text-xs text-gray-500 mt-1">{t("seller:sampleProducts")}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">{t("seller:storeSince")}</div>
                    <div className="text-2xl font-bold text-gray-900">{new Date().getFullYear()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t("seller:storeCategories")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(previewProducts.map(p => p.category))].map((category, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t("seller:storePolicies")}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <FiShoppingBag className="text-purple-500" />
                      <span>{t("seller:securePayment")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <FiShoppingBag className="text-purple-500" />
                      <span>{t("seller:qualityGuaranteed")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <FiShoppingBag className="text-purple-500" />
                      <span>{t("seller:fastShipping")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Products Preview Section */}
          <section>
            <div className='mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-3 h-3 bg-purple-600 rounded-full'></div>
                  <p className='text-sm text-purple-700 font-medium'>
                    {t("seller:showingSampleProducts")} {previewProducts.length} {t("seller:sampleProducts")}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {t("seller:previewMode")}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {previewProducts.map((product) => (
                <div key={product._id} className='group'>
                  <article className='bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full'>
                    {/* Image Container */}
                    <div className='relative mb-5 overflow-hidden rounded-2xl'>
                      <div className='w-full h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 relative'>
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className='object-cover group-hover:scale-105 transition-transform duration-500'
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                            <AiOutlineShoppingCart className="text-4xl text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Tag */}
                      <span className={`absolute top-4 left-4 ${product.stock > 10 ? "bg-[#4CAF50]" : "bg-[#FF7C7C]"} text-white text-xs rounded-full px-3 py-1.5 font-medium shadow-lg`}>
                        {product.stock > 10 ? t("seller:inStock") : t("seller:lowStock")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className='flex-1'>
                      {/* Category */}
                      <div className="mb-2">
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2'>
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className='text-sm text-gray-500 mb-4 line-clamp-2'>
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className='flex items-center gap-1 mb-4'>
                        {generateStars(product.rating || 0)}
                        <span className='ml-2 text-sm text-gray-500'>
                          ({(product.rating || 0).toFixed(1)})
                        </span>
                      </div>

                      {/* Price and Stock */}
                      <div className='flex items-center justify-between mb-5'>
                        <div>
                          <span className='text-2xl font-bold text-gray-900'>
                            ${(product.price || 0).toLocaleString()}
                          </span>
                          <span className='block text-xs text-gray-500 mt-1'>
                            +${(product.shippingCost || 0)} {t("seller:shipping")}
                          </span>
                        </div>
                        <div className='text-right'>
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${product.stock > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {product.stock || 0} {t("seller:inStock")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className='flex-1 py-3 text-center font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F88D25] hover:shadow-lg transition-all flex items-center justify-center gap-2'>
                        <AiOutlineShoppingCart />
                        {t("seller:viewDetails")}
                      </button>
                      <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
                        <AiOutlineHeart />
                      </button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>

          {/* Store Footer Info */}
          <div className="mt-12 bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t("seller:storeInformation")}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <AiOutlineShop className="text-purple-600" />
                    <span className="text-gray-600">{formData.shopName || t("seller:yourStore")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AiOutlineEnvironment className="text-purple-600" />
                    <span className="text-gray-600">{formData.address || t("seller:addressPlaceholder")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AiOutlinePhone className="text-purple-600" />
                    <span className="text-gray-600">{formData.phoneNumber || t("seller:phonePlaceholder")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AiOutlineMail className="text-purple-600" />
                    <span className="text-gray-600">{formData.email || t("seller:emailPlaceholder")}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t("seller:storePerformance")}</h3>
                <ul className="space-y-2">
                  <li className="text-gray-600">
                    <span className="font-medium">{t("seller:averageRating")}:</span> {averageRating.toFixed(1)}/5
                  </li>
                  <li className="text-gray-600">
                    <span className="font-medium">{t("seller:sampleProducts")}:</span> {previewProducts.length}
                  </li>
                  <li className="text-gray-600">
                    <span className="font-medium">{t("seller:storeStatus")}:</span> {formData.isActive ? t("seller:active") : t("seller:inactive")}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t("seller:connectWithStore")}</h3>
                <p className="text-gray-600 mb-4">{t("seller:socialMediaLinks")}</p>
                <div className="flex gap-3">
                  {formData.website && (
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                      <AiOutlineGlobal className="text-xl" />
                    </div>
                  )}
                  {formData.instagram && (
                    <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                      <AiOutlineInstagram className="text-xl" />
                    </div>
                  )}
                  {formData.facebook && (
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <AiOutlineFacebook className="text-xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Control Bar */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border hidden border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700 hd font-medium">
                📱 {t("seller:storePreviewMessage")}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 bg-gradient-to-r from-[#9838E1] to-[#F88D25] text-white font-medium rounded-xl hover:shadow-lg transition-all"
                >
                  {t("seller:editStore")}
                </button>
                <a 
                  href={storeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-white border-2 border-purple-600 text-purple-600 font-medium rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2"
                >
                  <FiExternalLink />
                  {t("seller:visitLiveStore")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='w-full min-h-screen px-4 md:px-6 lg:px-8 pt-8 pb-16 bg-gradient-to-br from-purple-50 via-white to-blue-50'>
      <Toaster position="top-right" />
      {showPreview && <StorePreview />}
      
      {/* Header */}
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6'>
          <div className='flex-1'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600'>
              {t("seller:storeProfile.title")}
            </h1>
            <p className='text-purple-600 mt-2 text-lg'>
              {t("seller:storeProfile.subtitle")}
            </p>
          </div>
          
          <div className='flex flex-wrap gap-3'>
            <button
              onClick={() => setShowPreview(true)}
              className='flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-200 text-purple-700 font-medium rounded-xl hover:bg-purple-50 transition-all hover:shadow-lg'
            >
              <FiEye className="text-lg" />
              {t("seller:previewStore")}
            </button>
            <div className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 rounded-xl'>
              <IoMdCheckmarkCircleOutline className='text-xl' />
              <span className='font-medium'>{profile?.data?.role === 'seller' ? t("seller:sellerAccount") : t("seller:serviceProvider")}</span>
            </div>
          </div>
        </div>

        {/* Store URL Card */}
        <div className="mb-8 bg-white rounded-2xl border border-purple-200 shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#9838E1] to-[#F88D25] rounded-lg">
                <FiLink className="text-xl text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("seller:yourStoreUrl")}</h3>
                <p className="text-sm text-gray-600">{t("seller:shareThisLink")}</p>
              </div>
            </div>
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={storeUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 truncate"
                />
                <button
                  onClick={copyStoreUrl}
                  className="px-4 py-2 bg-gradient-to-r from-[#9838E1] to-[#F88D25] text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FiCopy />
                  {t("seller:copy")}
                </button>
                <a 
                  href={storeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 font-medium rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2"
                >
                  <FiExternalLink />
                  {t("seller:visit")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Products Overview Card */}
    

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {['basic', 'social', 'images', 'policies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                activeTab === tab
                  ? 'bg-white border-t border-l border-r border-gray-200 text-purple-600 relative -mb-px font-bold'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
              }`}
            >
              {tab === 'basic' && t("seller:basicInfo")}
              {tab === 'social' && t("seller:socialLinks")}
              {tab === 'images' && t("seller:storeImages")}
              {tab === 'policies' && t("seller:policies")}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveChanges} className='space-y-8'>
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className='bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8'>
              <div className='flex items-center mb-8'>
                <div className='p-3 bg-gradient-to-r from-[#9838E1] to-[#F88D25] rounded-xl mr-4'>
                  <FiHome className='text-2xl text-white' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {t("seller:storeProfile.identity.title")}
                  </h2>
                  <p className='text-gray-600 mt-1'>
                    {t("seller:storeProfile.identity.subtitle")}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Logo Upload */}
                <div className='lg:col-span-1'>
                  <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100'>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className='font-semibold text-gray-900 flex items-center'>
                        <FiCamera className='mr-2 text-purple-600' />
                        {t("seller:storeProfile.logoSection.title")}
                      </h3>
                      <button
                        type="button"
                        onClick={() => document.getElementById('logoUpload').click()}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        <FiEdit2 className="inline mr-1" /> {t("seller:edit")}
                      </button>
                    </div>
                    
                    <div className='flex flex-col items-center'>
                      <div className='relative w-48 h-48 rounded-2xl bg-white border-2 border-dashed border-purple-300 overflow-hidden mb-4 group hover:border-purple-500 transition-colors'>
                        {formData.shopLogoPreview ? (
                          <Image
                            src={formData.shopLogoPreview}
                            alt="New logo"
                            fill
                            className='object-cover'
                            sizes="192px"
                          />
                        ) : existingLogo ? (
                          <Image
                            src={existingLogo}
                            alt="Current logo"
                            fill
                            className='object-cover'
                            sizes="192px"
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <TbBuildingStore className='text-6xl text-purple-300' />
                          </div>
                        )}
                        
                        <label htmlFor="logoUpload" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <FiUploadCloud className="text-3xl text-white" />
                        </label>
                        
                        {formData.shopLogoPreview && (
                          <div className='absolute top-3 right-3 bg-gradient-to-r from-[#9838E1] to-[#F88D25] text-white text-xs px-3 py-1 rounded-full font-medium'>
                            {t("seller:new")}
                          </div>
                        )}
                      </div>

                      <input
                        id="logoUpload"
                        type='file'
                        className='hidden'
                        accept='image/*'
                        onChange={handleLogoChange}
                      />
                      
                      <p className='text-xs text-gray-500 mt-4 text-center'>
                        {t("seller:logoRequirements")}
                      </p>
                      
                      {formData.shopLogoPreview && (
                        <button
                          type='button'
                          onClick={removeLogo}
                          className='mt-3 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors'
                        >
                          <FiX className="inline mr-1" /> {t("seller:removeNewLogo")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Store Info Form */}
                <div className='lg:col-span-2'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Store Name */}
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        {t("seller:storeProfile.shopInfo.shopName")} *
                      </label>
                      <div className='relative'>
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600'>
                          <TbBuildingStore />
                        </div>
                        <input
                          type='text'
                          name='shopName'
                          value={formData.shopName}
                          onChange={handleInputChange}
                          placeholder={t("seller:shopNamePlaceholder")}
                          className='w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                          required
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        {t("seller:storeProfile.shopInfo.category")} *
                      </label>
                      <div className='relative'>
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600'>
                          <MdOutlineCategory />
                        </div>
                        <input
                          type='text'
                          name='category'
                          value={formData.category}
                          onChange={handleInputChange}
                          placeholder={t("seller:categoryPlaceholder")}
                          className='w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        {t("seller:storeProfile.shopInfo.email")} *
                      </label>
                      <div className='relative'>
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600'>
                          <FiMail />
                        </div>
                        <input
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t("seller:emailPlaceholder")}
                          className='w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        {t("seller:storeProfile.shopInfo.phone")} *
                      </label>
                      <div className='relative'>
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600'>
                          <FiPhone />
                        </div>
                        <input
                          type='tel'
                          name='phoneNumber'
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder={t("seller:phonePlaceholder")}
                          className='w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                          required
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        {t("seller:storeProfile.shopInfo.address")} *
                      </label>
                      <div className='relative'>
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600'>
                          <FiMapPin />
                        </div>
                        <input
                          type='text'
                          name='address'
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder={t("seller:addressPlaceholder")}
                          className='w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        {t("seller:storeProfile.shopInfo.storeDescription")} *
                      </label>
                      <textarea
                        name='shopDescription'
                        value={formData.shopDescription}
                        onChange={handleTextareaChange}
                        placeholder={t("seller:storeDescriptionPlaceholder")}
                        className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none h-32'
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className='bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8'>
              <div className='flex items-center mb-8'>
                <div className='p-3 bg-gradient-to-r from-[#9838E1] to-[#F88D25] rounded-xl mr-4'>
                  <FiGlobe className='text-2xl text-white' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {t("seller:storeProfile.socialMedia.title")}
                  </h2>
                  <p className='text-gray-600 mt-1'>
                    {t("seller:storeProfile.socialMedia.subtitle")}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Website */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    <FiGlobe className='inline mr-2 text-green-600' />
                    {t("seller:storeProfile.shopInfo.website")}
                  </label>
                  <input
                    type='url'
                    name='website'
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourstore.com"
                    className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition'
                  />
                </div>

                {/* Social Media Links */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                      <FiInstagram className='text-xl text-white' />
                    </div>
                    <div className="flex-1">
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        Instagram
                      </label>
                      <input
                        type='url'
                        name='instagram'
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/yourstore"
                        className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                      <FiFacebook className='text-xl text-white' />
                    </div>
                    <div className="flex-1">
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        Facebook
                      </label>
                      <input
                        type='url'
                        name='facebook'
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/yourstore"
                        className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg">
                      <FiTwitter className='text-xl text-white' />
                    </div>
                    <div className="flex-1">
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        Twitter
                      </label>
                      <input
                        type='url'
                        name='twitter'
                        value={formData.twitter}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/yourstore"
                        className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg">
                      <FiLinkedin className='text-xl text-white' />
                    </div>
                    <div className="flex-1">
                      <label className='block text-sm font-medium text-gray-900 mb-2'>
                        LinkedIn
                      </label>
                      <input
                        type='url'
                        name='linkedin'
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/company/yourstore"
                        className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Images Tab */}
          {activeTab === 'images' && (
            <div className='bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8'>
              <div className='flex items-center mb-8'>
                <div className='p-3 bg-gradient-to-r from-[#9838E1] to-[#F88D25] rounded-xl mr-4'>
                  <FiImage className='text-2xl text-white' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {t("seller:storeProfile.servicesImages.title")}
                  </h2>
                  <p className='text-gray-600 mt-1'>
                    {t("seller:storeProfile.servicesImages.subtitle")}
                  </p>
                </div>
              </div>

              <div className='space-y-6'>
                {/* Image Grid */}
                {allServicesImages.length > 0 ? (
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                    {allServicesImages.map((img, index) => (
                      <div key={index} className='relative group'>
                        <div className='aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200'>
                          <Image
                            src={img}
                            alt={`Store image ${index + 1}`}
                            fill
                            className='object-cover group-hover:scale-105 transition-transform duration-300'
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <button
                          type='button'
                          onClick={() => {
                            if (index < existingServicesImages.length) {
                              removeExistingServicesImage(index);
                            } else {
                              removeServicesImage(index - existingServicesImages.length);
                            }
                          }}
                          className='absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-md'
                        >
                          <FiX className='text-sm' />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white">{t("seller:clickToRemove")}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add More Button */}
                    {allServicesImages.length < 10 && (
                      <label className="cursor-pointer">
                        <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all flex flex-col items-center justify-center hover:border-teal-500 group">
                          <FiUploadCloud className="text-3xl text-gray-400 group-hover:text-teal-500 mb-2 transition-colors" />
                          <p className="text-sm text-gray-600 group-hover:text-teal-600 font-medium">{t("seller:addImage")}</p>
                          <p className="text-xs text-gray-500 mt-1">({10 - allServicesImages.length} {t("seller:remaining")})</p>
                        </div>
                        <input
                          type='file'
                          multiple
                          accept='image/*'
                          onChange={handleServicesImagesChange}
                          className='hidden'
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className='text-center py-16 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100'>
                    <FiImage className='text-6xl text-gray-400 mx-auto mb-4' />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {t("seller:storeProfile.servicesImages.noImages")}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      {t("seller:uploadImagesMessage")}
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#9838E1] to-[#F88D25] text-white font-medium rounded-xl hover:shadow-lg transition-all">
                      <FiUploadCloud />
                      {t("seller:uploadImages")}
                      <input
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={handleServicesImagesChange}
                        className='hidden'
                      />
                    </label>
                  </div>
                )}

                {allServicesImages.length > 0 && allServicesImages.length < 10 && (
                  <div className="text-center pt-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-teal-200 text-teal-700 font-medium rounded-xl hover:bg-teal-50 transition-all">
                      <FiUploadCloud />
                      {t("seller:addMoreImages")} ({10 - allServicesImages.length} {t("seller:remaining")})
                      <input
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={handleServicesImagesChange}
                        className='hidden'
                      />
                    </label>
                  </div>
                )}

                <p className='text-xs text-gray-500 text-center'>
                  {t("seller:storeProfile.servicesImages.requirements")}
                </p>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className='bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8'>
              <div className='flex items-center mb-8'>
                <div className='p-3 bg-gradient-to-r from-[#9838E1] to-[#F88D25] rounded-xl mr-4'>
                  <FiCheck className='text-2xl text-white' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {t("seller:storePolicies")}
                  </h2>
                  <p className='text-gray-600 mt-1'>
                    {t("seller:storePoliciesSubtitle")}
                  </p>
                </div>
              </div>

              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    {t("seller:returnPolicy")}
                  </label>
                  <textarea
                    name='returnPolicy'
                    value={formData.returnPolicy}
                    onChange={handleTextareaChange}
                    placeholder={t("seller:returnPolicyPlaceholder")}
                    className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none h-32'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    {t("seller:shippingPolicy")}
                  </label>
                  <textarea
                    name='shippingPolicy'
                    value={formData.shippingPolicy}
                    onChange={handleTextareaChange}
                    placeholder={t("seller:shippingPolicyPlaceholder")}
                    className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none h-32'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    {t("seller:privacyPolicy")}
                  </label>
                  <textarea
                    name='privacyPolicy'
                    value={formData.privacyPolicy}
                    onChange={handleTextareaChange}
                    placeholder={t("seller:privacyPolicyPlaceholder")}
                    className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none h-32'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className='sticky bottom-6'>
            <button
              type='submit'
              disabled={isUploading}
              className={`w-full mt-auto py-[12px] text-[15px] font-medium text-white
                    rounded-[12px] bg-[linear-gradient(90deg,#9838E1,#F88D25)]
                    shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:opacity-90 cursor-pointer ${
                isUploading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <div className='flex items-center justify-center'>
                  <svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("seller:saving")}
                </div>
              ) : (
                <>
                  <FiCheck className="inline mr-2" />
                  {t("seller:storeProfile.actions.saveChanges")}
                </>
              )}
            </button>
            
            {/* Tab Navigation */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'basic' ? 'policies' : 'basic')}
                className="text-sm text-gray-600 hover:text-purple-600 font-medium px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                ← {activeTab === 'basic' ? t("seller:goToPolicies") : t("seller:backToBasicInfo")}
              </button>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm text-gray-600 hover:text-purple-600 font-medium px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                ↑ {t("seller:scrollToTop")}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="text-sm text-gray-600 hover:text-purple-600 font-medium px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {t("seller:previewStore")} →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}