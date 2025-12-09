"use client";
import {
  useCreateBlogMutation,
  useEditBlogMutation,
  useGetBlogsQuery,
} from "@/feature/admin/AdminBlogApi";
import {
  ArrowRightIcon,
  ChevronDown,
  PencilLine,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const ArticlesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);

  // API Hooks
  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetBlogsQuery({ page, limit: 9 });
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [editBlog, { isLoading: isEditing }] = useEditBlogMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const categories = [
    "Sustainability",
    "Community",
    "Planning",
    "Tips & Guides",
    "Shopping",
    "Home & Living",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleEditArticle = (article, index) => {
    setEditingArticle({ ...article, index });
    setTitle(article.title);
    setCategory(article.category);
    setDetails(article.description);
    setImage(null); // Reset image, or set to article.image if you want to show existing
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!title || !category || !details) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill in all required fields",
        });
        return;
      }

      const blogData = {
        title,
        category,
        description: details,
        img: image || "https://placehold.co/362x240/8736C5/white?text=Blog",
      };

      if (editingArticle) {
        // Update existing blog
        const result = await editBlog({
          id: editingArticle._id,
          ...blogData,
        }).unwrap();

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Blog updated successfully",
          timer: 2000,
        });
      } else {
        // Create new blog
        const result = await createBlog(blogData).unwrap();

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Blog created successfully",
          timer: 2000,
        });
      }

      // Reset form and close modal
      setTitle("");
      setCategory("");
      setDetails("");
      setImage(null);
      setEditingArticle(null);
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to save blog",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setTitle("");
    setCategory("");
    setDetails("");
    setImage(null);
    setEditingArticle(null);
  };

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setTitle("");
    setCategory("");
    setDetails("");
    setImage(null);
    setIsModalOpen(true);
  };

  return (
    <div className='p-6 bg-gray-50 relative'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-gray-800'>All Articles</h1>
        <button
          onClick={handleOpenCreateModal}
          className='px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg cursor-pointer transition hover:shadow-lg'>
          + Add Articles
        </button>
      </div>

      {/* Loading State */}
      {isLoading && page === 1 && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-lg text-gray-600'>Loading articles...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-lg text-red-600'>
            Failed to load articles. Please try again.
          </div>
        </div>
      )}

      {/* Empty State - No Blogs Found */}
      {!isLoading && !error && blogsData?.data?.length === 0 && (
        <div className='flex flex-col justify-center items-center py-20'>
          <div className='text-6xl mb-4'>📝</div>
          <h3 className='text-2xl font-semibold text-gray-800 mb-2'>
            No Articles Found
          </h3>
          <p className='text-gray-600 mb-6'>
            Start creating your first article to share with your audience.
          </p>
        </div>
      )}

      {/* Articles Grid */}
      {!isLoading && blogsData?.data && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {blogsData.data.map((article, index) => (
              <div className='relative' key={article._id || index}>
                {/* Edit Icon Overlay */}
                <div
                  onClick={() => handleEditArticle(article, index)}
                  className='absolute top-[11px] right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg z-1'>
                  <PencilLine className='w-5 h-5 text-[#3881E1]' />
                </div>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden p-5'>
                  <div className='w-full h-48 overflow-hidden rounded-lg pb-4 relative group'>
                    <Image
                      src={
                        article.img ||
                        `https://placehold.co/362x240/8736C5/white?text=Article+${
                          index + 1
                        }`
                      }
                      alt={article.title}
                      width={362}
                      height={240}
                      className='w-full h-full object-cover rounded-lg'
                      unoptimized
                    />
                  </div>
                  <p className='text-sm text-[#AC65EE] font-semibold mb-3'>
                    {article.category}
                  </p>
                  <div>
                    <h3
                      className='text-lg font-bold text-gray-900 single-line-ellipsis'
                      title={article.title}>
                      {article.title}
                    </h3>
                    <p className='text-sm text-[#000000] mt-2 two-line-ellipsis'>
                      {article.description}
                    </p>
                    <div className='flex justify-between items-center mt-4'>
                      <span className='text-sm text-gray-400'>
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <a
                        href='#'
                        className='text-sm text-[#F78D25] transition flex items-center gap-2'>
                        Read More <ArrowRightIcon className='w-6 h-6' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {blogsData?.pagination?.hasMore && (
            <div className='flex justify-center mt-8'>
              <button
                onClick={() => setPage(page + 1)}
                disabled={isLoading}
                className='px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg transition cursor-pointer hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Article Modal */}
      {isModalOpen && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn'
          onClick={handleCloseModal}>
          <div
            className='bg-white rounded-lg  w-full max-h-[90vh] overflow-y-auto animate-slideIn shadow-2xl max-w-[90vw] md:max-w-[60vw] lg:max-w-[40vw]'
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className='mb-4 pt-6 px-6 border-[#E2E8F0]'>
              <div className='flex items-center justify-between w-full'>
                <h2 className='text-2xl font-semibold text-gray-800'>
                  {editingArticle ? "Edit Article" : "Add Articles"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className='text-gray-400 hover:text-gray-600 transition cursor-pointer'>
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>
            <hr className='w-[96%] mx-auto border-[#E2E8F0]' />

            {/* Articles Image */}
            <div className='mb-4 px-6 pt-4'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>
                Articles Image
              </label>
              <div className='border-dashed border-2 border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition bg-gray-50'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                  id='file-upload'
                />
                <label htmlFor='file-upload' className='cursor-pointer'>
                  <div className='flex flex-col items-center'>
                    {image ? (
                      <div className='relative w-full h-32 mb-2'>
                        <Image
                          src={image}
                          alt='Article Preview'
                          fill
                          className='object-cover rounded-lg'
                        />
                      </div>
                    ) : (
                      <>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3'>
                          <Upload className='w-6 h-6 text-purple-600' />
                        </div>
                        <p className='text-sm text-purple-600 font-medium mb-1'>
                          Click to upload image
                        </p>
                      </>
                    )}
                    <p className='text-xs text-gray-500'>PNG, JPG up to 15MB</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Title and Category - Two Columns */}
            <div className='grid grid-cols-2 gap-4 mb-4 px-6'>
              {/* Title */}
              <div>
                <label
                  className='block text-gray-700 text-sm font-medium mb-2'
                  htmlFor='title'>
                  Title name
                </label>
                <input
                  id='title'
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter your title name'
                  className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition'
                />
              </div>

              {/* Category */}
              <div>
                <label
                  className='block text-gray-700 text-sm font-medium mb-2'
                  htmlFor='category'>
                  Category
                </label>
                <div className='relative' ref={dropdownRef}>
                  <button
                    type='button'
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition text-left flex items-center justify-between bg-white'>
                    <span
                      className={category ? "text-gray-900" : "text-gray-400"}>
                      {category || "Select Category"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-slideDown'>
                      {/* Gradient Header */}
                      <div className='bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] px-4 py-2 flex items-center justify-between'>
                        <span className='text-white font-semibold text-sm'>
                          Select Category
                        </span>
                        <svg
                          className='w-5 h-5 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      </div>

                      {/* Options */}
                      <div className='max-h-48 overflow-y-auto'>
                        {categories.map((cat, index) => (
                          <button
                            key={index}
                            type='button'
                            onClick={() => {
                              setCategory(cat);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition text-gray-800 border-b border-gray-100 last:border-b-0 cursor-pointer ${
                              category === cat ? "bg-purple-50" : ""
                            }`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className='px-6 pb-4'>
              <label
                className='block text-gray-700 text-sm font-medium mb-2'
                htmlFor='details'>
                Details
              </label>
              <textarea
                id='details'
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder='Details Details..'
                rows='4'
                className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition resize-none'
              />
            </div>
            <hr className='w-[96%] mx-auto border-[#E2E8F0]' />
            <div className='pb-6 pt-4 px-6'>
              {/* Buttons */}
              <div className='flex justify-end gap-3'>
                <button
                  onClick={handleCloseModal}
                  className='px-6 py-2 text-sm bg-white border border-[#F78D25] text-[#F78D25] rounded-lg hover:bg-gray-50 transition cursor-pointer'>
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className='px-6 py-2 text-sm bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg hover:shadow-lg transition cursor-pointer'>
                  {editingArticle ? "Update Article" : "Upload Article"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
