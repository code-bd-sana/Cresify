"use client";

import { useGetAllServiceProvidersQuery } from "@/feature/UserApi";
import Link from "next/link";
import { useEffect, useState, useCallback, Suspense } from "react";
import { AiFillStar } from "react-icons/ai";
import { LuMapPin } from "react-icons/lu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  MapPin,
  Globe,
  Building,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

function AllServiceProvidersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation("serviceHeading");

  // Get query parameters from URL
  const countryParam = searchParams.get("country") || "";
  const regionParam = searchParams.get("region") || "";
  const cityParam = searchParams.get("city") || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [allProviders, setAllProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  // Active location filters from URL
  const [activeCountry, setActiveCountry] = useState(countryParam);
  const [activeRegion, setActiveRegion] = useState(regionParam);
  const [activeCity, setActiveCity] = useState(cityParam);

  const { data, isLoading, isFetching, error } = useGetAllServiceProvidersQuery(
    { page, limit },
    { skip: !page }
  );

  // Service categories for filtering
  const serviceCategories = [
    "all",
    "cleaning",
    "plumbing",
    "electrical",
    "carpentry",
    "painting",
    "gardening",
    "moving",
    "appliance repair",
    "handyman",
    "other",
  ];

  // Update URL with current filters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (activeCountry) params.set("country", activeCountry);
    if (activeRegion) params.set("region", activeRegion);
    if (activeCity) params.set("city", activeCity);

    const queryString = params.toString();
    const newUrl = queryString ? `/services?${queryString}` : "/services";

    router.push(newUrl, { scroll: false });
  }, [activeCountry, activeRegion, activeCity, router]);

  // Initialize URL parameters on component mount
  useEffect(() => {
    if (countryParam || regionParam || cityParam) {
      setPage(1);
      updateURL();
    }
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    if (countryParam || regionParam || cityParam) {
      setPage(1);
      setLocationFilter("custom");
    }
  }, [countryParam, regionParam, cityParam]);

  // Handle initial data load
  useEffect(() => {
    if (data && data.data) {
      const providers = data.data.providers || data.data;

      if (data.pagination?.page === 1) {
        setAllProviders(providers);
      } else {
        setAllProviders((prev) => [...prev, ...providers]);
      }

      // Extract unique locations for filter
      if (data.pagination?.page === 1) {
        const locations = new Set();
        providers.forEach((p) => {
          if (p.country) locations.add(`country:${p.country}`);
          if (p.region) locations.add(`region:${p.region}`);
          if (p.city) locations.add(`city:${p.city}`);
          if (p.serviceArea) locations.add(`area:${p.serviceArea}`);
        });
        setUniqueLocations(
          Array.from(locations).map((loc) => {
            const [type, value] = loc.split(":");
            return { type, value, label: `${value} (${type})` };
          })
        );
      }

      // Update pagination info
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalProviders(data.pagination.total || 0);
      } else if (data.data.total) {
        setTotalPages(Math.ceil(data.data.total / limit));
        setTotalProviders(data.data.total);
      }
    }
  }, [data, limit]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, serviceFilter, activeCountry, activeRegion, activeCity]);

  // Filter providers based on all criteria
  const filteredProviders = allProviders.filter((p) => {
    // Search query matching
    const matchesSearch =
      !searchQuery ||
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serviceName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serviceCategory || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (p.serviceArea || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.country || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.region || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.address || "").toLowerCase().includes(searchQuery.toLowerCase());

    // Service category matching
    const matchesService =
      serviceFilter === "all" ||
      (p.serviceCategory || "").toLowerCase() === serviceFilter.toLowerCase();

    // URL parameter matching (country, region, city)
    const matchesURLParams =
      (!activeCountry ||
        (p.country || "").toLowerCase() === activeCountry.toLowerCase()) &&
      (!activeRegion ||
        (p.region || "").toLowerCase() === activeRegion.toLowerCase()) &&
      (!activeCity ||
        (p.city || "").toLowerCase() === activeCity.toLowerCase());

    // Location filter matching (for dropdown)
    const matchesLocationFilter =
      locationFilter === "all" ||
      locationFilter === "custom" ||
      (p.country || "").toLowerCase() === locationFilter.toLowerCase() ||
      (p.region || "").toLowerCase() === locationFilter.toLowerCase() ||
      (p.city || "").toLowerCase() === locationFilter.toLowerCase() ||
      (p.serviceArea || "").toLowerCase() === locationFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesService &&
      matchesURLParams &&
      matchesLocationFilter
    );
  });

  // Handle location filter from dropdown
  const handleLocationFilterChange = (value) => {
    setLocationFilter(value);
    if (value === "all") {
      clearAllLocationFilters();
    } else if (value !== "custom") {
      clearAllLocationFilters();
      setLocationFilter(value);
    }
  };

  // Set location from URL parameters
  const setLocationFromParams = useCallback(() => {
    if (countryParam) setActiveCountry(countryParam);
    if (regionParam) setActiveRegion(regionParam);
    if (cityParam) setActiveCity(cityParam);
  }, [countryParam, regionParam, cityParam]);

  // Clear specific location filter
  const clearLocationFilter = (type) => {
    switch (type) {
      case "country":
        setActiveCountry("");
        break;
      case "region":
        setActiveRegion("");
        break;
      case "city":
        setActiveCity("");
        break;
    }
    updateURL();
  };

  // Clear all location filters
  const clearAllLocationFilters = () => {
    setActiveCountry("");
    setActiveRegion("");
    setActiveCity("");
    setLocationFilter("all");
    router.push("/services", { scroll: false });
  };

  // Apply location filter
  const applyLocationFilter = (type, value) => {
    switch (type) {
      case "country":
        setActiveCountry(value);
        break;
      case "region":
        setActiveRegion(value);
        break;
      case "city":
        setActiveCity(value);
        break;
      case "area":
        // Handle area filter differently
        setLocationFilter(value.toLowerCase());
        break;
    }
    updateURL();
  };

  // Get location display text
  const getLocationDisplay = (provider) => {
    const locationParts = [];
    if (provider.city) locationParts.push(provider.city);
    if (provider.region && provider.region !== provider.city)
      locationParts.push(provider.region);
    if (provider.country) locationParts.push(provider.country);

    return locationParts.length > 0
      ? locationParts.join(", ")
      : provider.serviceArea || provider.address || "Location not specified";
  };

  // Get location icon
  const getLocationIcon = (type) => {
    switch (type) {
      case "country":
        return <Globe className="w-3 h-3" />;
      case "region":
        return <MapPin className="w-3 h-3" />;
      case "city":
        return <Building className="w-3 h-3" />;
      case "area":
        return <LuMapPin className="w-3 h-3" />;
      default:
        return <LuMapPin className="w-3 h-3" />;
    }
  };

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Calculate display range
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalProviders);

  // Check if URL parameters exist
  const hasURLParams = Boolean(countryParam || regionParam || cityParam);

  if (isLoading && page === 1) {
    return (
      <section className="w-full py-10 px-5 bg-[#F5F5F7]">
        <div className="max-w-[1350px] mx-auto">
          <h2 className="text-[36px] px-4 font-bold text-[#1B1B1B] mb-6">
            {t("all_providers")}
          </h2>

          {/* Search and Filter Skeleton */}
          <div className="mb-8 px-4">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded-lg mb-4"></div>
              <div className="flex gap-4">
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[20px] p-[14px] animate-pulse"
              >
                <div className="w-full h-[210px] bg-gray-300 rounded-[16px] mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-3"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-5"></div>
                <div className="h-10 bg-gray-300 rounded-[12px]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-10 px-5 bg-[#F5F5F7]">
        <div className="max-w-[1350px] mx-auto text-center">
          <h2 className="text-[36px] px-4 font-bold text-[#1B1B1B] mb-6">
            {t("all_providers")}
          </h2>
          <p className="text-red-500">
            Error loading service providers. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 px-5 bg-[#F5F5F7]">
      <div className="max-w-[1350px] mx-auto">
        {/* Header */}
        <div className="mb-8 px-4">
          <h2 className="text-[36px] font-bold text-[#1B1B1B] mb-2">
            {t("all_providers")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('find_providers')}
          </p>

          {/* URL Parameters Info Banner */}
          {hasURLParams && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Filtering by URL parameters:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {countryParam && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          <Globe className="w-3 h-3" />
                          Country: {countryParam}
                          <button
                            onClick={() => clearLocationFilter("country")}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {regionParam && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          <MapPin className="w-3 h-3" />
                          Region: {regionParam}
                          <button
                            onClick={() => clearLocationFilter("region")}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {cityParam && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          <Building className="w-3 h-3" />
                          City: {cityParam}
                          <button
                            onClick={() => clearLocationFilter("city")}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearAllLocationFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear URL filters
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                These filters are applied from the URL. Clear them to see all
                providers.
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex} - {endIndex} of {totalProviders} providers
              {hasURLParams && " (filtered by URL)"}
            </div>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, service, country, region, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1 pl-1">
                  Search by name, service, country, region, or city
                </p>
              </div>

              {/* Service Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Services</option>
                  {serviceCategories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="flex items-center gap-2">
                <MapPin className="text-gray-400 w-5 h-5" />
                <select
                  value={hasURLParams ? "custom" : locationFilter}
                  onChange={(e) => handleLocationFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={hasURLParams}
                >
                  <option value="all">All Locations</option>
                  {hasURLParams && (
                    <option value="custom">Custom URL Filter</option>
                  )}
                  {!hasURLParams &&
                    uniqueLocations.map((location) => (
                      <option
                        key={`${location.type}:${location.value}`}
                        value={location.value.toLowerCase()}
                      >
                        {location.value} ({location.type})
                      </option>
                    ))}
                </select>
                {hasURLParams && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Using URL filters)
                  </span>
                )}
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(serviceFilter !== "all" || hasURLParams || searchQuery) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>

                  {serviceFilter !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Service: {serviceFilter}
                      <button
                        onClick={() => setServiceFilter("all")}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {countryParam && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Globe className="w-3 h-3 mr-1" />
                      Country: {countryParam}
                      <button
                        onClick={() => clearLocationFilter("country")}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {regionParam && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      Region: {regionParam}
                      <button
                        onClick={() => clearLocationFilter("region")}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {cityParam && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Building className="w-3 h-3 mr-1" />
                      City: {cityParam}
                      <button
                        onClick={() => clearLocationFilter("city")}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {(serviceFilter !== "all" || hasURLParams || searchQuery) && (
                    <button
                      onClick={() => {
                        setServiceFilter("all");
                        clearAllLocationFilters();
                        setSearchQuery("");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Location Summary */}
          {uniqueLocations.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-blue-800">
                  Available Locations
                </h4>
                <span className="text-xs text-gray-500 ml-auto">
                  Click to filter by location
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueLocations.slice(0, 12).map((location) => (
                  <button
                    key={`${location.type}:${location.value}`}
                    onClick={() =>
                      applyLocationFilter(location.type, location.value)
                    }
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs ${
                      (location.type === "country" &&
                        activeCountry === location.value.toLowerCase()) ||
                      (location.type === "region" &&
                        activeRegion === location.value.toLowerCase()) ||
                      (location.type === "city" &&
                        activeCity === location.value.toLowerCase())
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {getLocationIcon(location.type)}
                    {location.value}
                    <span className="text-[10px] opacity-75 ml-1">
                      ({location.type})
                    </span>
                  </button>
                ))}
                {uniqueLocations.length > 12 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{uniqueLocations.length - 12} more locations
                  </span>
                )}
              </div>
            </div>
          )}

          {/* URL Filter Info */}
          {hasURLParams && filteredProviders.length > 0 && (
            <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-800">
                  Showing providers from{" "}
                  {cityParam && <strong>{cityParam}</strong>}
                  {cityParam && regionParam && ", "}
                  {regionParam && <strong>{regionParam}</strong>}
                  {(cityParam || regionParam) && countryParam && " in "}
                  {countryParam && <strong>{countryParam}</strong>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProviders.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {hasURLParams
                  ? "No providers found in this location"
                  : "No providers found"}
              </h3>
              <p className="text-gray-600 mb-4">
                {hasURLParams
                  ? `No service providers found in ${
                      cityParam || regionParam || countryParam
                    }. Try a different location.`
                  : searchQuery || serviceFilter !== "all"
                  ? "Try adjusting your filters or search criteria"
                  : "No service providers available yet"}
              </p>
              <div className="flex gap-3 justify-center">
                {(searchQuery || serviceFilter !== "all" || hasURLParams) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setServiceFilter("all");
                      if (hasURLParams) clearAllLocationFilters();
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Clear all filters
                  </button>
                )}
                {hasURLParams && (
                  <button
                    onClick={() => router.push("/services")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View all providers
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredProviders.map((p) => (
              <div key={p._id} className="p-3">
                <Link href={`/service-details?id=${p._id}`}>
                  <div className="bg-white rounded-[20px] overflow-hidden p-3.5 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative w-full h-[210px] mb-4 flex-shrink-0">
                      {p.servicesImage && p.servicesImage.length > 0 ? (
                        <img
                          src={p.servicesImage[0] || "/blog/blog1.jpg"}
                          className="w-full h-full object-cover rounded-[16px]"
                          alt={p.serviceName || p.name}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-orange-100 rounded-[16px] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🔧</div>
                            <p className="text-sm text-gray-600">
                              {p.serviceName}
                            </p>
                          </div>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 px-3 py-[3px] bg-[#A46CFF] text-white text-[12px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.20)]">
                        {p.serviceCategory || "Service"}
                      </span>
                      {p.yearsOfExperience && (
                        <span className="absolute top-3 left-3 px-3 py-[3px] bg-green-500 text-white text-[12px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.20)]">
                          {p.yearsOfExperience}
                        </span>
                      )}
                    </div>

                    {/* Name and Service */}
                    <div className="flex-grow">
                      <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-0.5">
                        {p.name || "Unnamed Provider"}
                      </h3>
                      <h4 className="text-[15px] font-medium text-purple-600 mb-2">
                        {p.serviceName}
                      </h4>

                      {/* Service Description */}
                      <p className="text-[13px] text-gray-600 mb-3 line-clamp-2">
                        {p.serviceDescription ||
                          "Professional service provider"}
                      </p>

                      {/* Location Details */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-[13px] text-[#6A6A6A] mb-1">
                          <LuMapPin className="text-[14px] flex-shrink-0" />
                          <span className="line-clamp-1">
                            {getLocationDisplay(p)}
                          </span>
                        </div>

                        {/* Detailed Location Info */}
                        {(p.country || p.region || p.city) && (
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 ml-6">
                            {p.city && (
                              <span className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {p.city}
                              </span>
                            )}
                            {p.region && p.region !== p.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {p.region}
                              </span>
                            )}
                            {p.country && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {p.country}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Service Info */}
                      <div className="mb-4 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Radius:</span>
                          <span className="font-medium">
                            {p.serviceRedius || "N/A"} km
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">
                            {p.yearsOfExperience || "Not specified"}
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center text-[14px] text-[#6A6A6A] mb-3">
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            className={`text-[15px] ${
                              i < 4 ? "text-[#FFA534]" : "text-[#E0E0E0]"
                            }`}
                          />
                        ))}
                        <span className="ml-1">4.5 (0 reviews)</span>
                      </div>
                    </div>

                    {/* Price and Button */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[12px] text-[#6B6B6B]">
                            Starting at
                          </p>
                          <p className="text-[20px] font-semibold text-[#F78D25]">
                            ${p.hourlyRate || 50}/hr
                          </p>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            p.workingDays && p.workingDays.length > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {p.workingDays && p.workingDays.length > 0
                            ? "Available"
                            : "Check availability"}
                        </div>
                      </div>

                      {/* Button */}
                      <button className="w-full py-3 text-[15px] font-medium text-white rounded-xl bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {filteredProviders.length > 0 && totalPages > 1 && (
          <div className="mt-12 px-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex} to {endIndex} of {totalProviders} entries
                  {hasURLParams &&
                    ` in ${countryParam || regionParam || cityParam}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </div>

                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                    className={`p-2 rounded-lg ${
                      page === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`p-2 rounded-lg ${
                      page === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (page <= 3) {
                        pageNumber = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            page === pageNumber
                              ? "bg-purple-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    {/* Ellipsis for many pages */}
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="px-1">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg ${
                      page === totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg ${
                      page === totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Go to Page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={page}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      if (newPage >= 1 && newPage <= totalPages) {
                        setPage(newPage);
                      }
                    }}
                    className="w-16 px-2 py-1.5 border border-gray-300 rounded text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Page Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Page {page} of {totalPages} • {limit} providers per page
              {hasURLParams && (
                <span className="ml-2 text-blue-600 font-medium">
                  • Filtered by URL parameters
                </span>
              )}
              {(serviceFilter !== "all" || searchQuery) && !hasURLParams && (
                <span className="ml-2 text-purple-600">• Filtered results</span>
              )}
            </div>

            {/* Clear Filters Button at Bottom */}
            {(serviceFilter !== "all" || searchQuery || hasURLParams) && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setServiceFilter("all");
                    setSearchQuery("");
                    if (hasURLParams) clearAllLocationFilters();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400"
                >
                  <X className="w-4 h-4" />
                  Clear all filters and show all providers
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


import React from 'react';

const AllServiceProviders = () => {
  return (
    <div>

      <Suspense fallback={<>Loading...</>}>
        <AllServiceProvidersPage/>
      </Suspense>
      
    </div>
  );
};

export default AllServiceProviders;
