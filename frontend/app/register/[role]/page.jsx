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
  
  // Language state - লগিন পেজের মতোই
  const [language, setLanguage] = useState('en'); // 'en' বা 'es'

  // লগিন পেজের মতোই ট্রান্সলেশন objects
  const translations = {
    en: {
      // Titles and Headers
      createAccount: "Create your {role} Account",
      roleSeller: "Seller",
      roleProvider: "Service Provider",
      roleBuyer: "Buyer",
      step1Title: "Step 1: Basic Information",
      step1Subtitle: "Let's start with your personal details",
      step2Title: "Step 2: {roleDetails}",
      step2Subtitle: "{roleSubtitle}",
      step3Title: "Step 3: Verification & Additional Details",
      step3Subtitle: "{verificationSubtitle}",
      
      // Form Labels
      firstName: "First Name *",
      lastName: "Last Name *",
      email: "Email *",
      phoneNumber: "Phone Number *",
      password: "Password * (min. 10 characters)",
      confirmPassword: "Confirm Password *",
      shopName: "Shop/Business Name *",
      serviceName: "Service Name *",
      serviceCategory: "Service Category *",
      serviceArea: "Service Area (City) *",
      serviceRadius: "Service Radius *",
      hourlyRate: "Hourly Rate ($) *",
      yearsOfExperience: "Years of Experience *",
      serviceDescription: "Service Description *",
      website: "Website (Optional)",
      category: "Product Category *",
      country: "Country *",
      region: "Region/State *",
      city: "City *",
      address: "Address (Optional)",
      nationalId: "National ID / Tax ID *",
      businessLogo: "Business Logo (Optional)",
      serviceImages: "Service Images *",
      workingSchedule: "Working Schedule",
      workingDays: "Working Days *",
      workingHoursStart: "Working Hours Start *",
      workingHoursEnd: "Working Hours End *",
      slotDuration: "Slot Duration (minutes) *",
      
      // Placeholders
      enterFirstName: "Enter first name",
      enterLastName: "Enter last name",
      emailPlaceholder: "you@example.com",
      phonePlaceholder: "+1 (555) 123-4567",
      passwordPlaceholder: "••••••••••",
      shopNamePlaceholder: "Enter your shop/business name",
      serviceNamePlaceholder: "e.g., Home Cleaning, Plumbing Service",
      serviceAreaPlaceholder: "e.g., Dhaka, Chittagong",
      hourlyRatePlaceholder: "e.g., 50",
      serviceDescriptionPlaceholder: "Describe your service in detail...",
      websitePlaceholder: "https://example.com",
      countryPlaceholder: "e.g., Bangladesh",
      regionPlaceholder: "e.g., Dhaka Division",
      cityPlaceholder: "e.g., Dhaka",
      addressPlaceholder: "Street, Building, Apartment number",
      nationalIdPlaceholder: "Enter your ID number",
      
      // Buttons
      back: "Back",
      next: "Next: {nextStep}",
      completeRegistration: "Complete Registration",
      processing: "Processing...",
      clickToUploadLogo: "Click to upload logo (Max 2MB)",
      clickToUploadImages: "Click to upload service images",
      
      // Messages
      passwordLengthMessage: "Password must be at least 10 characters long",
      ratePerHour: "Rate per hour in USD",
      uploadMultipleImages: "Upload multiple images of your work (Max 10)",
      uploadedImages: "Uploaded: {count} images",
      slotDurationMessage: "Duration of each service slot",
      registrationSummary: "Registration Summary",
      fullName: "Full Name:",
      business: "Business:",
      service: "Service:",
      hourlyRateLabel: "Hourly Rate:",
      serviceAreaLabel: "Service Area:",
      location: "Location:",
      workingDaysLabel: "Working Days:",
      workingHoursLabel: "Working Hours:",
      serviceImagesLabel: "Service Images:",
      
      // Step details
      buyerLocation: "Location Details",
      providerService: "Service Details",
      sellerBusiness: "Business Details",
      buyerLocationSubtitle: "Tell us where you're located",
      providerServiceSubtitle: "Tell us about your service",
      sellerBusinessSubtitle: "Tell us about your business",
      buyerVerification: "Complete your registration",
      sellerProviderVerification: "Provide verification and additional details"
    },
    es: {
      // Títulos y Encabezados
      createAccount: "Crear tu cuenta de {role}",
      roleSeller: "Vendedor",
      roleProvider: "Proveedor de Servicios",
      roleBuyer: "Comprador",
      step1Title: "Paso 1: Información Básica",
      step1Subtitle: "Comencemos con tus datos personales",
      step2Title: "Paso 2: {roleDetails}",
      step2Subtitle: "{roleSubtitle}",
      step3Title: "Paso 3: Verificación y Detalles Adicionales",
      step3Subtitle: "{verificationSubtitle}",
      
      // Etiquetas del Formulario
      firstName: "Nombre *",
      lastName: "Apellido *",
      email: "Correo Electrónico *",
      phoneNumber: "Número de Teléfono *",
      password: "Contraseña * (mín. 10 caracteres)",
      confirmPassword: "Confirmar Contraseña *",
      shopName: "Nombre del Negocio *",
      serviceName: "Nombre del Servicio *",
      serviceCategory: "Categoría del Servicio *",
      serviceArea: "Área de Servicio (Ciudad) *",
      serviceRadius: "Radio de Servicio *",
      hourlyRate: "Tarifa por Hora ($) *",
      yearsOfExperience: "Años de Experiencia *",
      serviceDescription: "Descripción del Servicio *",
      website: "Sitio Web (Opcional)",
      category: "Categoría del Producto *",
      country: "País *",
      region: "Región/Estado *",
      city: "Ciudad *",
      address: "Dirección (Opcional)",
      nationalId: "DNI / NIF *",
      businessLogo: "Logo del Negocio (Opcional)",
      serviceImages: "Imágenes del Servicio *",
      workingSchedule: "Horario de Trabajo",
      workingDays: "Días de Trabajo *",
      workingHoursStart: "Inicio del Horario *",
      workingHoursEnd: "Fin del Horario *",
      slotDuration: "Duración de la Cita (minutos) *",
      
      // Marcadores de Posición
      enterFirstName: "Ingresa tu nombre",
      enterLastName: "Ingresa tu apellido",
      emailPlaceholder: "tu@ejemplo.com",
      phonePlaceholder: "+1 (555) 123-4567",
      passwordPlaceholder: "••••••••••",
      shopNamePlaceholder: "Ingresa el nombre de tu negocio",
      serviceNamePlaceholder: "ej., Limpieza del Hogar, Servicio de Fontanería",
      serviceAreaPlaceholder: "ej., Dhaka, Chittagong",
      hourlyRatePlaceholder: "ej., 50",
      serviceDescriptionPlaceholder: "Describe tu servicio en detalle...",
      websitePlaceholder: "https://ejemplo.com",
      countryPlaceholder: "ej., Bangladesh",
      regionPlaceholder: "ej., División de Dhaka",
      cityPlaceholder: "ej., Dhaka",
      addressPlaceholder: "Calle, Edificio, Número de Apartamento",
      nationalIdPlaceholder: "Ingresa tu número de identificación",
      
      // Botones
      back: "Atrás",
      next: "Siguiente: {nextStep}",
      completeRegistration: "Completar Registro",
      processing: "Procesando...",
      clickToUploadLogo: "Haz clic para subir logo (Máx. 2MB)",
      clickToUploadImages: "Haz clic para subir imágenes del servicio",
      
      // Mensajes
      passwordLengthMessage: "La contraseña debe tener al menos 10 caracteres",
      ratePerHour: "Tarifa por hora en USD",
      uploadMultipleImages: "Sube múltiples imágenes de tu trabajo (Máx. 10)",
      uploadedImages: "Subidas: {count} imágenes",
      slotDurationMessage: "Duración de cada cita de servicio",
      registrationSummary: "Resumen del Registro",
      fullName: "Nombre Completo:",
      business: "Negocio:",
      service: "Servicio:",
      hourlyRateLabel: "Tarifa por Hora:",
      serviceAreaLabel: "Área de Servicio:",
      location: "Ubicación:",
      workingDaysLabel: "Días de Trabajo:",
      workingHoursLabel: "Horas de Trabajo:",
      serviceImagesLabel: "Imágenes del Servicio:",
      
      // Detalles de los Pasos
      buyerLocation: "Detalles de Ubicación",
      providerService: "Detalles del Servicio",
      sellerBusiness: "Detalles del Negocio",
      buyerLocationSubtitle: "Dinos dónde estás ubicado",
      providerServiceSubtitle: "Cuéntanos sobre tu servicio",
      sellerBusinessSubtitle: "Cuéntanos sobre tu negocio",
      buyerVerification: "Completa tu registro",
      sellerProviderVerification: "Proporciona verificación y detalles adicionales"
    }
  };

  // Get current translation
  const t = translations[language];

  // Helper function to replace placeholders
  const translate = (key, replacements = {}) => {
    let text = t[key] || key;
    Object.keys(replacements).forEach(replacementKey => {
      text = text.replace(`{${replacementKey}}`, replacements[replacementKey]);
    });
    return text;
  };

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

  // Working Days Options (unchanged)
  const workingDaysOptions = [
    { value: "Mon", label: language === 'es' ? "Lunes" : "Monday" },
    { value: "Tue", label: language === 'es' ? "Martes" : "Tuesday" },
    { value: "Wed", label: language === 'es' ? "Miércoles" : "Wednesday" },
    { value: "Thu", label: language === 'es' ? "Jueves" : "Thursday" },
    { value: "Fri", label: language === 'es' ? "Viernes" : "Friday" },
    { value: "Sat", label: language === 'es' ? "Sábado" : "Saturday" },
    { value: "Sun", label: language === 'es' ? "Domingo" : "Sunday" },
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
  const yearsOfExperienceOptions = language === 'es' ? [
    "Menos de 1 año",
    "1-2 años",
    "2-5 años",
    "5-10 años",
    "10+ años",
    "15+ años",
    "20+ años"
  ] : [
    "Less than 1 year",
    "1-2 years",
    "2-5 years",
    "5-10 years",
    "10+ years",
    "15+ years",
    "20+ years"
  ];

  // Get role display name
  const getRoleDisplayName = () => {
    if (role === "seller") return translate("roleSeller");
    if (role === "provider") return translate("roleProvider");
    if (role === "buyer") return translate("roleBuyer");
    return "";
  };

  // Get next step text
  const getNextStepText = () => {
    if (currentStep === 1) {
      if (role === "buyer") return translate("buyerLocation");
      if (role === "provider") return translate("providerService");
      if (role === "seller") return translate("sellerBusiness");
    } else if (currentStep === 2) {
      return language === 'es' ? "Verificación" : "Verification";
    }
    return "";
  };

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
      toast.error(language === 'es' ? "Por favor, completa todos los campos obligatorios" : "Please fill all required fields");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(language === 'es' ? "Por favor, ingresa un correo electrónico válido" : "Please enter a valid email address");
      return false;
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast.error(language === 'es' ? "Por favor, ingresa un número de teléfono válido" : "Please enter a valid phone number");
      return false;
    }
    
    if (formData.password.length < 10) {
      toast.error(language === 'es' ? "La contraseña debe tener al menos 10 caracteres" : "Password must be at least 10 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'es' ? "Las contraseñas no coinciden" : "Passwords do not match");
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    // For buyer, only country, region, and city are required
    if (role === "buyer") {
      if (!formData.country || !formData.region || !formData.city) {
        toast.error(language === 'es' ? "Por favor, ingresa tu país, región y ciudad" : "Please enter your country, region, and city");
        return false;
      }
      return true;
    }
    
    // For seller/provider, validate business/service details
    if (!formData.shopName) {
      toast.error(language === 'es' ? "Por favor, ingresa el nombre del negocio" : "Please enter shop/business name");
      return false;
    }

    if (role === "provider") {
      if (!formData.serviceName) {
        toast.error(language === 'es' ? "Por favor, ingresa el nombre del servicio" : "Please enter service name");
        return false;
      }

      if (!formData.serviceCategory) {
        toast.error(language === 'es' ? "Por favor, selecciona la categoría del servicio" : "Please select service category");
        return false;
      }

      if (!formData.serviceArea) {
        toast.error(language === 'es' ? "Por favor, ingresa el área de servicio" : "Please enter service area");
        return false;
      }

      if (!formData.serviceRedius) {
        toast.error(language === 'es' ? "Por favor, selecciona el radio de servicio" : "Please select service radius");
        return false;
      }

      if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
        toast.error(language === 'es' ? "Por favor, ingresa una tarifa por hora válida" : "Please enter a valid hourly rate");
        return false;
      }

      if (!formData.yearsOfExperience) {
        toast.error(language === 'es' ? "Por favor, selecciona los años de experiencia" : "Please select years of experience");
        return false;
      }

      if (!formData.serviceDescription) {
        toast.error(language === 'es' ? "Por favor, ingresa la descripción del servicio" : "Please enter service description");
        return false;
      }
    }

    // Location validation for all
    if (!formData.country || !formData.region || !formData.city) {
      toast.error(language === 'es' ? "Por favor, ingresa tu país, región y ciudad" : "Please enter your country, region, and city");
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    // Only require nationalId for seller/provider
    if ((role === "seller" || role === "provider") && !formData.nationalId) {
      toast.error(language === 'es' ? "Por favor, ingresa DNI/NIF" : "Please enter National ID/Tax ID");
      return false;
    }
    
    // For provider, require at least one service image
    if (role === "provider" && formData.servicesImage.length === 0) {
      toast.error(language === 'es' ? "Por favor, sube al menos una imagen del servicio" : "Please upload at least one service image");
      return false;
    }

    // Validate working hours
    if (role === "provider") {
      const startTime = formData.workingHoursStart;
      const endTime = formData.workingHoursEnd;
      
      if (startTime >= endTime) {
        toast.error(language === 'es' ? "La hora de finalización debe ser después de la hora de inicio" : "End time must be after start time");
        return false;
      }

      if (!formData.slotDuration || parseInt(formData.slotDuration) <= 0) {
        toast.error(language === 'es' ? "Por favor, ingresa una duración de cita válida" : "Please enter a valid slot duration");
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
          toast.loading(language === 'es' ? "Subiendo logo del negocio..." : "Uploading business logo...");
          const logoUrl = await uploadToImgBB(formData.businessLogo);
          finalData.image = logoUrl;
          finalData.businessLogo = logoUrl;
          toast.dismiss();
          toast.success(language === 'es' ? "¡Logo subido exitosamente!" : "Logo uploaded successfully!");
        } catch (error) {
          toast.error(language === 'es' ? "Error al subir el logo. Por favor, intenta de nuevo." : "Failed to upload logo. Please try again.");
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
            toast.loading(language === 'es' 
              ? `Subiendo ${formData.servicesImage.length} imágenes del servicio...` 
              : `Uploading ${formData.servicesImage.length} service images...`);
            const serviceImageUrls = [];
            
            for (const imageData of formData.servicesImage) {
              const imageUrl = await uploadToImgBB(imageData.file);
              serviceImageUrls.push(imageUrl);
            }
            
            finalData.servicesImage = serviceImageUrls;
            toast.dismiss();
            toast.success(language === 'es' ? "¡Imágenes del servicio subidas exitosamente!" : "Service images uploaded successfully!");
          } catch (error) {
            toast.error(language === 'es' ? "Error al subir imágenes del servicio" : "Failed to upload service images");
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
        throw new Error(response.error.data?.message || (language === 'es' ? "Registro fallido" : "Registration failed"));
      }

      toast.success(language === 'es' ? "¡Registro exitoso!" : "Registration Successful!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

      
       window.location.href = "/login";
    } catch (error) {
      toast.error(error.message || (language === 'es' ? "Registro fallido. Por favor, intenta de nuevo." : "Registration failed. Please try again."));
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
            {/* Language Switcher - লগিন পেজের মতোই */}
            <div className='flex justify-between items-center mb-4'>
              <Image
                src={logo}
                width={150}
                height={60}
                alt='Cresify Logo'
                className='mb-2'
              />
              <div className='inline-flex rounded-lg border border-gray-200 p-1'>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-sm rounded-md transition ${language === 'en' ? 'bg-[#9838E1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-3 py-1 text-sm rounded-md transition ${language === 'es' ? 'bg-[#9838E1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Español
                </button>
              </div>
            </div>

            <h2 className='text-center text-2xl font-bold mb-2 text-gray-800'>
              {translate("createAccount", { role: getRoleDisplayName() })}
            </h2>
            
            <p className='text-center text-gray-500 mb-6'>
              {currentStep === 1 && translate("step1Subtitle")}
              {currentStep === 2 && (
                role === "buyer" 
                  ? translate("buyerLocationSubtitle")
                  : role === "provider"
                  ? translate("providerServiceSubtitle")
                  : translate("sellerBusinessSubtitle")
              )}
              {currentStep === 3 && (
                role === "buyer"
                  ? translate("buyerVerification")
                  : translate("sellerProviderVerification")
              )}
            </p>

            {/* Progress Bar */}
            {renderProgressDots()}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Basic Information (Same for all roles) */}
              {currentStep === 1 && (
                <>
                  <div className='py-4 mb-4'>
                    <h4 className='text-xl font-semibold text-gray-800'>
                      {translate("step1Title")}
                    </h4>
                    <p className='text-[#9838E1]'>
                      {translate("step1Subtitle")}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          {translate("firstName")}
                        </label>
                        <input
                          type='text'
                          name='firstName'
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder={translate("enterFirstName")}
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          {translate("lastName")}
                        </label>
                        <input
                          type='text'
                          name='lastName'
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder={translate("enterLastName")}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {translate("email")}
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder={translate("emailPlaceholder")}
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {translate("phoneNumber")}
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder={translate("phonePlaceholder")}
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {translate("password")}
                      </label>
                      <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder={translate("passwordPlaceholder")}
                        minLength={10}
                        required
                      />
                      <p className='text-xs text-gray-500 mt-1'>
                        {translate("passwordLengthMessage")}
                      </p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {translate("confirmPassword")}
                      </label>
                      <input
                        type='password'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                        placeholder={translate("passwordPlaceholder")}
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
                      {translate("step2Title", { 
                        roleDetails: role === "buyer" ? translate("buyerLocation") : 
                                     role === "provider" ? translate("providerService") : 
                                     translate("sellerBusiness") 
                      })}
                    </h4>
                    <p className='text-[#9838E1]'>
                      {translate("step2Subtitle", {
                        roleSubtitle: role === "buyer" ? translate("buyerLocationSubtitle") : 
                                     role === "provider" ? translate("providerServiceSubtitle") : 
                                     translate("sellerBusinessSubtitle")
                      })}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {/* Business/Shop Name - For seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          {translate("shopName")}
                        </label>
                        <input
                          type='text'
                          name='shopName'
                          value={formData.shopName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder={translate("shopNamePlaceholder")}
                          required
                        />
                      </div>
                    )}

                    {/* Service Details - Only for provider */}
                    {role === "provider" && (
                      <>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("serviceName")}
                          </label>
                          <input
                            type='text'
                            name='serviceName'
                            value={formData.serviceName}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder={translate("serviceNamePlaceholder")}
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("serviceCategory")}
                          </label>
                          <select
                            name='serviceCategory'
                            value={formData.serviceCategory}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            required>
                            <option value=''>{language === 'es' ? "Seleccionar categoría" : "Select category"}</option>
                            {serviceCategories.map((category) => (
                              <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("serviceArea")}
                          </label>
                          <input
                            type='text'
                            name='serviceArea'
                            value={formData.serviceArea}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder={translate("serviceAreaPlaceholder")}
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("serviceRadius")}
                          </label>
                          <select
                            name='serviceRedius'
                            value={formData.serviceRedius}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            required>
                            <option value=''>{language === 'es' ? "Seleccionar radio de servicio" : "Select service radius"}</option>
                            {serviceRadiusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("hourlyRate")}
                          </label>
                          <input
                            type='number'
                            name='hourlyRate'
                            value={formData.hourlyRate}
                            onChange={handleInputChange}
                            min='1'
                            step='0.01'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder={translate("hourlyRatePlaceholder")}
                            required
                          />
                          <p className='text-xs text-gray-500 mt-1'>
                            {translate("ratePerHour")}
                          </p>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("yearsOfExperience")}
                          </label>
                          <select
                            name='yearsOfExperience'
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            required>
                            <option value=''>{language === 'es' ? "Seleccionar nivel de experiencia" : "Select experience level"}</option>
                            {yearsOfExperienceOptions.map((exp) => (
                              <option key={exp} value={exp}>
                                {exp}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("serviceDescription")}
                          </label>
                          <textarea
                            name='serviceDescription'
                            value={formData.serviceDescription}
                            onChange={handleInputChange}
                            rows='3'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder={translate("serviceDescriptionPlaceholder")}
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("website")}
                          </label>
                          <input
                            type='url'
                            name='website'
                            value={formData.website}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder={translate("websitePlaceholder")}
                          />
                        </div>
                      </>
                    )}

                    {/* Category for seller */}
                    {role === "seller" && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          {translate("category")}
                        </label>
                        <select
                          name='category'
                          value={formData.category}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          required>
                          <option value=''>{language === 'es' ? "Seleccionar categoría" : "Select category"}</option>
                          <option value='electronics'>{language === 'es' ? 'Electrónica' : 'Electronics'}</option>
                          <option value='fashion'>{language === 'es' ? 'Moda' : 'Fashion'}</option>
                          <option value='home-garden'>{language === 'es' ? 'Hogar y Jardín' : 'Home & Garden'}</option>
                          <option value='beauty'>{language === 'es' ? 'Belleza' : 'Beauty'}</option>
                          <option value='sports'>{language === 'es' ? 'Deportes' : 'Sports'}</option>
                          <option value='services'>{language === 'es' ? 'Servicios' : 'Services'}</option>
                          <option value='other'>{language === 'es' ? 'Otro' : 'Other'}</option>
                        </select>
                      </div>
                    )}

                    {/* Location Details - For all roles */}
                    <div className='pt-4 border-t border-gray-200'>
                      <h5 className='text-lg font-semibold text-gray-800 mb-3'>
                        {language === 'es' ? 'Detalles de Ubicación' : 'Location Details'}
                      </h5>
                      <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              {translate("country")}
                            </label>
                            <input
                              type='text'
                              name='country'
                              value={formData.country}
                              onChange={handleInputChange}
                              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                              placeholder={translate("countryPlaceholder")}
                              required
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              {translate("region")}
                            </label>
                            <input
                              type='text'
                              name='region'
                              value={formData.region}
                              onChange={handleInputChange}
                              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                              placeholder={translate("regionPlaceholder")}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("city")}
                          </label>
                          <input
                            type='text'
                            name='city'
                            value={formData.city}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder={translate("cityPlaceholder")}
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {translate("address")}
                          </label>
                          <textarea
                            name='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            rows='2'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                            placeholder={translate("addressPlaceholder")}
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
                      {translate("step3Title")}
                    </h4>
                    <p className='text-[#9838E1]'>
                      {translate("step3Subtitle", {
                        verificationSubtitle: role === "buyer" ? 
                          translate("buyerVerification") : 
                          translate("sellerProviderVerification")
                      })}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {/* National ID - Only for seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          {translate("nationalId")}
                        </label>
                        <input
                          type='text'
                          name='nationalId'
                          value={formData.nationalId}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                          placeholder={translate("nationalIdPlaceholder")}
                          required
                        />
                      </div>
                    )}

                    {/* Business Logo - Only for seller/provider */}
                    {(role === "seller" || role === "provider") && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          {translate("businessLogo")}
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
                                  {language === 'es' ? 'Logo seleccionado:' : 'Logo selected:'} {formData.businessLogo?.name}
                                </p>
                                <p className='text-xs text-gray-500 mt-1'>
                                  {language === 'es' ? 'Haz clic para cambiar la imagen' : 'Click to change image'}
                                </p>
                              </div>
                            ) : (
                              <div className='text-gray-500'>
                                <svg className='w-8 h-8 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                                <p className='text-sm'>{translate("clickToUploadLogo")}</p>
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
                          {translate("serviceImages")}
                          <span className='text-xs text-gray-500 ml-1'>({language === 'es' ? 'Mín. 1, máx. 10' : 'At least 1, max 10'})</span>
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
                              <p className='text-sm'>{translate("clickToUploadImages")}</p>
                              <p className='text-xs text-gray-400 mt-1'>
                                {translate("uploadMultipleImages")}
                              </p>
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
                          {translate("uploadedImages", { count: formData.servicesImage.length })}
                        </p>
                      </div>
                    )}

                    {/* Working Schedule - Only for provider */}
                    {/* {role === "provider" && (
                      <div className='pt-4 border-t border-gray-200'>
                        <h5 className='text-lg font-semibold text-gray-800 mb-3'>
                          {translate("workingSchedule")}
                        </h5>
                        
                        <div className='space-y-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              {translate("workingDays")}
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
                                {translate("workingHoursStart")}
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
                                {translate("workingHoursEnd")}
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
                              {translate("slotDuration")}
                            </label>
                            <select
                              name='slotDuration'
                              value={formData.slotDuration}
                              onChange={handleInputChange}
                              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9838E1] focus:border-transparent outline-none transition'
                              required
                            >
                              <option value='15'>15 {language === 'es' ? 'minutos' : 'minutes'}</option>
                              <option value='30'>30 {language === 'es' ? 'minutos' : 'minutes'}</option>
                              <option value='45'>45 {language === 'es' ? 'minutos' : 'minutes'}</option>
                              <option value='60'>60 {language === 'es' ? 'minutos' : 'minutes'}</option>
                              <option value='90'>90 {language === 'es' ? 'minutos' : 'minutes'}</option>
                              <option value='120'>120 {language === 'es' ? 'minutos' : 'minutes'}</option>
                            </select>
                            <p className='text-xs text-gray-500 mt-1'>
                              {translate("slotDurationMessage")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* Summary Preview */}
                    <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                      <h5 className='font-medium text-gray-700 mb-2'>
                        {translate("registrationSummary")}
                      </h5>
                      <div className='text-sm text-gray-600 space-y-1'>
                        <p>
                          <span className='font-medium'>{translate("fullName")}</span> {formData.firstName} {formData.lastName}
                        </p>
                        <p>
                          <span className='font-medium'>{language === 'es' ? 'Correo:' : 'Email:'}</span> {formData.email}
                        </p>
                        <p>
                          <span className='font-medium'>{language === 'es' ? 'Teléfono:' : 'Phone:'}</span> {formData.phone}
                        </p>
                        
                        {role !== "buyer" && (
                          <>
                            <p>
                              <span className='font-medium'>{translate("business")}</span> {formData.shopName}
                            </p>
                            {role === "provider" && (
                              <>
                                <p>
                                  <span className='font-medium'>{translate("service")}</span> {formData.serviceName}
                                </p>
                                <p>
                                  <span className='font-medium'>{translate("hourlyRateLabel")}</span> ${formData.hourlyRate}/hr
                                </p>
                                <p>
                                  <span className='font-medium'>{translate("serviceAreaLabel")}</span> {formData.serviceArea}
                                </p>
                              </>
                            )}
                          </>
                        )}
                        
                        <p>
                          <span className='font-medium'>{translate("location")}</span> {formData.city}, {formData.region}, {formData.country}
                        </p>
                        
                        {role === "provider" && (
                          <>
                            <p>
                              <span className='font-medium'>{translate("workingDaysLabel")}</span> {formData.workingDays.join(', ')}
                            </p>
                            <p>
                              <span className='font-medium'>{translate("workingHoursLabel")}</span> {formData.workingHoursStart} - {formData.workingHoursEnd}
                            </p>
                            <p>
                              <span className='font-medium'>{translate("serviceImagesLabel")}</span> {formData.servicesImage.length} {language === 'es' ? 'subidas' : 'uploaded'}
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
                    {translate("back")}
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type='button'
                    onClick={handleNextStep}
                    className={`flex-1 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90 transition ${
                      currentStep === 1 ? "flex-[2]" : "flex-1"
                    }`}>
                    {translate("next", { nextStep: getNextStepText() })}
                  </button>
                ) : (
                  <button
                    type='submit'
                    disabled={userLoading || providerLoading}
                    className='flex-1 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] hover:opacity-90 transition disabled:opacity-50'>
                    {userLoading || providerLoading ? translate("processing") : translate("completeRegistration")}
                  </button>
                )}
              </div>
            </form>

            {/* Current Step Indicator */}
            <div className='mt-4 text-center text-sm text-gray-500'>
              {language === 'es' ? 'Paso' : 'Step'} {currentStep} {language === 'es' ? 'de' : 'of'} 3
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Registerpage;