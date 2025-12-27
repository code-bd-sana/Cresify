"use client";
import {
  useCreateServiceProviderMutation,
  useCreateUserMutation,
} from "@/feature/UserApi";
import logo from "@/public/logo.png";
import image from "@/public/register.png";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// IMGBB Configuration
const IMGBB_API_KEY = "b49a7cbd3d5227c273945bd7114783a9";
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

const Registerpage = () => {
  const params = useParams();
  const role = params?.role;
  const [currentStep, setCurrentStep] = useState(1);
  const [createUser, { isLoading: userLoading, error: userError }] =
    useCreateUserMutation();
  const [
    createServiceProvider,
    { isLoading: providerLoading, error: providerError },
  ] = useCreateServiceProviderMutation();
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Step 2: Business/Service Details (Only for seller/provider)
    shopName: "",
    serviceName: "",
    serviceCategory: "",
    serviceArea: "",
    serviceRedius: "",
    hourlyRate: "",
    yearsOfExperience: "",
    serviceDescription: "",
    website: "",
    
    // Location Details (All roles)
    country: "",
    region: "",
    city: "",
    address: "",

    // Step 3: Verification & Images
    nationalId: "",
    businessLogo: null,
    servicesImage: [],
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    slotDuration: "30",
  });

  // Working Days Options
  const workingDaysOptions = [
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
    { value: "Sun", label: "Sunday" },
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => {
      const days = [...prev.workingDays];
      if (days.includes(day)) {
        return { ...prev, workingDays: days.filter(d => d !== day) };
      } else {
        return { ...prev, workingDays: [...days, day] };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target.result,
          businessLogo: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServicesImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Convert files to base64
      const readers = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              file: file,
              preview: event.target.result
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((images) => {
        setFormData((prev) => ({
          ...prev,
          servicesImage: [...prev.servicesImage, ...images]
        }));
      });
    }
  };

  const removeServiceImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      servicesImage: prev.servicesImage.filter((_, i) => i !== index)
    }));
  };

  // Upload image to IMGBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMGBB_API_KEY);

    try {
      const response = await fetch(IMGBB_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("IMGBB Upload Error:", error);
      throw error;
    }
  };

  const validateStep1 = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("Please fill all required fields");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    
    if (formData.password.length < 10) {
      toast.error("Password must be at least 10 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    // For buyer, only country, region, and city are required
    if (role === "buyer") {
      if (!formData.country || !formData.region || !formData.city) {
        toast.error("Please enter your country, region, and city");
        return false;
      }
      return true;
    }
    
    // For seller/provider, validate business/service details
    if (!formData.shopName) {
      toast.error("Please enter shop/business name");
      return false;
    }

    if (role === "provider") {
      if (!formData.serviceName) {
        toast.error("Please enter service name");
        return false;
      }

      if (!formData.serviceCategory) {
        toast.error("Please select service category");
        return false;
      }

      if (!formData.serviceArea) {
        toast.error("Please enter service area");
        return false;
      }

      if (!formData.serviceRedius) {
        toast.error("Please select service radius");
        return false;
      }

      if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
        toast.error("Please enter a valid hourly rate");
        return false;
      }

      if (!formData.yearsOfExperience) {
        toast.error("Please select years of experience");
        return false;
      }

      if (!formData.serviceDescription) {
        toast.error("Please enter service description");
        return false;
      }
    }

    // Location validation for all
    if (!formData.country || !formData.region || !formData.city) {
      toast.error("Please enter your country, region, and city");
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    // Only require nationalId for seller/provider
    if ((role === "seller" || role === "provider") && !formData.nationalId) {
      toast.error("Please enter National ID/Tax ID");
      return false;
    }
    
    // For provider, require at least one service image
    if (role === "provider" && formData.servicesImage.length === 0) {
      toast.error("Please upload at least one service image");
      return false;
    }

    // Validate working hours
    if (role === "provider") {
      const startTime = formData.workingHoursStart;
      const endTime = formData.workingHoursEnd;
      
      if (startTime >= endTime) {
        toast.error("End time must be after start time");
        return false;
      }

      if (!formData.slotDuration || parseInt(formData.slotDuration) <= 0) {
        toast.error("Please enter a valid slot duration");
        return false;
      }
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    // Prepare base data
    const finalData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: fullName,
      email: formData.email,
      phoneNumber: formData.phone,
      password: formData.password,
      role: role,
      country: formData.country.trim(),
      region: formData.region.trim(),
      city: formData.city.trim(),
      address: formData.address ? formData.address.trim() : "",
      registrationDate: new Date().toISOString(),
    };

    // Add business/seller details
    if (role === "seller" || role === "provider") {
      finalData.shopName = formData.shopName;
      finalData.category = formData.category;
      finalData.nationalId = formData.nationalId;
      
      // Upload business logo if exists
      if (formData.businessLogo) {
        try {
          toast.loading("Uploading business logo...");
          const logoUrl = await uploadToImgBB(formData.businessLogo);
          finalData.image = logoUrl;
          finalData.businessLogo = logoUrl;
          toast.dismiss();
          toast.success("Logo uploaded successfully!");
        } catch (error) {
          toast.error("Failed to upload logo. Please try again.");
          return;
        }
      }

      // For provider, add all service details
      if (role === "provider") {
        finalData.serviceName = formData.serviceName;
        finalData.serviceCategory = formData.serviceCategory;
        finalData.serviceArea = formData.serviceArea;
        finalData.serviceRedius = parseInt(formData.serviceRedius);
        finalData.hourlyRate = parseFloat(formData.hourlyRate);
        finalData.yearsOfExperience = formData.yearsOfExperience;
        finalData.serviceDescription = formData.serviceDescription;
        finalData.website = formData.website || "";
        finalData.workingHours = {
          start: formData.workingHoursStart,
          end: formData.workingHoursEnd
        };
        finalData.slotDuration = parseInt(formData.slotDuration);
        finalData.workingDays = formData.workingDays;

        // Upload service images to IMGBB
        if (formData.servicesImage.length > 0) {
          try {
            toast.loading(`Uploading ${formData.servicesImage.length} service images...`);
            const serviceImageUrls = [];
            
            for (const imageData of formData.servicesImage) {
              const imageUrl = await uploadToImgBB(imageData.file);
              serviceImageUrls.push(imageUrl);
            }
            
            finalData.servicesImage = serviceImageUrls;
            toast.dismiss();
            toast.success("Service images uploaded successfully!");
          } catch (error) {
            toast.error("Failed to upload service images");
            return;
          }
        }
      }
    }

    try {
      let response;
      if (role === "provider") {
        response = await createServiceProvider(finalData);
      } else {
        response = await createUser(finalData);
      }

      if (response.error) {
        throw new Error(response.error.data?.message || "Registration failed");
      }

      toast.success("Registration Successful!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const renderProgressDots = () => (
    <div className='flex mb-8 items-center gap-[15px] justify-center w-full'>
      <div className='flex items-center w-[35%]'>
        <p
          className={`w-[35px] h-[35px] flex items-center justify-center rounded-full text-[1rem] ${
            currentStep >= 1
              ? "bg-gradient-to-tr from-[#B448A5] via-[#B448A5] to-[#E6673B] text-white"
              : "border border-[#9838E1] text-[#9838E1]"
          }`}>
          1
        </p>
        <hr
          className={`w-[80%] ${
            currentStep >= 2 ? "border-[#9838E1]" : "border-gray-300"
          }`}
        />
      </div>
      <div className='flex items-center w-[35%]'>
        <p
          className={`w-[35px] h-[35px] flex items-center justify-center rounded-full text-[1rem] ${
            currentStep >= 2
              ? "bg-gradient-to-tr from-[#B448A5] via-[#B448A5] to-[#E6673B] text-white"
              : "border border-[#9838E1] text-[#9838E1]"
          }`}>
          2
        </p>
        <hr
          className={`w-[80%] ${
            currentStep >= 3 ? "border-[#9838E1]" : "border-gray-300"
          }`}
        />
      </div>
      <p
        className={`w-[35px] h-[35px] flex items-center justify-center rounded-full text-[1rem] ${
          currentStep >= 3
            ? "bg-gradient-to-tr from-[#B448A5] via-[#B448A5] to-[#E6673B] text-white"
            : "border border-[#9838E1] text-[#9838E1]"
        }`}>
        3
      </p>
    </div>
  );

  return (
    <div className='bg-[#F6F1F4] min-h-screen py-8'>
      <Toaster />
      <div className='flex md:px-16 max-w-5xl items-center min-h-[calc(100vh-4rem)] mx-auto gap-12'>
        {/* Left Image Section */}
        <section className='flex-1 justify-center hidden md:flex'>
          <Image
            alt='Cresify Registration'
            src={image}
            className='max-w-full h-auto'
          />
        </section>

        {/* Form Section */}
        <section className='flex-1'>
          <div className='bg-white p-8 rounded-lg shadow-lg'>
            <Image
              src={logo}
              width={180}
              height={80}
              alt='Cresify Logo'
              className='mb-6 mx-auto'
            />

            <h2 className='text-center text-2xl font-bold mb-2 text-gray-800'>
              Create your{" "}
              {role === "seller"
                ? "Seller"
                : role === "provider"
                ? "Service Provider"
                : "Buyer"}{" "}
              Account
            </h2>
            <p className='text-center text-gray-500 mb-6'>
              {currentStep === 1 && "Let's start with your personal details"}
              {currentStep === 2 && (role === "buyer" ? "Tell us your location" : "Tell us more about your business")}
              {currentStep === 3 && "Final step to complete your registration"}
            </p>

            {/* Progress Bar */}
            {renderProgressDots()}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Basic Information (Same for all roles) */}
              {currentStep === 1 && (
                <>
                  <div className='py-4 mb-4'>
                    <h4 className='text-xl font-semibold text-gray-800'>
                      Step 1: Basic Information
                    </h4>
                    <p className='text-[#9838E1]'>
                      Let&apos;s start with your personal details
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          First Name *
                        </label>
                        <input
                          type='text'
                          name='firstName'
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='Enter first name'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Last Name *
                        </label>
                        <input
                          type='text'
                          name='lastName'
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='Enter last name'
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email *
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder='you@example.com'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Phone Number *
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder='+1 (555) 123-4567'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Password * (min. 10 characters)
                      </label>
                      <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder='••••••••••'
                        minLength={10}
                        required
                      />
                      <p className='text-xs text-gray-500 mt-1'>
                        Password must be at least 10 characters long
                      </p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Confirm Password *
                      </label>
                      <input
                        type='password'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder='••••••••••'
                        minLength={10}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2: Business/Service Details (Different per role) */}
              {currentStep === 2 && (
                <>
                  <div className='py-4 mb-4'>
                    <h4 className='text-xl font-semibold text-gray-800'>
                      Step 2: {role === "buyer" ? "Location Details" : role === "provider" ? "Service Details" : "Business Details"}
                    </h4>
                    <p className='text-[#9838E1]'>
                      {role === "buyer" ? "Tell us where you're located" : role === "provider" ? "Tell us about your service" : "Tell us about your business"}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {/* Business/Shop Name - For seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Shop/Business Name *
                        </label>
                        <input
                          type='text'
                          name='shopName'
                          value={formData.shopName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='Enter your shop/business name'
                          required
                        />
                      </div>
                    )}

                    {/* Service Details - Only for provider */}
                    {role === "provider" && (
                      <>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Service Name *
                          </label>
                          <input
                            type='text'
                            name='serviceName'
                            value={formData.serviceName}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='e.g., Home Cleaning, Plumbing Service'
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Service Category *
                          </label>
                          <select
                            name='serviceCategory'
                            value={formData.serviceCategory}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            required>
                            <option value=''>Select category</option>
                            {serviceCategories.map((category) => (
                              <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Service Area (City) *
                          </label>
                          <input
                            type='text'
                            name='serviceArea'
                            value={formData.serviceArea}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='e.g., Dhaka, Chittagong'
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Service Radius *
                          </label>
                          <select
                            name='serviceRedius'
                            value={formData.serviceRedius}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            required>
                            <option value=''>Select service radius</option>
                            {serviceRadiusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Hourly Rate ($) *
                          </label>
                          <input
                            type='number'
                            name='hourlyRate'
                            value={formData.hourlyRate}
                            onChange={handleInputChange}
                            min='1'
                            step='0.01'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='e.g., 50'
                            required
                          />
                          <p className='text-xs text-gray-500 mt-1'>Rate per hour in USD</p>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Years of Experience *
                          </label>
                          <select
                            name='yearsOfExperience'
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            required>
                            <option value=''>Select experience level</option>
                            {yearsOfExperienceOptions.map((exp) => (
                              <option key={exp} value={exp}>
                                {exp}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Service Description *
                          </label>
                          <textarea
                            name='serviceDescription'
                            value={formData.serviceDescription}
                            onChange={handleInputChange}
                            rows='3'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='Describe your service in detail...'
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Website (Optional)
                          </label>
                          <input
                            type='url'
                            name='website'
                            value={formData.website}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='https://example.com'
                          />
                        </div>
                      </>
                    )}

                    {/* Category for seller */}
                    {role === "seller" && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Product Category *
                        </label>
                        <select
                          name='category'
                          value={formData.category}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          required>
                          <option value=''>Select category</option>
                          <option value='electronics'>Electronics</option>
                          <option value='fashion'>Fashion</option>
                          <option value='home-garden'>Home & Garden</option>
                          <option value='beauty'>Beauty</option>
                          <option value='sports'>Sports</option>
                          <option value='services'>Services</option>
                          <option value='other'>Other</option>
                        </select>
                      </div>
                    )}

                    {/* Location Details - For all roles */}
                    <div className='pt-4 border-t border-gray-200'>
                      <h5 className='text-lg font-semibold text-gray-800 mb-3'>Location Details</h5>
                      <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Country *
                            </label>
                            <input
                              type='text'
                              name='country'
                              value={formData.country}
                              onChange={handleInputChange}
                              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                              placeholder='e.g., Bangladesh'
                              required
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Region/State *
                            </label>
                            <input
                              type='text'
                              name='region'
                              value={formData.region}
                              onChange={handleInputChange}
                              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                              placeholder='e.g., Dhaka Division'
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            City *
                          </label>
                          <input
                            type='text'
                            name='city'
                            value={formData.city}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='e.g., Dhaka'
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Address (Optional)
                          </label>
                          <textarea
                            name='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            rows='2'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='Street, Building, Apartment number'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 3: Verification & Additional Details */}
              {currentStep === 3 && (
                <>
                  <div className='py-4 mb-4'>
                    <h4 className='text-xl font-semibold text-gray-800'>
                      Step 3: Verification & Additional Details
                    </h4>
                    <p className='text-[#9838E1]'>
                      {role === "buyer" ? "Complete your registration" : "Provide verification and additional details"}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {/* National ID - Only for seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          National ID / Tax ID *
                        </label>
                        <input
                          type='text'
                          name='nationalId'
                          value={formData.nationalId}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='Enter your ID number'
                          required
                        />
                      </div>
                    )}

                    {/* Business Logo - Only for seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Business Logo (Optional)
                        </label>
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#9838E1] transition'>
                          <input
                            type='file'
                            name='businessLogo'
                            onChange={handleFileChange}
                            className='hidden'
                            accept='image/*'
                            id='businessLogoInput'
                          />
                          <label htmlFor='businessLogoInput' className='cursor-pointer block'>
                            {formData.image ? (
                              <div className='flex flex-col items-center'>
                                <div className='w-32 h-32 mb-3 rounded-lg overflow-hidden border-2 border-gray-200'>
                                  <img
                                    src={formData.image}
                                    alt='Business Logo Preview'
                                    className='w-full h-full object-cover'
                                  />
                                </div>
                                <p className='text-sm text-green-600 font-medium'>
                                  Logo selected: {formData.businessLogo?.name}
                                </p>
                                <p className='text-xs text-gray-500 mt-1'>
                                  Click to change image
                                </p>
                              </div>
                            ) : (
                              <div className='text-gray-500'>
                                <svg className='w-8 h-8 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                                <p className='text-sm'>Click to upload logo (Max 2MB)</p>
                                <p className='text-xs text-gray-400 mt-1'>PNG, JPG, SVG up to 2MB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Service Images - Only for provider */}
                    {role === "provider" && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Service Images *
                          <span className='text-xs text-gray-500 ml-1'>(At least 1, max 10)</span>
                        </label>
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#9838E1] transition'>
                          <input
                            type='file'
                            multiple
                            onChange={handleServicesImageChange}
                            className='hidden'
                            accept='image/*'
                            id='servicesImageInput'
                          />
                          <label htmlFor='servicesImageInput' className='cursor-pointer block'>
                            <div className='text-center text-gray-500 mb-4'>
                              <svg className='w-8 h-8 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                              </svg>
                              <p className='text-sm'>Click to upload service images</p>
                              <p className='text-xs text-gray-400 mt-1'>Upload multiple images of your work (Max 10)</p>
                            </div>
                          </label>

                          {/* Preview uploaded images */}
                          {formData.servicesImage.length > 0 && (
                            <div className='grid grid-cols-3 gap-2 mt-4'>
                              {formData.servicesImage.map((img, index) => (
                                <div key={index} className='relative group'>
                                  <img
                                    src={img.preview}
                                    alt={`Service ${index + 1}`}
                                    className='w-full h-24 object-cover rounded-lg'
                                  />
                                  <button
                                    type='button'
                                    onClick={() => removeServiceImage(index)}
                                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity'
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                          Uploaded: {formData.servicesImage.length} images
                        </p>
                      </div>
                    )}

                    {/* Working Schedule - Only for provider */}
                    {/* {role === "provider" && (
                      <div className='pt-4 border-t border-gray-200'>
                        <h5 className='text-lg font-semibold text-gray-800 mb-3'>Working Schedule</h5>
                        
                        <div className='space-y-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              Working Days *
                            </label>
                            <div className='flex flex-wrap gap-2'>
                              {workingDaysOptions.map((day) => (
                                <button
                                  key={day.value}
                                  type='button'
                                  onClick={() => handleWorkingDaysChange(day.value)}
                                  className={`px-3 py-2 rounded-lg border ${
                                    formData.workingDays.includes(day.value)
                                      ? 'bg-[#9838E1] text-white border-[#9838E1]'
                                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#9838E1]'
                                  } transition-colors`}
                                >
                                  {day.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Working Hours Start *
                              </label>
                              <input
                                type='time'
                                name='workingHoursStart'
                                value={formData.workingHoursStart}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                                required
                              />
                            </div>

                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Working Hours End *
                              </label>
                              <input
                                type='time'
                                name='workingHoursEnd'
                                value={formData.workingHoursEnd}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Slot Duration (minutes) *
                            </label>
                            <select
                              name='slotDuration'
                              value={formData.slotDuration}
                              onChange={handleInputChange}
                              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                              required
                            >
                              <option value='15'>15 minutes</option>
                              <option value='30'>30 minutes</option>
                              <option value='45'>45 minutes</option>
                              <option value='60'>60 minutes</option>
                              <option value='90'>90 minutes</option>
                              <option value='120'>120 minutes</option>
                            </select>
                            <p className='text-xs text-gray-500 mt-1'>
                              Duration of each service slot
                            </p>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* Summary Preview */}
                    <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                      <h5 className='font-medium text-gray-700 mb-2'>
                        Registration Summary
                      </h5>
                      <div className='text-sm text-gray-600 space-y-1'>
                        <p>
                          <span className='font-medium'>Full Name:</span> {formData.firstName} {formData.lastName}
                        </p>
                        <p>
                          <span className='font-medium'>Email:</span> {formData.email}
                        </p>
                        <p>
                          <span className='font-medium'>Phone:</span> {formData.phone}
                        </p>
                        
                        {role !== "buyer" && (
                          <>
                            <p>
                              <span className='font-medium'>Business:</span> {formData.shopName}
                            </p>
                            {role === "provider" && (
                              <>
                                <p>
                                  <span className='font-medium'>Service:</span> {formData.serviceName}
                                </p>
                                <p>
                                  <span className='font-medium'>Hourly Rate:</span> ${formData.hourlyRate}/hr
                                </p>
                                <p>
                                  <span className='font-medium'>Service Area:</span> {formData.serviceArea}
                                </p>
                              </>
                            )}
                          </>
                        )}
                        
                        <p>
                          <span className='font-medium'>Location:</span> {formData.city}, {formData.region}, {formData.country}
                        </p>
                        
                        {role === "provider" && (
                          <>
                            <p>
                              <span className='font-medium'>Working Days:</span> {formData.workingDays.join(', ')}
                            </p>
                            <p>
                              <span className='font-medium'>Working Hours:</span> {formData.workingHoursStart} - {formData.workingHoursEnd}
                            </p>
                            <p>
                              <span className='font-medium'>Service Images:</span> {formData.servicesImage.length} uploaded
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className='flex gap-3 mt-8'>
                {currentStep > 1 && (
                  <button
                    type='button'
                    onClick={handlePrevStep}
                    className='flex-1 py-3 border border-[#9838E1] text-[#9838E1] rounded-lg font-medium hover:bg-[#9838E1] hover:text-white transition'>
                    Back
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type='button'
                    onClick={handleNextStep}
                    className={`flex-1 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90 transition ${
                      currentStep === 1 ? "flex-[2]" : "flex-1"
                    }`}>
                    {currentStep === 1
                      ? role === "buyer" 
                        ? "Next: Location Details" 
                        : role === "provider"
                        ? "Next: Service Details"
                        : "Next: Business Details"
                      : "Next: Verification"}
                  </button>
                ) : (
                  <button
                    type='submit'
                    disabled={userLoading || providerLoading}
                    className='flex-1 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90 transition disabled:opacity-50'>
                    {userLoading || providerLoading ? "Processing..." : "Complete Registration"}
                  </button>
                )}
              </div>
            </form>

            {/* Current Step Indicator */}
            <div className='mt-4 text-center text-sm text-gray-500'>
              Step {currentStep} of 3
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Registerpage;