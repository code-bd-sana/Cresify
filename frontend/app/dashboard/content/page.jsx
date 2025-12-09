"use client";
import { ArrowRightIcon, ChevronDown, PencilLine, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ArticlesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");

  const categories = [
    "Sustainability",
    "Community",
    "Planning",
    "Tips & Guides",
    "Shopping",
    "Home & Living",
  ];

  const articles = [
    {
      title: "10 Tips for Managing Your Digital Marketing Services",
      category: "Digital Marketing",
      description:
        "Discover how to choose the right service provider for your needs with expert guidance. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ",
      date: "March 15, 2024",
    },
    {
      title: "Supporting Local Businesses: Why It Matters",
      category: "Business",
      description:
        "Learn about the impact of shopping local and how it benefits your community.",
      date: "March 12, 2024",
    },
    {
      title: "How to Get the Most of Online Marketplaces",
      category: "Online Marketplaces",
      description:
        "Maximize your shopping experience with these proven strategies and insider tips.",
      date: "March 10, 2024",
    },
    {
      title: "Home Maintenance: Essential Services Every Home Needs",
      category: "Home Maintenance",
      description:
        "Explore must-have services for maintaining your home, from cleaning to repairs.",
      date: "March 11, 2024",
    },
    {
      title: "The Rise of Eco-Friendly Products in Latin America",
      category: "Eco-Friendly Products",
      description:
        "Explore the growing trend of sustainable and eco-friendly products in Latin America.",
      date: "March 13, 2024",
    },
    {
      title: "How to Get the Most of Online Marketplaces",
      category: "Online Marketplaces",
      description:
        "Understanding the best strategies for buying and selling on online platforms.",
      date: "March 10, 2024",
    },
    {
      title: "Seasonal Services: What You Need and When",
      category: "Seasonal Services",
      description:
        "A seasonal guide to maintaining your home with the best services throughout the year.",
      date: "March 15, 2024",
    },
    {
      title: "Building Trust in Online Marketplaces",
      category: "Online Marketplaces",
      description:
        "Learn how to ensure security and build trust with your buyers and sellers online.",
      date: "March 12, 2024",
    },
    {
      title: "Customer Reviews: How to Write Helpful Reviews",
      category: "Customer Reviews",
      description:
        "Guide on how to write reviews that help others make informed decisions.",
      date: "March 10, 2024",
    },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted with:", { title, category, details, image });
    // Reset form and close modal
    setTitle("");
    setCategory("");
    setDetails("");
    setImage(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setTitle("");
    setCategory("");
    setDetails("");
    setImage(null);
  };

  return (
    <div className='p-6 bg-gray-50 relative'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-gray-800'>All Articles</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg cursor-pointer transition hover:shadow-lg'>
          + Add Articles
        </button>
      </div>

      {/* Articles Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {articles.map((article, index) => (
          <div className='relative' key={index}>
            {/* Edit Icon Overlay */}
            <div className='absolute top-[11px] right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg z-1'>
              <PencilLine className='w-5 h-5 text-[#3881E1]' />
            </div>
            <div className='bg-white rounded-lg shadow-lg overflow-hidden p-5'>
              <div className='w-full h-48 overflow-hidden rounded-lg pb-4 relative group'>
                <Image
                  src={`https://placehold.co/362x240/8736C5/white?text=Article+${
                    index + 1
                  }`}
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
                <h3 className='text-lg font-bold text-gray-900'>
                  {article.title}
                </h3>
                <p className='text-sm text-[#000000] mt-2 two-line-ellipsis'>
                  {article.description}
                </p>
                <div className='flex justify-between items-center mt-4'>
                  <span className='text-sm text-gray-400'>{article.date}</span>
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

      {/* View All Button */}
      <div className='flex justify-center mt-8'>
        <button className='px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg transition cursor-pointer hover:shadow-lg'>
          View All
        </button>
      </div>

      {/* Add Article Modal */}
      {isModalOpen && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn '
          onClick={handleCloseModal}>
          <div
            className='bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideIn shadow-2xl'
            onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                Add Articles
              </h2>
              <button
                onClick={handleCloseModal}
                className='text-gray-400 hover:text-gray-600 text-3xl transition cursor-pointer'>
                <X className='w-6 h-6' />
              </button>
            </div>

            <div className='mb-6'>
              <label className='block text-gray-700 font-medium mb-2'>
                Articles Image
              </label>
              <div className='border-dashed border-2 border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                  id='file-upload'
                />
                <label
                  htmlFor='file-upload'
                  className='cursor-pointer text-purple-600 hover:text-purple-700'>
                  <div>
                    {image ? (
                      <div className='relative w-full h-48 mb-4'>
                        <Image
                          src={image}
                          alt='Article Preview'
                          fill
                          className='object-cover rounded-lg'
                        />
                      </div>
                    ) : (
                      <div className='text-lg mb-4 text-gray-600'>
                        Click to upload image
                      </div>
                    )}
                    <p className='text-sm text-gray-500'>PNG, JPG up to 15MB</p>
                  </div>
                </label>
              </div>
            </div>

            <div className='mb-6'>
              <label
                className='block text-gray-700 font-medium mb-2'
                htmlFor='title'>
                Title
              </label>
              <input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter your title name'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition'
              />
            </div>

            <div className='mb-6'>
              <label
                className='block text-gray-700 font-medium mb-2'
                htmlFor='category'>
                Category
              </label>
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition text-left flex items-center justify-between bg-white'>
                  <span
                    className={category ? "text-gray-900" : "text-gray-400"}>
                    {category || "Select Category"}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-slideDown'>
                    {/* Gradient Header */}
                    <div className='bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] p-4 flex items-center justify-between'>
                      <span className='text-white font-semibold text-lg'>
                        Select Category
                      </span>
                      <svg
                        className='w-6 h-6 text-white'
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
                    <div className='max-h-60 overflow-y-auto'>
                      {categories.map((cat, index) => (
                        <button
                          key={index}
                          type='button'
                          onClick={() => {
                            setCategory(cat);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition text-gray-800 border-b border-gray-100 last:border-b-0 cursor-pointer ${
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

            <div className='mb-6'>
              <label
                className='block text-gray-700 font-medium mb-2'
                htmlFor='details'>
                Details
              </label>
              <textarea
                id='details'
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder='Details..'
                rows='4'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition resize-none'
              />
            </div>

            <div className='flex justify-between gap-4'>
              <button
                onClick={handleCloseModal}
                className='px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition flex-1 cursor-pointer'>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className='px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg hover:shadow-lg transition flex-1 cursor-pointer'>
                Upload Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
