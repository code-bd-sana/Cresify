"use client";
import { useCreateUserMutation } from "@/feature/UserApi";
import logo from "@/public/logo.png";
import Image from "next/image";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const RegisterAdmin = () => {
  const { t } = useTranslation("adminRegistration");
  const [createUser, { isLoading: userLoading }] = useCreateUserMutation();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Prepare ONLY email and password for API call
    const adminData = {
      email: formData.email,
      password: formData.password,
      role: "admin",
    };

    console.log("📤 Sending API Request with data:", adminData);

    try {
      // Show loading toast
      toast.loading("Creating admin account...");
      
      // Make API call
      const response = await createUser(adminData);
      
      console.log("📥 API Response Received:", response);

      // Check for errors
      if (response.error) {
        console.error("❌ API Error Details:", response.error);
        console.error("❌ Error Data:", response.error.data);
        console.error("❌ Error Status:", response.error.status);
        
        let errorMessage = "Registration failed";
        
        if (response.error.data) {
          if (response.error.data.message) {
            errorMessage = response.error.data.message;
          } else if (response.error.data.error) {
            errorMessage = response.error.data.error;
          } else if (typeof response.error.data === 'string') {
            errorMessage = response.error.data;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Check for success response
      if (response.data) {
        console.log("✅ API Success Response Data:", response.data);
        
        toast.success("Admin account created successfully!");
        
        // Clear form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });

        
      } else {
        console.warn("⚠️ No data in response:", response);
        throw new Error("No response data received");
      }
      
    } catch (error) {
      console.error("🔥 Registration Error:", error);
      
      // Handle specific error cases
      let errorMessage = error.message || "An error occurred";
      
      if (errorMessage.includes("already exists") || 
          errorMessage.includes("duplicate") || 
          errorMessage.includes("Email already")) {
        toast.error("This email is already registered");
      } else if (errorMessage.includes("network") || 
                errorMessage.includes("Network") || 
                errorMessage.includes("fetch")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
      
      <div className="absolute top-0 left-0 w-full p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Image
            src={logo}
            width={150}
            height={50}
            alt="Cresify Logo"
            className="h-auto"
          />
          <a
            href="/login"
            className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>

      <div className="w-full max-w-md mt-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-[#9838E1] to-[#F68E44] p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Admin Account
            </h1>
            <p className="text-gray-100 text-sm">
              Register a new system administrator
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none ${
                    validationErrors.email 
                      ? "border-red-300 bg-red-50" 
                      : "border-gray-300"
                  }`}
                  placeholder="admin@example.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password * (min. 6 characters)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none ${
                    validationErrors.password 
                      ? "border-red-300 bg-red-50" 
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none ${
                    validationErrors.confirmPassword 
                      ? "border-red-300 bg-red-50" 
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={userLoading}
                className="w-full bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {userLoading ? "Creating Account..." : "Create Admin Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => console.log("Form Data:", formData)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Debug: Log Form Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;