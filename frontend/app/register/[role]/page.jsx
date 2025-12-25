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

    // Step 2: Business Details (Only for seller/provider)
    shopName: "",
    category: "",
    country: "",          // Input field
    region: "",           // Input field  
    city: "",             // Input field
    address: "",          // Input field (optional)
    businessLogo: "",
    nationalId: "",
    registrationDate: "",
    image: "",

    // Step 3: Verification
    nationalId: "",
    businessLogo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target.result, // base64 dataURL
          businessLogo: file,
        }));
      };
      reader.readAsDataURL(file);
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
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // Validate phone (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    
    // Validate password length
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
    
    // For seller/provider, business details + location are required
    if (!formData.shopName || !formData.category || !formData.country || !formData.region || !formData.city) {
      toast.error("Please fill all required business and location details");
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
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        console.log("Step 1 Data:", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        console.log("Step 2 Data:", {
          shopName: formData.shopName,
          category: formData.category,
          country: formData.country,
          region: formData.region,
          city: formData.city,
          address: formData.address,
        });
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep3()) {
      // Combine first and last name into fullName
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Prepare final data
      const finalData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: fullName, // Combined full name
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

      // Add business details only for seller/provider
      if (role === "seller" || role === "provider") {
        finalData.shopName = formData.shopName;
        finalData.category = formData.category;
        finalData.nationalId = formData.nationalId;
        
        // Add image if exists
        if (formData.image) {
          finalData.image = formData.image;
          finalData.businessLogo = formData.businessLogo;
        }
      }

      try {
        let response;
        if (role === "provider") {
          response = await createServiceProvider(finalData);
        } else if (role === "seller") {
          response = await await createUser(finalData); // Assuming seller also uses service provider endpoint
        } else {
          response = await createUser(finalData);
        }

        toast.success("Registration Successful!");
        e.target.reset();
        window.location.href = "/login";
      } catch (error) {
        toast.error(error?.data?.message || "Registration failed. Please try again.");
      }
    }
  };

  // Render progress dots
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
                        <label
                          htmlFor='firstName'
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          First Name *
                        </label>
                        <input
                          type='text'
                          id='firstName'
                          name='firstName'
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='Enter first name'
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor='lastName'
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          Last Name *
                        </label>
                        <input
                          type='text'
                          id='lastName'
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
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Email *
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder='you@example.com'
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='phone'
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Phone Number *
                      </label>
                        <input
                          type='tel'
                          id='phone'
                          name='phone'
                          value={formData.phone}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='+1 (555) 123-4567'
                          required
                        />
                    </div>

                    <div>
                      <label
                        htmlFor='password'
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Password * (min. 10 characters)
                      </label>
                      <input
                        type='password'
                        id='password'
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
                      <label
                        htmlFor='confirmPassword'
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Confirm Password *
                      </label>
                      <input
                        type='password'
                        id='confirmPassword'
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

              {/* STEP 2: Business Details or Location (Different per role) */}
              {currentStep === 2 && (
                <>
                  <div className='py-4 mb-4'>
                    <h4 className='text-xl font-semibold text-gray-800'>
                      Step 2: {role === "buyer" ? "Location Details" : "Business Details"}
                    </h4>
                    <p className='text-[#9838E1]'>
                      {role === "buyer" ? "Tell us where you're located" : "Tell us more about your business"}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {/* Business Details - Only for seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <>
                        <div>
                          <label
                            htmlFor='shopName'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Shop/Business Name *
                          </label>
                          <input
                            type='text'
                            id='shopName'
                            name='shopName'
                            value={formData.shopName}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='Enter your shop name'
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor='category'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Product/Service Category *
                          </label>
                          <select
                            id='category'
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
                      </>
                    )}

                    {/* Location Details - For all roles (ALL INPUT FIELDS) */}
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label
                            htmlFor='country'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Country *
                          </label>
                          <input
                            type='text'
                            id='country'
                            name='country'
                            value={formData.country}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='e.g., United States'
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor='region'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Region/State *
                          </label>
                          <input
                            type='text'
                            id='region'
                            name='region'
                            value={formData.region}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder='e.g., California'
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor='city'
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          City *
                        </label>
                        <input
                          type='text'
                          id='city'
                          name='city'
                          value={formData.city}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='e.g., Los Angeles'
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor='address'
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          Address (Optional)
                        </label>
                        <textarea
                          id='address'
                          name='address'
                          value={formData.address}
                          onChange={handleInputChange}
                          rows='2'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder='Street, Building, Apartment number'
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                          Only the country, region, and city are required
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 3: Verification (Different per role) */}
              {currentStep === 3 && (
                <>
                  <div className='py-4 mb-4'>
                    <h4 className='text-xl font-semibold text-gray-800'>
                      Step 3: Verification
                    </h4>
                    <p className='text-[#9838E1]'>
                      {role === "buyer" ? "Complete your registration" : "Provide your verification details"}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {/* National ID - Only for seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <div>
                        <label
                          htmlFor='nationalId'
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          National ID / Tax ID *
                        </label>
                        <input
                          type='text'
                          id='nationalId'
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
                        <label
                          htmlFor='businessLogo'
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          Business Logo (Optional)
                        </label>
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#9838E1] transition'>
                          <input
                            type='file'
                            id='businessLogo'
                            name='businessLogo'
                            onChange={handleFileChange}
                            className='hidden'
                            accept='image/*'
                          />
                          <label
                            htmlFor='businessLogo'
                            className='cursor-pointer block'>
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
                                <svg
                                  className='w-8 h-8 mx-auto mb-2'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'></path>
                                </svg>
                                <p className='text-sm'>
                                  Click to upload logo (Max 2MB)
                                </p>
                                <p className='text-xs text-gray-400 mt-1'>
                                  PNG, JPG, SVG up to 2MB
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Summary Preview */}
                    <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                      <h5 className='font-medium text-gray-700 mb-2'>
                        Registration Summary
                      </h5>
                      <div className='text-sm text-gray-600 space-y-1'>
                        <p>
                          <span className='font-medium'>Full Name:</span>{" "}
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>
                          <span className='font-medium'>Email:</span>{" "}
                          {formData.email}
                        </p>
                        {role !== "buyer" && (
                          <>
                            <p>
                              <span className='font-medium'>Business:</span>{" "}
                              {formData.shopName}
                            </p>
                            <p>
                              <span className='font-medium'>Category:</span>{" "}
                              {formData.category}
                            </p>
                          </>
                        )}
                        <p>
                          <span className='font-medium'>Location:</span>{" "}
                          {formData.city}, {formData.region}, {formData.country}
                        </p>
                        {formData.address && (
                          <p>
                            <span className='font-medium'>Address:</span>{" "}
                            {formData.address}
                          </p>
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