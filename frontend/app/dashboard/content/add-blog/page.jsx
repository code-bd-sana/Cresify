"use client"
import Image from 'next/image';
import React, { useState } from 'react';

const AddArticleModal = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  
  const categories = [
    'Sustainability',
    'Community',
    'Planning',
    'Tips & Guides',
    'Shopping',
    'Home & Living'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // Handle the form submission logic here
    console.log('Form submitted with:', { title, category, details, image });
  };

  return (
    <div className="fixed inset-0 flex  bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold ">Add Articles</h2>
          <button className="text-gray-400 text-xl">×</button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Articles Image</label>
          <div className="border-dashed border-2 border-gray-300 p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-purple-600 hover:text-purple-700"
            >
              <div>
                {image ? (
                  <Image src={image} alt="Article Preview" className="w-full h-48 object-cover mb-4" />
                ) : (
                  <div className="text-lg mb-4">Click to upload image</div>
                )}
                <p className="text-sm text-gray-500">PNG, JPG up to 15MB</p>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title name"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="details">Details</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details.."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => console.log('Modal closed')}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg hover:bg-purple-700 transition"
          >
            Upload Article
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddArticleModal;
