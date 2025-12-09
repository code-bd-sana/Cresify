"use client";

import Image from "next/image";
import { useState } from "react";
import { FiChevronDown, FiEdit2 } from "react-icons/fi";

export default function ArticlesSection() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);

  // -------------------------
  // MAIN SECTION
  // -------------------------
  return (
    <section className='w-full mt-6 px-3 md:px-0'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-[24px] font-semibold text-gray-900'>
          All Articles
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className='px-5 py-2.5 flex items-center gap-2 bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white rounded-lg shadow hover:opacity-90 transition'>
          <span className='text-lg'>+</span> Add Articles
        </button>
      </div>

      {/* Articles Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {articles.map((article) => (
          <div
            key={article.id}
            className='bg-white rounded-xl shadow-sm border border-[#EDEAFB] p-3 pb-5 hover:shadow-md transition relative'>
            {/* Image */}
            <div className='w-full h-60 rounded-lg overflow-hidden relative'>
              <Image
                src={article.image}
                alt={article.title}
                fill
                className='object-cover object-top'
              />

              {/* Edit Button */}
              <button
                onClick={() => {
                  setSelectedArticle(article);
                  setShowEditModal(true);
                }}
                className='absolute top-3 right-3 bg-white shadow-md p-2 rounded-full text-[#8A2BE2] hover:bg-purple-50 transition'>
                <FiEdit2 size={16} />
              </button>
            </div>

            <p className='text-[13px] font-medium text-[#8A2BE2] mt-3'>
              {article.category}
            </p>

            <h3 className='text-[18px] font-semibold text-gray-900 mt-1'>
              {article.title}
            </h3>

            <p className='text-[14px] text-gray-600 mt-2'>{article.details}</p>

            <div className='flex items-center justify-between mt-4'>
              <p className='text-[13px] text-gray-500'>{article.date}</p>

              <button className='flex items-center gap-1 text-[13px] text-[#F88D25] font-medium hover:underline'>
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className='flex justify-center mt-8'>
        <button className='px-14 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#8736C5] to-[#F88D25] hover:opacity-90 transition shadow-md'>
          View All
        </button>
      </div>

      {/* ======================== ADD ARTICLE MODAL ======================== */}
      {showAddModal && (
        <AddArticleModal onClose={() => setShowAddModal(false)} />
      )}

      {/* ======================== EDIT ARTICLE MODAL ======================== */}
      {showEditModal && (
        <EditArticleModal
          article={selectedArticle}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </section>
  );
}

//
// ─────────────────────────────────────────────────────────────
//   ADD ARTICLE MODAL (PICTURE 1)
// ─────────────────────────────────────────────────────────────
//
function AddArticleModal({ onClose }) {
  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
      <div className='bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg relative'>
        {/* Header */}
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-semibold text-gray-900'>Add Articles</h2>
          <button onClick={onClose}>
            <span className='text-2xl text-gray-500 hover:text-gray-700'>
              ✕
            </span>
          </button>
        </div>

        {/* Image Upload */}
        <label className='block text-[14px] text-gray-700 font-medium mb-2'>
          Articles Image
        </label>

        <div className='border-2 border-dashed border-[#C4B5FD] rounded-xl py-10 text-center cursor-pointer'>
          <div className='mx-auto w-12 h-12 rounded-full bg-purple-100 text-[#9C27FF] flex items-center justify-center text-2xl'>
            ⬆
          </div>
          <p className='mt-2 text-gray-700 font-medium'>
            Click to upload image
          </p>
          <p classname='text-sm text-[#9C6BFF]'>PNG, JPG up to 15MB</p>
        </div>

        {/* Two Inputs Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Title name
            </label>
            <input
              type='text'
              placeholder='Enter your title name'
              className='w-full mt-2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#A855F7]/40'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>
              Category
            </label>
            <div className='relative'>
              <select className='w-full mt-2 border rounded-lg px-3 py-2 text-sm bg-white appearance-none focus:ring-2 focus:ring-[#A855F7]/40'>
                <option>Select Category</option>
                <option>Technology</option>
                <option>Home & Living</option>
                <option>Community</option>
              </select>
              <FiChevronDown className='absolute right-3 top-8 text-gray-400' />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className='mt-5'>
          <label className='text-sm font-medium text-gray-700'>Details</label>
          <textarea
            rows={4}
            placeholder='Details Details..'
            className='w-full mt-2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#A855F7]/40'></textarea>
        </div>

        {/* Buttons */}
        <div className='flex justify-end gap-3 mt-7'>
          <button
            onClick={onClose}
            className='px-6 py-2.5 rounded-lg border border-[#FF8A00] text-[#FF8A00] hover:bg-orange-50 transition'>
            Cancel
          </button>

          <button className='px-8 py-2.5 rounded-lg text-white bg-gradient-to-r from-[#8736C5] to-[#F88D25] font-medium shadow'>
            Upload Article
          </button>
        </div>
      </div>
    </div>
  );
}

//
// ─────────────────────────────────────────────────────────────
//   EDIT ARTICLE MODAL (PICTURE 2)
// ─────────────────────────────────────────────────────────────
//
function EditArticleModal({ article, onClose }) {
  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
      <div className='bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg relative'>
        {/* Header */}
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-semibold text-gray-900'>Edit Articles</h2>
          <button onClick={onClose}>
            <span className='text-2xl text-gray-500 hover:text-gray-700'>
              ✕
            </span>
          </button>
        </div>

        {/* Image */}
        <label className='block text-[14px] text-gray-700 font-medium mb-2'>
          Articles Image
        </label>

        <div className='w-full h-[200px] rounded-xl overflow-hidden relative'>
          <Image
            src='/blog/blog2.jpg'
            fill
            className='object-cover'
            alt='Article Image'
          />
        </div>

        {/* Two Inputs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Title name
            </label>
            <input
              type='text'
              defaultValue={article.title}
              className='w-full mt-2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#A855F7]/40'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>
              Category
            </label>
            <div className='relative'>
              <select className='w-full mt-2 border rounded-lg px-3 py-2 text-sm bg-white appearance-none focus:ring-2 focus:ring-[#A855F7]/40'>
                <option>Technology</option>
                <option>Home & Living</option>
                <option>Community</option>
              </select>
              <FiChevronDown className='absolute right-3 top-8 text-gray-400' />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className='mt-5'>
          <label className='text-sm font-medium text-gray-700'>Details</label>
          <textarea
            rows={5}
            defaultValue={article.details}
            className='w-full mt-2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#A855F7]/40'></textarea>
        </div>

        {/* Buttons */}
        <div className='flex justify-between mt-7'>
          <button className='px-6 py-2.5 rounded-lg border border-[#FF8A00] text-[#FF8A00] hover:bg-orange-50 transition'>
            Delete
          </button>

          <button className='px-8 py-2.5 rounded-lg text-white bg-gradient-to-r from-[#8736C5] to-[#F88D25] font-medium shadow'>
            Update Article
          </button>
        </div>
      </div>
    </div>
  );
}
