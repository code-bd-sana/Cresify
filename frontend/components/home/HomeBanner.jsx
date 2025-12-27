"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoChevronDownOutline, IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import { useAllLocationQuery } from "@/feature/ProductApi";
import { useTranslation } from "react-i18next"; // Add this import
import { usePathname } from "next/navigation"; // Add this import

export default function HomeBanner() {
  const [filters, setFilters] = useState({
    country: "",
    region: "",
    city: ""
  });

  // Local states for search in dropdowns
  const [countrySearch, setCountrySearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  // Fetch location data
  const { data: locationData, isLoading, isError } = useAllLocationQuery();
  
  // Translation hook
  const { t, i18n } = useTranslation("home"); // Use "home" namespace
  const pathname = usePathname();

  // Extract current locale from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale = ["en", "es"].includes(pathSegments[0]) ? pathSegments[0] : "en";

  // Extract data from API response
  const countries = locationData?.data?.countries || [];
  const regions = locationData?.data?.regions || [];
  const cities = locationData?.data?.cities || [];
  const locations = locationData?.data?.locations || [];

  // Filter options based on search
  const filteredCountries = countries.filter(country => 
    typeof country === 'string' ? 
    country.toLowerCase().includes(countrySearch.toLowerCase()) :
    country.name?.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredRegions = regions.filter(region => 
    typeof region === 'string' ? 
    region.toLowerCase().includes(regionSearch.toLowerCase()) :
    region.name?.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const filteredCities = cities.filter(city => 
    typeof city === 'string' ? 
    city.toLowerCase().includes(citySearch.toLowerCase()) :
    city.name?.toLowerCase().includes(citySearch.toLowerCase())
  );

  const updateFilter = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear search when dropdown closes
  const clearSearches = () => {
    setCountrySearch("");
    setRegionSearch("");
    setCitySearch("");
  };

  // Build query string from filters with locale
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (filters.country) params.append('country', filters.country);
    if (filters.region) params.append('region', filters.region);
    if (filters.city) params.append('city', filters.city);
    
    return params.toString() ? `?${params.toString()}` : '';
  };

  // Create localized href
  const createLocalizedHref = (path) => {
    if (path.startsWith(`/${currentLocale}`)) {
      return path;
    }
    return `/${currentLocale}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return (
    <section
      className="
      w-full 
      min-h-[650px]
      bg-[linear-gradient(135deg,#F5EEFB_0%,#FFFFFF_100%)]
      px-6 sm:px-10 md:px-16 lg:px-24 
      py-10 md:py-14 lg:py-20
    "
    >
      <div
        className="
        max-w-[1320px] mx-auto 
        flex flex-col lg:flex-row 
        items-center lg:items-start 
        justify-between 
        gap-10 lg:gap-0
      "
      >
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[45%]">
          {/* Heading */}
          <h1
            className="
            text-[32px] sm:text-[38px] md:text-[45px] lg:text-[52px]
            font-semibold 
            leading-[40px] sm:leading-[48px] md:leading-[55px] lg:leading-[62px]
            tracking-[-0.5px]
            text-[#1E1E1E]
            mb-5
          "
          >
            {t("title_line1")} <br className="hidden lg:block" />
            {t("title_line2")} <br className="hidden lg:block" />
            {t("title_line3")}
          </h1>

          {/* Subtext */}
          <p
            className="
            text-[15px] md:text-[16px]
            leading-[24px] md:leading-[26px]
            text-[#AC65EE]
            w-full md:w-[390px]
            mb-10
          "
          >
            {t("subtitle")}
          </p>

          {/* Glass Card */}
          <div
            className="
            w-full sm:w-[380px] md:w-[420px] lg:w-[440px]
            rounded-[24px]
            px-[22px] sm:px-[26px]
            py-[22px] sm:py-[26px]
            backdrop-blur-[18px]
            bg-[linear-gradient(145deg,rgba(241,231,255,0.55)_0%,rgba(238,220,255,0.45)_35%,rgba(255,229,209,0.40)_100%)]
            shadow-[0_12px_32px_rgba(0,0,0,0.18)]
          "
          >
            <p
              className="
              text-[14px] sm:text-[15px] 
              font-semibold mb-4
              bg-gradient-to-r from-[#F78D25] to-[#9838E1]
              text-transparent bg-clip-text
            "
            >
              {t("select_location")}
            </p>

            <EnhancedDropdown 
              label={t("country")} 
              placeholder={isLoading ? t("loading_countries") : t("select_country")}
              value={filters.country}
              onChange={(value) => updateFilter('country', value)}
              options={filteredCountries}
              searchValue={countrySearch}
              onSearchChange={setCountrySearch}
              onClose={clearSearches}
              isLoading={isLoading}
              isError={isError}
              t={t}
              itemType="countries"
            />
            
            <EnhancedDropdown 
              label={t("region")} 
              placeholder={isLoading ? t("loading_regions") : t("select_region")}
              value={filters.region}
              onChange={(value) => updateFilter('region', value)}
              options={filteredRegions}
              searchValue={regionSearch}
              onSearchChange={setRegionSearch}
              onClose={clearSearches}
              isLoading={isLoading}
              isError={isError}
              t={t}
              itemType="regions"
            />
            
            <EnhancedDropdown 
              label={t("city")} 
              placeholder={isLoading ? t("loading_cities") : t("select_city")}
              value={filters.city}
              onChange={(value) => updateFilter('city', value)}
              options={filteredCities}
              searchValue={citySearch}
              onSearchChange={setCitySearch}
              onClose={clearSearches}
              isLoading={isLoading}
              isError={isError}
              t={t}
              itemType="cities"
            />
          </div>

          {/* Buttons */}
          <div
            className="
            flex flex-col sm:flex-row 
            items-start sm:items-center 
            gap-3 
            mt-6
          "
          >
            {/* Explore Marketplace with query parameters */}
            <Link 
              href={createLocalizedHref(`/marketplace${buildQueryString()}`)}
              className="w-full sm:w-auto"
            >
              <button
                disabled={isLoading}
                className="
                h-[38px] px-6 text-[14px] font-medium 
                text-white 
                rounded-[10px] 
                bg-gradient-to-r from-[#9838E1] to-[#F68E44] 
                shadow-[0px_3px_10px_rgba(0,0,0,0.08)]
                w-full
                hover:opacity-90 transition-opacity
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              >
                {isLoading ? t("loading") : t("explore_marketplace")}
              </button>
            </Link>

            {/* Browse Services with query parameters */}
            <Link 
              href={createLocalizedHref(`/services${buildQueryString()}`)}
              className="w-full sm:w-auto"
            >
              <button
                disabled={isLoading}
                className="
                h-[38px] px-6 text-[14px] font-bold 
                text-[#A140D0] 
                rounded-[10px] border-2 border-[#A140D0]
                bg-white hover:bg-[#F8F8F8]
                w-full
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              >
                {t("browse_services")}
              </button>
            </Link>
          </div>

          {/* Filter status display */}
          {Object.values(filters).some(value => value) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">{t("active_filters")}:</span>
                {filters.country && ` ${t("country")}: ${filters.country}`}
                {filters.region && ` | ${t("region")}: ${filters.region}`}
                {filters.city && ` | ${t("city")}: ${filters.city}`}
              </p>
              <button
                onClick={() => {
                  setFilters({ country: "", region: "", city: "" });
                  clearSearches();
                }}
                className="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                {t("clear_all_filters")}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-full lg:w-[55%] flex justify-center">
          <Image
            src="/Home/HomeRightIMG.png"
            width={649}
            height={649}
            alt="Marketplace"
            className="
              rounded-[22px] 
              w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[649px]
            "
          />
        </div>
      </div>
    </section>
  );
}

/* ----------- Enhanced Dropdown with Search ---------------- */
function EnhancedDropdown({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  options = [], 
  searchValue, 
  onSearchChange, 
  onClose,
  isLoading = false,
  isError = false,
  t, // Translation function passed from parent
  itemType = "" // countries, regions, cities
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onSearchChange(""); // Clear search when closing
    onClose?.();
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    handleClose();
  };

  const extractName = (option) => {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') {
      return option.name || option.value || String(option);
    }
    return String(option);
  };

  // Get placeholder text for search
  const getSearchPlaceholder = () => {
    if (itemType === "countries") return t("search_country");
    if (itemType === "regions") return t("search_region");
    if (itemType === "cities") return t("search_city");
    return `Search ${label.toLowerCase()}...`;
  };

  // Get no results message
  const getNoResultsMessage = () => {
    if (searchValue) {
      return t("no_results", { 
        item: itemType, 
        search: searchValue 
      });
    }
    
    // Default no items message
    if (itemType === "countries") return t("no_countries");
    if (itemType === "regions") return t("no_regions");
    if (itemType === "cities") return t("no_cities");
    return `No ${itemType} available`;
  };

  return (
    <div className="mb-3 relative">
      <label className="block text-[13px] text-[#6B6B6B] mb-1">{label}</label>

      <div
        onClick={handleOpen}
        className="
          border border-[#E1E1E1] 
          bg-white 
          rounded-[10px] 
          px-4 py-[10px]
          text-[14px] 
          text-[#575757] 
          cursor-pointer 
          relative
          hover:border-[#A140D0] transition-colors
          min-h-[42px] flex items-center
        "
      >
        {value || placeholder}

        <IoChevronDownOutline
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#7A7A7A] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div
          className="
            absolute 
            w-full 
            left-0 mt-1 
            bg-white 
            border border-[#EAEAEA]
            rounded-[10px]
            shadow-[0_4px_18px_rgba(0,0,0,0.12)]
            z-50
            overflow-hidden
          "
        >
          {/* Search Input */}
          <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={getSearchPlaceholder()}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9838E1]/40"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#9838E1] mx-auto"></div>
                <p className="text-xs text-gray-500 mt-2">{t("loading")}</p>
              </div>
            ) : isError ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-red-500">Failed to load {label.toLowerCase()}</p>
                <button 
                  className="mt-2 text-xs text-blue-600 hover:underline"
                  onClick={handleClose}
                >
                  {t("close")}
                </button>
              </div>
            ) : options.length === 0 ? (
              <div className="px-4 py-8 text-center">
                {searchValue ? (
                  <>
                    <p className="text-sm text-gray-500">
                      {getNoResultsMessage()}
                    </p>
                    <button 
                      className="mt-2 text-xs text-blue-600 hover:underline"
                      onClick={() => onSearchChange("")}
                    >
                      {t("clear_search")}
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    {getNoResultsMessage()}
                  </p>
                )}
              </div>
            ) : (
              <>
                {options.slice(0, 50).map((option, i) => {
                  const optionName = extractName(option);
                  const optionCount = option.count || 0;
                  
                  return (
                    <div
                      key={i}
                      className="px-4 py-3 text-[14px] hover:bg-[#F5F5F5] cursor-pointer border-b border-gray-50 last:border-b-0 flex justify-between items-center"
                      onClick={() => handleSelect(optionName)}
                    >
                      <span className={value === optionName ? "font-semibold text-[#9838E1]" : ""}>
                        {optionName}
                      </span>
                      {optionCount > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {optionCount}
                        </span>
                      )}
                    </div>
                  );
                })}
                
                {options.length > 50 && (
                  <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
                    Showing 50 of {options.length} {label.toLowerCase()}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with close button */}
          <div className="sticky bottom-0 bg-white p-2 border-t border-gray-100">
            <button
              onClick={handleClose}
              className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
      )}
    </div>
  );
}