"use client";

import { useGetBlogsQuery } from "@/feature/admin/AdminBlogApi";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

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

export default function LatestArticles() {
  const { data: blogData, isLoading, isError } = useGetBlogsQuery();
  const blogs = blogData?.data || [];
  
  // Track failed images
  const [failedImages, setFailedImages] = useState({});

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
    return categoryColors[category] || "#AC65EE";
  };

  // Handle image error
  const handleImageError = (blogId) => {
    setFailedImages(prev => ({
      ...prev,
      [blogId]: true
    }));
  };

  // Get image source
  const getImageSrc = (blog) => {
    if (failedImages[blog._id]) {
      return "/blog/blog1.jpg"; // Fallback image
    }
    
    if (!blog.img || blog.img.includes('cdn.example.com') || blog.img.includes('placehold.co')) {
      return "/blog/blog1.jpg";
    }
    
    // Check if image URL is valid
    if (blog.img && (blog.img.startsWith('http') || blog.img.startsWith('https'))) {
      return blog.img;
    }
    
    return "/blog/blog1.jpg";
  };

  if (isLoading) {
    return (
      <div className="bg-[#F5F5F7] pt-1 pb-10">
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
            Latest Articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[20px] overflow-hidden p-4 border border-[#EAEAEA] animate-pulse"
              >
                <div className="w-full h-60 bg-gray-200 rounded-xl mb-4"></div>
                <div className="py-4 space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#F5F5F7] pt-1 pb-10">
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
            Latest Articles
          </h2>
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load articles. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-[#F5F5F7] pt-1 pb-10">
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
            Latest Articles
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort by latest date (createdAt)
  const sortedBlogs = [...blogs].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Take only first 9 blogs
  const displayBlogs = sortedBlogs.slice(0, 9);

  return (
    <div className="bg-[#F5F5F7] pt-1 pb-10">
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Latest Articles
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayBlogs.map((blog) => {
            const imageSrc = getImageSrc(blog);
            
            return (
              <div
                key={blog._id}
                className="bg-white rounded-[20px] overflow-hidden p-4 border border-[#EAEAEA] "
              >
                {/* Image */}
                <div className="relative w-full h-60">
                  {!failedImages[blog._id] ? (
                    <Image
                      src={imageSrc}
                      alt={blog.title}
                      fill
                      className="object-cover rounded-xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() => handleImageError(blog._id)}
                      unoptimized={imageSrc.includes('cdn.example.com') || imageSrc.includes('placehold.co')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-orange-50 rounded-xl">
                      <div className="text-center">
                        <span className="text-3xl">📝</span>
                        <p className="text-sm text-gray-600 mt-2">{blog.category}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="py-4">
                  <p
                    className="text-[14px] font-medium mb-1"
                    style={{ color: getCategoryColor(blog.category) }}
                  >
                    {blog.category}
                  </p>

                  <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="mt-2 text-[14px] leading-relaxed line-clamp-3 text-gray-600">
                    {blog.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[14px]">
                    <p className="text-gray-500">
                      {formatDate(blog.createdAt)}
                    </p>
                    <Link 
                      href={`/blog/${blog._id}`}
                      className="font-medium text-[#F88D25] hover:underline flex items-center gap-1"
                    >
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        {blogs.length > 9 && (
          <div className="text-center mt-10">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              View All Articles
              <FaArrowRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}