'use client'
import { useSingleBlogQuery } from '@/feature/admin/AdminBlogApi';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa';
import Link from 'next/link';

const categoryColors = {
  "Planning": "#7C3AED",
  "Community": "#EC4899",
  "AI & ML": "#3B82F6",
  "DevOps": "#F97316",
  "UI/UX": "#22C55E",
  "Database": "#6366F1",
  "Testing": "#0EA5E9",
  "Security": "#3B82F6",
  "Tips & Guides": "#7C3AED",
  "Shopping": "#3B82F6",
  "Home & Living": "#F97316",
  "Sustainability": "#22C55E",
  "Technology": "#6366F1",
  "Safety & Security": "#0EA5E9"
};

const BlogDetailspage = () => {
  const params = useParams();
  const id = params?.id;
  
  const { data: blogResponse, isLoading, isError } = useSingleBlogQuery(id);
  const [imageError, setImageError] = useState(false);
  
  const singleBlog = blogResponse?.data;
  
  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Recent";
    }
  };

  // Get color for category
  const getCategoryColor = (category) => {
    return categoryColors[category ] || "#AC65EE";
  };

  // Get image source
  const getImageSrc = () => {
    if (imageError || !singleBlog?.img || 
        singleBlog.img.includes('cdn.example.com') || 
        singleBlog.img.includes('placehold.co')) {
      return "/blog/blog1.jpg";
    }
    
    if (singleBlog.img && (singleBlog.img.startsWith('http') || singleBlog.img.startsWith('https'))) {
      return singleBlog.img;
    }
    
    return "/blog/blog1.jpg";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Blog Content Skeleton */}
          <div className="bg-white rounded-[20px] overflow-hidden p-6 border border-[#EAEAEA] animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-96 bg-gray-200 rounded-xl mb-6"></div>
            
            {/* Category Skeleton */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            
            {/* Title Skeleton */}
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            
            {/* Meta Info Skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !singleBlog) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[#F88D25] font-medium mb-8 hover:underline"
          >
            <FaArrowLeft /> Back to Articles
          </Link>
          
          <div className="bg-white rounded-[20px] overflow-hidden p-8 border border-[#EAEAEA] text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Article Not Found
            </h2>
            <p className="text-gray-600 mb-6">
        {    `  The article you're looking for doesn't exist or has been removed.`}
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse All Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-[#F88D25] font-medium mb-8 hover:underline"
        >
          <FaArrowLeft /> Back to Articles
        </Link>
        
        {/* Blog Content */}
        <div className="bg-white rounded-[20px] overflow-hidden p-6 border border-[#EAEAEA]">
          {/* Blog Image */}
          <div className="relative w-full h-96 mb-6">
            <Image
              src={getImageSrc()}
              alt={singleBlog.title}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              onError={() => setImageError(true)}
              unoptimized={getImageSrc().includes('cdn.example.com') || getImageSrc().includes('placehold.co')}
            />
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${getCategoryColor(singleBlog.category)}20`,
                color: getCategoryColor(singleBlog.category)
              }}
            >
              <FaTag /> {singleBlog.category}
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {singleBlog.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#F88D25]" />
              <span className="text-sm">
                {formatDate(singleBlog.createdAt || new Date().toISOString())}
              </span>
            </div>
            
            {/* Add author or other info if available */}
            {singleBlog.author && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9838E1] to-[#F68E44]"></div>
                <span className="text-sm">{singleBlog.author}</span>
              </div>
            )}
          </div>
          
          {/* Blog Content */}
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {singleBlog.description ? (
                singleBlog.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-base md:text-lg">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-base md:text-lg">
                  {singleBlog.description || "No content available."}
                </p>
              )}
            </div>
            
            {/* Additional content sections if available */}
            {singleBlog.content && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">In-Depth Analysis</h2>
                <div className="text-gray-700 leading-relaxed">
                  {singleBlog.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-base md:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags if available */}
            {singleBlog.tags && singleBlog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {singleBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Found this article helpful? Share it with others!
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse More Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailspage;