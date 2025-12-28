'use client'

import { useState } from 'react';
import { 
  useGetAllServiceProvidersQuery,
  useUpdateProviderStatusMutation 
} from '@/feature/UserApi';
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
  Loader2
} from "lucide-react";

const ServicesPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);

  const { data, isLoading, isError, error } = useGetAllServiceProvidersQuery({ page, limit });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateProviderStatusMutation();

  const providers = data?.data || [];
  const pagination = data?.pagination || {};
  
  if (isError) {
    console.error('Error fetching providers:', error);
  }

  // Filter providers
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.phoneNumber?.includes(searchTerm);

    const matchesCategory = 
      selectedCategory === 'all' || 
      provider.category === selectedCategory;

    const matchesStatus = 
      selectedStatus === 'all' || 
      provider.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspend':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'suspend':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'home-garden':
        return <Home size={16} className="text-blue-500" />;
      case 'electronics':
        return <Package size={16} className="text-purple-500" />;
      case 'services':
        return <Settings size={16} className="text-orange-500" />;
      case 'sports':
        return <Target size={16} className="text-green-500" />;
      case 'other':
        return <Briefcase size={16} className="text-gray-500" />;
      default:
        return <Briefcase size={16} className="text-gray-400" />;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'home-garden':
        return 'bg-blue-100 text-blue-800';
      case 'electronics':
        return 'bg-purple-100 text-purple-800';
      case 'services':
        return 'bg-orange-100 text-orange-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle view details
  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setIsDetailModalOpen(true);
  };

  // Handle status update
  const handleStatusClick = (provider, status) => {
    setStatusToUpdate({ id: provider._id, name: provider.name, currentStatus: provider.status, newStatus: status });
    setIsStatusModalOpen(true);
  };

  // Confirm status update
  const handleConfirmStatusUpdate = async () => {
    if (!statusToUpdate) return;

    try {
      await updateStatus({
        id: statusToUpdate.id,
        status: statusToUpdate.newStatus
      }).unwrap();

      // Close modal and reset
      setIsStatusModalOpen(false);
      setStatusToUpdate(null);
      
      // Show success message
      alert(`Status updated successfully to ${statusToUpdate.newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Calculate stats
  const activeCount = providers.filter(p => p.status === 'active').length;
  const pendingCount = providers.filter(p => p.status === 'pending').length;
  const suspendedCount = providers.filter(p => p.status === 'suspend').length;
  const totalRevenue = providers.reduce((sum, provider) => sum + (provider.hourlyRate || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service providers...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Error Loading Providers</h3>
          <p className="text-gray-600 mt-2">Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Service Providers
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all service providers and their activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition shadow-sm">
              <Download size={18} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition shadow-sm">
              <Printer size={18} />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition">
              <Users size={18} />
              Add Provider
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Providers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Providers</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pagination.total || 0}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Users size={28} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp size={14} />
              <span>↑ 12% from last month</span>
            </div>
          </div>
        </div>

        {/* Active Providers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{activeCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>{Math.round((activeCount / providers.length) * 100) || 0}% of total</span>
            </div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pendingCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
              <AlertCircle size={28} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <span>Requires attention</span>
            </div>
          </div>
        </div>

        {/* Suspended */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Suspended</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{suspendedCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <XCircle size={28} className="text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <TrendingDown size={14} />
              <span>Needs review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search providers by name, email, shop name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="all">All Categories</option>
                <option value="home-garden">Home & Garden</option>
                <option value="electronics">Electronics</option>
                <option value="services">Services</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspend">Suspended</option>
              </select>
              <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* Items Per Page */}
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Status Quick Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            {['all', 'active', 'pending', 'suspend'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedStatus === status
                    ? status === 'active'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : status === 'suspend'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    selectedStatus === status ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                  }`}>
                    {status === 'active' ? activeCount : status === 'pending' ? pendingCount : suspendedCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Category Quick Filters */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600">Category:</span>
            {['all', 'home-garden', 'electronics', 'services', 'sports', 'other'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? category === 'all'
                      ? 'bg-blue-600 text-white'
                      : getCategoryColor(category) + ' border'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category.replace('-', ' ').charAt(0).toUpperCase() + category.replace('-', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredProviders.map((provider) => (
          <div 
            key={provider._id} 
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Provider Header */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                      {provider.image ? (
                        <img 
                          src={provider.image} 
                          alt={provider.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={28} className="text-blue-600" />
                      )}
                    </div>
                    {/* Status Badge */}
                    <div className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white ${getStatusColor(provider.status)}`}>
                      {getStatusIcon(provider.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.role}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Shop Name */}
              {provider.shopName && (
                <div className="mt-3 flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{provider.shopName}</span>
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="px-5 pb-5 space-y-3">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-600 truncate">{provider.email}</span>
                </div>
                {provider.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600">{provider.phoneNumber}</span>
                  </div>
                )}
                {provider.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-600 truncate">{provider.address}</span>
                  </div>
                )}
              </div>

              {/* Service Details */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {provider.serviceName && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-blue-400" />
                    <span className="text-sm font-medium text-gray-700">{provider.serviceName}</span>
                  </div>
                )}
                
                {provider.category && (
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(provider.category)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(provider.category)}`}>
                      {provider.category.replace('-', ' ')}
                    </span>
                  </div>
                )}

                {provider.hourlyRate > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={14} className="text-green-500" />
                    <span className="font-semibold text-gray-800">${provider.hourlyRate}/hr</span>
                  </div>
                )}

                {provider.serviceArea && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe size={14} className="text-blue-400" />
                    <span className="text-gray-600">{provider.serviceArea}</span>
                  </div>
                )}
              </div>

              {/* Working Hours */}
              {provider.workingHours && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-purple-400" />
                  <span className="text-gray-600">
                    {provider.workingHours.start} - {provider.workingHours.end}
                  </span>
                </div>
              )}

              {/* Registration Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>Joined {formatDate(provider.registrationDate)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewDetails(provider)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <Eye size={16} />
                  View
                </button>
                
                {/* Status Change Buttons */}
                {provider.status !== 'active' && (
                  <button
                    onClick={() => handleStatusClick(provider, 'active')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                    title="Activate"
                  >
                    <Check size={16} />
                  </button>
                )}
                
                {provider.status !== 'suspend' && (
                  <button
                    onClick={() => handleStatusClick(provider, 'suspend')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    title="Suspend"
                  >
                    <X size={16} />
                  </button>
                )}
                
                {provider.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusClick(provider, 'pending')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                    title="Set Pending"
                  >
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
        <div className="text-center py-12">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No providers found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No service providers have registered yet'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} providers
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`p-2.5 rounded-xl border ${
                page === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={page === pagination.totalPages}
              className={`p-2.5 rounded-xl border ${
                page === pagination.totalPages
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && statusToUpdate && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  statusToUpdate.newStatus === 'active' ? 'bg-green-100' :
                  statusToUpdate.newStatus === 'suspend' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {statusToUpdate.newStatus === 'active' ? <CheckCircle size={24} className="text-green-600" /> :
                   statusToUpdate.newStatus === 'suspend' ? <XCircle size={24} className="text-red-600" /> :
                   <AlertCircle size={24} className="text-yellow-600" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Change Provider Status</h2>
                  <p className="text-gray-600">Update {statusToUpdate.name}'s account status</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <span className={`font-medium ${getStatusColor(statusToUpdate.currentStatus)} px-3 py-1 rounded-full`}>
                      {statusToUpdate.currentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">New Status:</span>
                    <span className={`font-medium ${getStatusColor(statusToUpdate.newStatus)} px-3 py-1 rounded-full`}>
                      {statusToUpdate.newStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Note:</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {statusToUpdate.newStatus === 'active' 
                          ? 'Provider will be able to receive bookings and use all features.'
                          : statusToUpdate.newStatus === 'suspend'
                          ? 'Provider will be temporarily suspended and cannot receive new bookings.'
                          : 'Provider will be marked as pending approval and cannot receive bookings.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setIsStatusModalOpen(false);
                    setStatusToUpdate(null);
                  }}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusUpdate}
                  disabled={isUpdating}
                  className={`flex-1 px-4 py-3 rounded-xl text-white transition flex items-center justify-center gap-2 ${
                    isUpdating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : statusToUpdate.newStatus === 'active'
                      ? 'bg-green-600 hover:bg-green-700'
                      : statusToUpdate.newStatus === 'suspend'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {statusToUpdate.newStatus === 'active' ? <Check size={18} /> :
                       statusToUpdate.newStatus === 'suspend' ? <X size={18} /> :
                       <AlertCircle size={18} />}
                      Confirm Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Details Modal */}
      {isDetailModalOpen && selectedProvider && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  {selectedProvider.image ? (
                    <img 
                      src={selectedProvider.image} 
                      alt={selectedProvider.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={28} className="text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedProvider.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm font-medium ${getStatusColor(selectedProvider.status)} px-2.5 py-0.5 rounded-full`}>
                      {selectedProvider.status.toUpperCase()}
                    </span>
                    <span className="text-gray-600">• {selectedProvider.role}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="border rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedProvider.email}</p>
                      </div>
                    </div>
                    {selectedProvider.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedProvider.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                    {selectedProvider.address && (
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{selectedProvider.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Info */}
                <div className="border rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Business Information</h3>
                  <div className="space-y-3">
                    {selectedProvider.shopName && (
                      <div className="flex items-center gap-3">
                        <Building size={18} className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Shop/Business Name</p>
                          <p className="font-medium">{selectedProvider.shopName}</p>
                        </div>
                      </div>
                    )}
                    {selectedProvider.serviceName && (
                      <div className="flex items-center gap-3">
                        <Briefcase size={18} className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Service Name</p>
                          <p className="font-medium">{selectedProvider.serviceName}</p>
                        </div>
                      </div>
                    )}
                    {selectedProvider.category && (
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(selectedProvider.category)}
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{selectedProvider.category}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              {selectedProvider.serviceDescription || selectedProvider.hourlyRate > 0 && (
                <div className="border rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Service Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedProvider.hourlyRate > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                        <p className="text-2xl font-bold text-green-600">${selectedProvider.hourlyRate}<span className="text-sm text-gray-500">/hour</span></p>
                      </div>
                    )}
                    {selectedProvider.serviceArea && (
                      <div>
                        <p className="text-sm text-gray-500">Service Area</p>
                        <p className="font-medium">{selectedProvider.serviceArea}</p>
                      </div>
                    )}
                    {selectedProvider.serviceRedius > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Service Radius</p>
                        <p className="font-medium">{selectedProvider.serviceRedius} km</p>
                      </div>
                    )}
                    {selectedProvider.serviceDescription && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="font-medium mt-1">{selectedProvider.serviceDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Working Hours & Days */}
              {(selectedProvider.workingHours || selectedProvider.workingDays?.length > 0) && (
                <div className="border rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Working Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedProvider.workingHours && (
                      <div>
                        <p className="text-sm text-gray-500">Working Hours</p>
                        <p className="font-medium">
                          {selectedProvider.workingHours.start} - {selectedProvider.workingHours.end}
                        </p>
                      </div>
                    )}
                    {selectedProvider.workingDays?.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Working Days</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProvider.workingDays.map((day, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedProvider.slotDuration && (
                      <div>
                        <p className="text-sm text-gray-500">Slot Duration</p>
                        <p className="font-medium">{selectedProvider.slotDuration} minutes</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registration Details */}
              <div className="border rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-4">Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium">{formatDateTime(selectedProvider.registrationDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">{formatDateTime(selectedProvider.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDateTime(selectedProvider.updatedAt)}</p>
                  </div>
                  {selectedProvider.nationalId && (
                    <div>
                      <p className="text-sm text-gray-500">National ID</p>
                      <p className="font-medium">{selectedProvider.nationalId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Images */}
              {selectedProvider.servicesImage?.length > 0 && (
                <div className="border rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Service Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProvider.servicesImage.map((img, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={img} 
                          alt={`Service ${index + 1}`}
                          className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Management */}
              <div className="border rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-4">Manage Status</h3>
                <div className="flex flex-wrap gap-3">
                  {['active', 'pending', 'suspend'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusClick(selectedProvider, status)}
                      disabled={selectedProvider.status === status || isUpdating}
                      className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
                        selectedProvider.status === status
                          ? getStatusColor(status).replace('border', 'bg')
                          : status === 'active'
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          : status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {getStatusIcon(status)}
                      {status === 'active' ? 'Activate Account' :
                       status === 'pending' ? 'Set as Pending' :
                       'Suspend Account'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition">
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;