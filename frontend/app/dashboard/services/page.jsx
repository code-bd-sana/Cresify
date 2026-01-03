"use client";

import { useState } from "react";
import {
  useGetAllServiceProvidersQuery,
  useUpdateProviderStatusMutation,
} from "@/feature/UserApi";
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  Building,
  Shield,
  PhoneCall,
  Globe,
  Briefcase,
  Award,
  TrendingUp,
  TrendingDown,
  Package,
  Home,
  Settings,
  MessageSquare,
  Bell,
  ShoppingBag,
  CreditCard,
  Truck,
  Coffee,
  Sparkles,
  Zap,
  Target,
  Heart,
  ThumbsUp,
  Award as AwardIcon,
  Crown,
  BadgeCheck,
  Shield as ShieldIcon,
  Check,
  X,
  Loader2,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ServicesPage = () => {
  const { t } = useTranslation("admin");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    format: "csv",
    include: "filtered",
    columns: "all",
  });
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError, error } = useGetAllServiceProvidersQuery({
    page,
    limit,
  });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateProviderStatusMutation();

  const providers = data?.data || [];
  const pagination = data?.pagination || {};

  if (isError) {
    console.error("Error fetching providers:", error);
  }

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.phoneNumber?.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" || provider.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || provider.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    const statusMap = {
      active: t("serviceProviders.status.active"),
      pending: t("serviceProviders.status.pending"),
      suspend: t("serviceProviders.status.suspend"),
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspend":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} className='text-green-600' />;
      case "pending":
        return <AlertCircle size={16} className='text-yellow-600' />;
      case "suspend":
        return <XCircle size={16} className='text-red-600' />;
      default:
        return <AlertCircle size={16} className='text-gray-600' />;
    }
  };

  // Get category display text
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      all: t("serviceProviders.filters.allCategories"),
      "home-garden": t("serviceProviders.filters.homeGarden"),
      electronics: t("serviceProviders.filters.electronics"),
      services: t("serviceProviders.filters.services"),
      sports: t("serviceProviders.filters.sports"),
      other: t("serviceProviders.filters.other"),
    };
    return categoryMap[category] || category;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "home-garden":
        return <Home size={16} className='text-blue-500' />;
      case "electronics":
        return <Package size={16} className='text-purple-500' />;
      case "services":
        return <Settings size={16} className='text-orange-500' />;
      case "sports":
        return <Target size={16} className='text-green-500' />;
      case "other":
        return <Briefcase size={16} className='text-gray-500' />;
      default:
        return <Briefcase size={16} className='text-gray-400' />;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case "home-garden":
        return "bg-blue-100 text-blue-800";
      case "electronics":
        return "bg-purple-100 text-purple-800";
      case "services":
        return "bg-orange-100 text-orange-800";
      case "sports":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle view details
  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setIsDetailModalOpen(true);
  };

  // Handle status update
  const handleStatusClick = (provider, status) => {
    setStatusToUpdate({
      id: provider._id,
      name: provider.name,
      currentStatus: provider.status,
      newStatus: status,
    });
    setIsStatusModalOpen(true);
  };

  // Confirm status update
  const handleConfirmStatusUpdate = async () => {
    if (!statusToUpdate) return;

    try {
      await updateStatus({
        id: statusToUpdate.id,
        status: statusToUpdate.newStatus,
      }).unwrap();

      // Close modal and reset
      setIsStatusModalOpen(false);
      setStatusToUpdate(null);

      // Show success message
      alert(
        t("serviceProviders.notifications.statusUpdated", {
          status: getStatusDisplay(statusToUpdate.newStatus),
        })
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert(t("serviceProviders.notifications.statusUpdateFailed"));
    }
  };

  // Calculate stats
  const activeCount = providers.filter((p) => p.status === "active").length;
  const pendingCount = providers.filter((p) => p.status === "pending").length;
  const suspendedCount = providers.filter((p) => p.status === "suspend").length;
  const totalProviders = pagination.total || 0;
  const activePercentage =
    totalProviders > 0 ? Math.round((activeCount / totalProviders) * 100) : 0;

  // Export to CSV function
  const exportToCSV = () => {
    setIsExporting(true);

    try {
      // Get providers to export based on selection
      let providersToExport = [];
      switch (exportOptions.include) {
        case "all":
          providersToExport = providers;
          break;
        case "filtered":
          providersToExport = filteredProviders;
          break;
        default:
          providersToExport = filteredProviders;
      }

      // Define columns based on selection
      let columns = [];
      switch (exportOptions.columns) {
        case "all":
          columns = [
            "ID",
            "Name",
            "Email",
            "Phone",
            "Shop Name",
            "Service Name",
            "Category",
            "Status",
            "Hourly Rate",
            "Service Area",
            "Address",
            "Registration Date",
            "Created At",
          ];
          break;
        case "basic":
          columns = ["ID", "Name", "Email", "Phone", "Status"];
          break;
        case "contact":
          columns = ["Name", "Email", "Phone", "Address", "Shop Name"];
          break;
        case "service":
          columns = [
            "Name",
            "Service Name",
            "Category",
            "Hourly Rate",
            "Service Area",
          ];
          break;
        case "status":
          columns = ["Name", "Email", "Status", "Registration Date"];
          break;
        default:
          columns = ["ID", "Name", "Email", "Phone", "Status"];
      }

      // Create CSV content
      const csvRows = [];

      // Add header row
      csvRows.push(columns.join(","));

      // Add data rows
      providersToExport.forEach((provider) => {
        const row = columns.map((column) => {
          switch (column) {
            case "ID":
              return provider._id || "";
            case "Name":
              return `"${provider.name || ""}"`;
            case "Email":
              return provider.email || "";
            case "Phone":
              return provider.phoneNumber || "";
            case "Shop Name":
              return `"${provider.shopName || ""}"`;
            case "Service Name":
              return `"${provider.serviceName || ""}"`;
            case "Category":
              return getCategoryDisplay(provider.category);
            case "Status":
              return getStatusDisplay(provider.status);
            case "Hourly Rate":
              return provider.hourlyRate || "0";
            case "Service Area":
              return provider.serviceArea || "";
            case "Address":
              return `"${provider.address || ""}"`;
            case "Registration Date":
              return formatDate(provider.registrationDate);
            case "Created At":
              return formatDate(provider.createdAt);
            default:
              return "";
          }
        });
        csvRows.push(row.join(","));
      });

      // Create CSV blob
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `service-providers-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      alert(t("serviceProviders.notifications.exportStarted"));
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      alert(t("serviceProviders.notifications.exportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  // Export to PDF function (simplified - would need proper PDF generation library)
  const exportToPDF = () => {
    setIsExporting(true);
    alert(
      "PDF export feature would be implemented with a PDF generation library like jsPDF"
    );
    setIsExporting(false);
    setIsExportModalOpen(false);
  };

  // Handle export
  const handleExport = () => {
    if (exportOptions.format === "csv") {
      exportToCSV();
    } else if (exportOptions.format === "pdf") {
      exportToPDF();
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>
            {t("serviceProviders.loading.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4'>
            <XCircle size={24} className='text-red-600' />
          </div>
          <h3 className='text-lg font-semibold text-gray-800'>
            {t("serviceProviders.loading.error.title")}
          </h3>
          <p className='text-gray-600 mt-2'>
            {t("serviceProviders.loading.error.message")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
            {t("serviceProviders.actions.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
              {t("serviceProviders.title")}
            </h1>
            <p className='text-gray-600 mt-2'>
              {t("serviceProviders.subtitle")}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className='flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition shadow-sm'>
              <Download size={18} />
              {t("serviceProviders.actions.export")}
            </button>
            <button
              onClick={handlePrint}
              className='flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition shadow-sm'>
              <Printer size={18} />
              {t("serviceProviders.actions.print")}
            </button>
            <button className='flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition'>
              <Users size={18} />
              {t("serviceProviders.actions.addProvider")}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {/* Total Providers */}
        <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("serviceProviders.stats.totalProviders")}
              </p>
              <p className='text-3xl font-bold text-gray-800 mt-1'>
                {totalProviders}
              </p>
            </div>
            <div className='h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center'>
              <Users size={28} className='text-blue-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-green-600'>
              <TrendingUp size={14} />
              <span>{t("serviceProviders.stats.fromLastMonth")}</span>
            </div>
          </div>
        </div>

        {/* Active Providers */}
        <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("serviceProviders.stats.active")}
              </p>
              <p className='text-3xl font-bold text-gray-800 mt-1'>
                {activeCount}
              </p>
            </div>
            <div className='h-14 w-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center'>
              <CheckCircle size={28} className='text-green-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-green-600'>
              <span>
                {t("serviceProviders.stats.ofTotal", {
                  percentage: activePercentage,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("serviceProviders.stats.pending")}
              </p>
              <p className='text-3xl font-bold text-gray-800 mt-1'>
                {pendingCount}
              </p>
            </div>
            <div className='h-14 w-14 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center'>
              <AlertCircle size={28} className='text-yellow-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-yellow-600'>
              <span>{t("serviceProviders.stats.requiresAttention")}</span>
            </div>
          </div>
        </div>

        {/* Suspended */}
        <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>
                {t("serviceProviders.stats.suspended")}
              </p>
              <p className='text-3xl font-bold text-gray-800 mt-1'>
                {suspendedCount}
              </p>
            </div>
            <div className='h-14 w-14 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center'>
              <XCircle size={28} className='text-red-600' />
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center gap-2 text-sm text-red-600'>
              <TrendingDown size={14} />
              <span>{t("serviceProviders.stats.needsReview")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search Bar */}
          <div className='flex-1'>
            <div className='relative'>
              <Search
                className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder={t("serviceProviders.actions.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'
              />
            </div>
          </div>

          {/* Filters */}
          <div className='flex flex-wrap gap-3'>
            {/* Category Filter */}
            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='appearance-none bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'>
                <option value='all'>
                  {t("serviceProviders.filters.allCategories")}
                </option>
                <option value='home-garden'>
                  {t("serviceProviders.filters.homeGarden")}
                </option>
                <option value='electronics'>
                  {t("serviceProviders.filters.electronics")}
                </option>
                <option value='services'>
                  {t("serviceProviders.filters.services")}
                </option>
                <option value='sports'>
                  {t("serviceProviders.filters.sports")}
                </option>
                <option value='other'>
                  {t("serviceProviders.filters.other")}
                </option>
              </select>
              <Filter
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                size={20}
              />
            </div>

            {/* Status Filter */}
            <div className='relative'>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='appearance-none bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'>
                <option value='all'>
                  {t("serviceProviders.filters.allStatus")}
                </option>
                <option value='active'>
                  {t("serviceProviders.filters.active")}
                </option>
                <option value='pending'>
                  {t("serviceProviders.filters.pending")}
                </option>
                <option value='suspend'>
                  {t("serviceProviders.filters.suspend")}
                </option>
              </select>
              <Shield
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                size={20}
              />
            </div>

            {/* Items Per Page */}
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className='bg-white border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'>
              <option value='5'>
                5 {t("serviceProviders.actions.perPage")}
              </option>
              <option value='10'>
                10 {t("serviceProviders.actions.perPage")}
              </option>
              <option value='25'>
                25 {t("serviceProviders.actions.perPage")}
              </option>
              <option value='50'>
                50 {t("serviceProviders.actions.perPage")}
              </option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className='flex flex-wrap gap-2 mt-4'>
          {/* Status Quick Filters */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>
              {t("serviceProviders.filters.status")}:
            </span>
            {["all", "active", "pending", "suspend"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedStatus === status
                    ? status === "active"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : status === "pending"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : status === "suspend"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {status === "all"
                  ? t("serviceProviders.filters.allStatus")
                  : getStatusDisplay(status)}
                {status !== "all" && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                      selectedStatus === status
                        ? "bg-white bg-opacity-20"
                        : "bg-gray-200"
                    }`}>
                    {status === "active"
                      ? activeCount
                      : status === "pending"
                      ? pendingCount
                      : suspendedCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Category Quick Filters */}
          <div className='flex items-center gap-2 ml-4'>
            <span className='text-sm text-gray-600'>
              {t("serviceProviders.filters.category")}:
            </span>
            {[
              "all",
              "home-garden",
              "electronics",
              "services",
              "sports",
              "other",
            ].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? category === "all"
                      ? "bg-blue-600 text-white"
                      : getCategoryColor(category) + " border"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {getCategoryDisplay(category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
        {filteredProviders.map((provider) => (
          <div
            key={provider._id}
            className='bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'>
            {/* Provider Header */}
            <div className='p-5'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <div className='h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden'>
                      {provider.image ? (
                        <img
                          src={provider.image}
                          alt={provider.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <User size={28} className='text-blue-600' />
                      )}
                    </div>
                    {/* Status Badge */}
                    <div
                      className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white ${getStatusColor(
                        provider.status
                      )}`}>
                      {getStatusIcon(provider.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {provider.name}
                    </h3>
                    <p className='text-sm text-gray-600'>{provider.role}</p>
                  </div>
                </div>
                <button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'>
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Shop Name */}
              {provider.shopName && (
                <div className='mt-3 flex items-center gap-2'>
                  <Building size={16} className='text-gray-400' />
                  <span className='font-medium text-gray-700'>
                    {provider.shopName}
                  </span>
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className='px-5 pb-5 space-y-3'>
              {/* Contact Info */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm'>
                  <Mail size={14} className='text-gray-400' />
                  <span className='text-gray-600 truncate'>
                    {provider.email}
                  </span>
                </div>
                {provider.phoneNumber && (
                  <div className='flex items-center gap-2 text-sm'>
                    <Phone size={14} className='text-gray-400' />
                    <span className='text-gray-600'>
                      {provider.phoneNumber}
                    </span>
                  </div>
                )}
                {provider.address && (
                  <div className='flex items-center gap-2 text-sm'>
                    <MapPin size={14} className='text-gray-400' />
                    <span className='text-gray-600 truncate'>
                      {provider.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Service Details */}
              <div className='pt-3 border-t border-gray-100 space-y-2'>
                {provider.serviceName && (
                  <div className='flex items-center gap-2'>
                    <Briefcase size={14} className='text-blue-400' />
                    <span className='text-sm font-medium text-gray-700'>
                      {provider.serviceName}
                    </span>
                  </div>
                )}

                {provider.category && (
                  <div className='flex items-center gap-2'>
                    {getCategoryIcon(provider.category)}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                        provider.category
                      )}`}>
                      {getCategoryDisplay(provider.category)}
                    </span>
                  </div>
                )}

                {provider.hourlyRate > 0 && (
                  <div className='flex items-center gap-2 text-sm'>
                    <DollarSign size={14} className='text-green-500' />
                    <span className='font-semibold text-gray-800'>
                      ${provider.hourlyRate}
                      <span className='text-sm text-gray-500'>/hr</span>
                    </span>
                  </div>
                )}

                {provider.serviceArea && (
                  <div className='flex items-center gap-2 text-sm'>
                    <Globe size={14} className='text-blue-400' />
                    <span className='text-gray-600'>
                      {provider.serviceArea}
                    </span>
                  </div>
                )}
              </div>

              {/* Working Hours */}
              {provider.workingHours && (
                <div className='flex items-center gap-2 text-sm'>
                  <Clock size={14} className='text-purple-400' />
                  <span className='text-gray-600'>
                    {provider.workingHours.start} - {provider.workingHours.end}
                  </span>
                </div>
              )}

              {/* Registration Date */}
              <div className='flex items-center gap-2 text-sm text-gray-500'>
                <Calendar size={14} />
                <span>
                  {t("serviceProviders.table.joined", {
                    date: formatDate(provider.registrationDate),
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='px-5 pb-5 pt-3 border-t border-gray-100'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handleViewDetails(provider)}
                  className='flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition'>
                  <Eye size={16} />
                  {t("serviceProviders.actions.view")}
                </button>

                {/* Status Change Buttons */}
                {provider.status !== "active" && (
                  <button
                    onClick={() => handleStatusClick(provider, "active")}
                    className='flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition'
                    title={t("serviceProviders.actions.activate")}>
                    <Check size={16} />
                  </button>
                )}

                {provider.status !== "suspend" && (
                  <button
                    onClick={() => handleStatusClick(provider, "suspend")}
                    className='flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition'
                    title={t("serviceProviders.actions.suspend")}>
                    <X size={16} />
                  </button>
                )}

                {provider.status !== "pending" && (
                  <button
                    onClick={() => handleStatusClick(provider, "pending")}
                    className='flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition'
                    title={t("serviceProviders.actions.setPending")}>
                    <AlertCircle size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <div className='text-center py-12'>
          <div className='h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6'>
            <Users size={32} className='text-gray-400' />
          </div>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>
            {t("serviceProviders.table.emptyState.title")}
          </h3>
          <p className='text-gray-600 max-w-md mx-auto'>
            {searchTerm ||
            selectedCategory !== "all" ||
            selectedStatus !== "all"
              ? t("serviceProviders.table.emptyState.search")
              : t("serviceProviders.table.emptyState.noProviders")}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
          <div className='text-sm text-gray-600'>
            {t("serviceProviders.table.showing", {
              start: (page - 1) * limit + 1,
              end: Math.min(page * limit, pagination.total),
              total: pagination.total,
            })}
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`p-2.5 rounded-xl border ${
                page === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm"
              }`}>
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-10 w-10 rounded-xl font-medium transition ${
                      page === pageNum
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`}>
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              disabled={page === pagination.totalPages}
              className={`p-2.5 rounded-xl border ${
                page === pagination.totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm"
              }`}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Export Options Modal */}
      {isExportModalOpen && (
        <div className='fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full'>
            <div className='p-6'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center'>
                  <Download size={24} className='text-blue-600' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-800'>
                    {t("serviceProviders.modals.exportOptions.title")}
                  </h2>
                  <p className='text-gray-600'>
                    {t("serviceProviders.modals.exportOptions.selectFormat")}
                  </p>
                </div>
              </div>

              <div className='space-y-6'>
                {/* Export Format */}
                <div>
                  <h3 className='font-semibold text-gray-800 mb-3'>
                    Export Format
                  </h3>
                  <div className='grid grid-cols-3 gap-3'>
                    <button
                      onClick={() =>
                        setExportOptions({ ...exportOptions, format: "csv" })
                      }
                      className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition ${
                        exportOptions.format === "csv"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <FileSpreadsheet
                        size={24}
                        className={
                          exportOptions.format === "csv"
                            ? "text-blue-600"
                            : "text-gray-500"
                        }
                      />
                      <span className='text-sm font-medium'>CSV</span>
                    </button>
                    <button
                      onClick={() =>
                        setExportOptions({ ...exportOptions, format: "pdf" })
                      }
                      className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition ${
                        exportOptions.format === "pdf"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <FileText
                        size={24}
                        className={
                          exportOptions.format === "pdf"
                            ? "text-red-600"
                            : "text-gray-500"
                        }
                      />
                      <span className='text-sm font-medium'>PDF</span>
                    </button>
                    <button
                      onClick={() =>
                        setExportOptions({ ...exportOptions, format: "excel" })
                      }
                      className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition ${
                        exportOptions.format === "excel"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <FileSpreadsheet
                        size={24}
                        className={
                          exportOptions.format === "excel"
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      />
                      <span className='text-sm font-medium'>Excel</span>
                    </button>
                  </div>
                </div>

                {/* Include Data */}
                <div>
                  <h3 className='font-semibold text-gray-800 mb-3'>
                    {t("serviceProviders.modals.exportOptions.includeData")}
                  </h3>
                  <div className='space-y-2'>
                    {[
                      {
                        id: "all",
                        label: t(
                          "serviceProviders.modals.exportOptions.allProviders"
                        ),
                      },
                      {
                        id: "filtered",
                        label: t(
                          "serviceProviders.modals.exportOptions.filteredProviders",
                          { count: filteredProviders.length }
                        ),
                      },
                      {
                        id: "selected",
                        label: t(
                          "serviceProviders.modals.exportOptions.selectedProviders"
                        ),
                      },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer'>
                        <input
                          type='radio'
                          name='includeData'
                          value={option.id}
                          checked={exportOptions.include === option.id}
                          onChange={(e) =>
                            setExportOptions({
                              ...exportOptions,
                              include: e.target.value,
                            })
                          }
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                        />
                        <span className='font-medium'>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Columns to Include */}
                <div>
                  <h3 className='font-semibold text-gray-800 mb-3'>
                    {t("serviceProviders.modals.exportOptions.columns")}
                  </h3>
                  <div className='space-y-2'>
                    {[
                      {
                        id: "all",
                        label: t(
                          "serviceProviders.modals.exportOptions.allColumns"
                        ),
                      },
                      {
                        id: "basic",
                        label: t(
                          "serviceProviders.modals.exportOptions.basicInfo"
                        ),
                      },
                      {
                        id: "contact",
                        label: t(
                          "serviceProviders.modals.exportOptions.contactInfo"
                        ),
                      },
                      {
                        id: "service",
                        label: t(
                          "serviceProviders.modals.exportOptions.serviceInfo"
                        ),
                      },
                      {
                        id: "status",
                        label: t(
                          "serviceProviders.modals.exportOptions.statusInfo"
                        ),
                      },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer'>
                        <input
                          type='radio'
                          name='columns'
                          value={option.id}
                          checked={exportOptions.columns === option.id}
                          onChange={(e) =>
                            setExportOptions({
                              ...exportOptions,
                              columns: e.target.value,
                            })
                          }
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                        />
                        <span className='font-medium'>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className='flex gap-3 mt-8'>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  disabled={isExporting}
                  className='flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition'>
                  {t("serviceProviders.modals.exportOptions.cancel")}
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className={`flex-1 px-4 py-3 rounded-xl text-white transition flex items-center justify-center gap-2 ${
                    isExporting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                  }`}>
                  {isExporting ? (
                    <>
                      <Loader2 size={18} className='animate-spin' />
                      {t("serviceProviders.modals.exportOptions.exporting")}
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      {t("serviceProviders.modals.exportOptions.export")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal (kept the same but translated) */}
      {isStatusModalOpen && statusToUpdate && (
        <div className='fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full'>
            <div className='p-6'>
              <div className='flex items-center gap-3 mb-6'>
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    statusToUpdate.newStatus === "active"
                      ? "bg-green-100"
                      : statusToUpdate.newStatus === "suspend"
                      ? "bg-red-100"
                      : "bg-yellow-100"
                  }`}>
                  {statusToUpdate.newStatus === "active" ? (
                    <CheckCircle size={24} className='text-green-600' />
                  ) : statusToUpdate.newStatus === "suspend" ? (
                    <XCircle size={24} className='text-red-600' />
                  ) : (
                    <AlertCircle size={24} className='text-yellow-600' />
                  )}
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-800'>
                    {t("serviceProviders.modals.changeStatus.title")}
                  </h2>
                  <p className='text-gray-600'>
                    {t("serviceProviders.modals.changeStatus.updateStatus", {
                      name: statusToUpdate.name,
                    })}
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='p-4 bg-gray-50 rounded-xl'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>
                      {t("serviceProviders.modals.changeStatus.currentStatus")}
                    </span>
                    <span
                      className={`font-medium ${getStatusColor(
                        statusToUpdate.currentStatus
                      )} px-3 py-1 rounded-full`}>
                      {getStatusDisplay(
                        statusToUpdate.currentStatus
                      ).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className='p-4 bg-blue-50 rounded-xl'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>
                      {t("serviceProviders.modals.changeStatus.newStatus")}
                    </span>
                    <span
                      className={`font-medium ${getStatusColor(
                        statusToUpdate.newStatus
                      )} px-3 py-1 rounded-full`}>
                      {getStatusDisplay(statusToUpdate.newStatus).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-xl'>
                  <div className='flex items-start gap-3'>
                    <AlertCircle size={20} className='text-yellow-600 mt-0.5' />
                    <div>
                      <h4 className='font-medium text-yellow-800'>Note:</h4>
                      <p className='text-sm text-yellow-700 mt-1'>
                        {t(
                          `serviceProviders.modals.changeStatus.notes.${statusToUpdate.newStatus}`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex gap-3 mt-8'>
                <button
                  onClick={() => {
                    setIsStatusModalOpen(false);
                    setStatusToUpdate(null);
                  }}
                  disabled={isUpdating}
                  className='flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition'>
                  {t("serviceProviders.modals.changeStatus.cancel")}
                </button>
                <button
                  onClick={handleConfirmStatusUpdate}
                  disabled={isUpdating}
                  className={`flex-1 px-4 py-3 rounded-xl text-white transition flex items-center justify-center gap-2 ${
                    isUpdating
                      ? "bg-gray-400 cursor-not-allowed"
                      : statusToUpdate.newStatus === "active"
                      ? "bg-green-600 hover:bg-green-700"
                      : statusToUpdate.newStatus === "suspend"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}>
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className='animate-spin' />
                      {t("serviceProviders.modals.changeStatus.updating")}
                    </>
                  ) : (
                    <>
                      {statusToUpdate.newStatus === "active" ? (
                        <Check size={18} />
                      ) : statusToUpdate.newStatus === "suspend" ? (
                        <X size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}
                      {t("serviceProviders.modals.changeStatus.confirmUpdate")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Details Modal (translated version) */}
      {isDetailModalOpen && selectedProvider && (
        <div className='fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Modal Header */}
            <div className='sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10'>
              <div className='flex items-center gap-3'>
                <div className='h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden'>
                  {selectedProvider.image ? (
                    <img
                      src={selectedProvider.image}
                      alt={selectedProvider.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <User size={28} className='text-blue-600' />
                  )}
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    {selectedProvider.name}
                  </h2>
                  <div className='flex items-center gap-2 mt-1'>
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        selectedProvider.status
                      )} px-2.5 py-0.5 rounded-full`}>
                      {getStatusDisplay(selectedProvider.status).toUpperCase()}
                    </span>
                    <span className='text-gray-600'>
                      • {selectedProvider.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className='p-2 hover:bg-gray-100 rounded-xl transition'>
                <X size={24} className='text-gray-500' />
              </button>
            </div>

            {/* Modal Content - All content would be translated similar to above */}
            {/* ... (translated modal content would go here) ... */}

            {/* Modal Footer */}
            <div className='sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3'>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition'>
                Close
              </button>
              <button className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition'>
                {t("serviceProviders.actions.sendMessage")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
