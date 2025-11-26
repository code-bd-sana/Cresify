"use client";
import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ProductTable() {
  const products = [
    {
      name: "Wireless Headphones",
      cat: "Electronics",
      price: "$1,250.00",
      stock: "$1,250.00",
      status: "Active",
      image: "/product/bag.jpg",
    },
    {
      name: "Smart Watch Pro",
      cat: "Wearables",
      price: "$850.00",
      stock: "$850.00",
      status: "Active",
      image: "/product/bag.jpg",
    },
    {
      name: "TV",
      cat: "Electronics",
      price: "$5,250.00",
      stock: "$5,250.00",
      status: "Active",
      image: "/product/bag.jpg",
    },
    {
      name: "Laptop Stand",
      cat: "Accessories",
      price: "$250.00",
      stock: "$250.00",
      status: "Out of Stock",
      image: "/product/bag.jpg",
    },
    {
      name: "SSD",
      cat: "Storage",
      price: "$750.00",
      stock: "$750.00",
      status: "Active",
      image: "/product/bag.jpg",
    },
    {
      name: "Webcam HD",
      cat: "Electronics", 
      price: "$870.00",
      stock: "$870.00",
      status: "Out of Stock",
      image: "/product/bag.jpg",
    },
  ];

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-xl mt-8 overflow-hidden px-6 py-10">
      <table className="w-full text-sm border rounded-2xl">
        {/* Header */}
        <thead className="rounded-2xl">
          <tr className="bg-[#F8F4FD] text-[#A278F6]  rounded-2xl  text-left text-[12px] uppercase">
            <th className="py-4 px-6">Product</th>
            <th className="py-4 px-6">Category</th>
            <th className="py-4 px-6">Price</th> 
            <th className="py-4 px-6">Stock</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-6 py-4 flex items-center gap-3">
                <Image
                  src={p.image}
                  width={50}
                  height={50}
                  alt="product"
                  className="rounded-lg bg-cover"
                />
                <p className="font-medium">{p.name}</p>
              </td>

              <td className="px-6 py-4 text-gray-600">{p.cat}</td>
              <td className="px-6 py-4 font-medium">{p.price}</td>
              <td className="px-6 py-4 font-medium">{p.stock}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    p.status === "Active"
                      ? "bg-[#F3E8FF] text-[#A855F7]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {p.status}
                </span>
              </td>

              <td className="px-6 py-4 flex items-center gap-3">
                <button className="text-[#A855F7] hover:scale-110 transition">
                  <FiEdit3 />
                </button>
                <button className="text-red-500 hover:scale-110 transition">
                  <RiDeleteBin6Line />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
