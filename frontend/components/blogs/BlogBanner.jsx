"use client";

import { useGetBlogsQuery } from "@/feature/admin/AdminBlogApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BlogBanner() {
  const { t, i18n } = useTranslation();
  const { data: blogData, isLoading, isError } = useGetBlogsQuery();
  const blogs = blogData?.data || [];
  const [imageError, setImageError] = useState(false);

  // Fixed format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);

      // Always get month in English for consistent translation keys
      const englishMonth = date.toLocaleDateString("en-US", { month: "long" });
      const monthKey = englishMonth.toLowerCase();

      const day = date.getDate();
      const year = date.getFullYear();

      return t("blog:common.dateFormats.full", {
        month: t(`blog:common.months.${monthKey}`, {
          defaultValue: englishMonth, // Fallback to English if translation not found
        }),
        day,
        year,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return t("blog:banner.default.author");
    }
  };

  // Get featured blog (first blog from the array)
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;

  // Get image source
  const getImageSrc = () => {
    if (
      imageError ||
      !featuredBlog?.img ||
      featuredBlog.img.includes("cdn.example.com") ||
      featuredBlog.img.includes("placehold.co")
    ) {
      return "/blog/blog-banner.jpg";
    }

    if (
      featuredBlog.img &&
      (featuredBlog.img.startsWith("http") ||
        featuredBlog.img.startsWith("https"))
    ) {
      return featuredBlog.img;
    }

    return "/blog/blog-banner.jpg";
  };

  // Get category name with translation
  const getCategoryName = (category) => {
    if (!category) return t("blog:banner.featuredBadge");

    const translatedCategory = t(`blog:latestArticles.categories.${category}`, {
      defaultValue: category,
    });
    return translatedCategory || category || t("blog:banner.featuredBadge");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] p-[4px] mb-12 shadow-md'>
        <div className='bg-white rounded-2xl overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {/* Left Image Skeleton */}
            <div className='relative w-full h-[380px] lg:h-[600px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-l-2xl' />

            {/* Right Content Skeleton */}
            <div className='p-8 flex flex-col justify-center'>
              <div className='w-32 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse' />
              <div className='mt-4 space-y-3'>
                <div className='h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-3/4' />
                <div className='h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-2/3' />
                <div className='h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-1/2' />
              </div>
              <div className='mt-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-48' />
              <div className='mt-6 w-48 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or no data state
  if (isError || !featuredBlog) {
    return (
      <div className='max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] p-[4px] mb-12 shadow-md'>
        <div className='bg-white rounded-2xl overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {/* Left Image - Fallback */}
            <div className='relative w-full h-[380px] lg:h-[600px]'>
              <Image
                src='/blog/blog-banner.jpg'
                alt={t("blog:common.placeholders.imageAlt")}
                fill
                className='object-cover rounded-l-2xl'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
            </div>

            {/* Right Content - Fallback */}
            <div className='p-8 flex flex-col justify-center'>
              <span className='px-6 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white w-max'>
                {t("blog:banner.featuredBadge")}
              </span>

              <h1 className='mt-4 text-[40px] font-bold leading-tight text-gray-900'>
                {t("blog:banner.default.title")}
              </h1>

              <p className='mt-4 text-[15px] w-2/3 text-[#AC65EE] leading-relaxed font-medium'>
                {t("blog:banner.default.description")}
              </p>

              <div className='flex items-center gap-3 text-base text-[#525252] mt-4'>
                <span>{t("blog:banner.default.author")}</span>
                <span>•</span>
                <span>{formatDate(new Date().toISOString())}</span>
              </div>

              <Link
                href='/blog'
                className='mt-6 w-max px-10 py-4 text-white rounded-lg font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow-sm hover:opacity-90 transition inline-block'>
                {t("blog:banner.default.browseButton")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] p-[4px] mb-12 shadow-md'>
      {/* Inner white card */}
      <div className='bg-white rounded-2xl overflow-hidden'>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          {/* Left Image */}
          <div className='relative w-full h-[380px] lg:h-[600px]'>
            <Image
              src={getImageSrc()}
              alt={featuredBlog.title || t("blog:common.placeholders.imageAlt")}
              fill
              className='object-cover rounded-l-2xl'
              onError={() => setImageError(true)}
              sizes='(max-width: 1024px) 100vw, 50vw'
              unoptimized={
                getImageSrc().includes("cdn.example.com") ||
                getImageSrc().includes("placehold.co")
              }
            />
          </div>

          {/* Right Content */}
          <div className='p-8 flex flex-col justify-center'>
            {/* Badge - Using blog category */}
            <span className='px-6 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white w-max'>
              {getCategoryName(featuredBlog.category)}
            </span>

            {/* Title */}
            <h1 className='mt-4 text-[40px] font-bold leading-tight text-gray-900'>
              {featuredBlog.title || t("blog:banner.default.title")}
            </h1>

            {/* Description */}
            <p className='mt-4 text-[15px] w-2/3 text-[#AC65EE] leading-relaxed font-medium'>
              {featuredBlog.description || t("blog:banner.default.description")}
            </p>

            {/* Author + Date */}
            <div className='flex items-center gap-3 text-base text-[#525252] mt-4'>
              <span>{t("blog:banner.default.author")}</span>
              <span>•</span>
              <span>
                {formatDate(featuredBlog.createdAt || new Date().toISOString())}
              </span>
            </div>

            {/* Read Button */}
            <Link
              href={`/blog/${featuredBlog._id}`}
              className='mt-6 w-max px-10 py-4 text-white rounded-lg font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow-sm hover:opacity-90 transition inline-block'>
              {t("blog:banner.readButton")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
