"use client";

import Pagination from "@/components/Pagination";
import {
  useAdminProductOverviewQuery,
  useAllProductsQuery,
  useChangeProductStatusMutation,
} from "@/feature/admin/AdminProductApi";
import Image from "next/image";
import { useState } from "react";
import {
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiSearch,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";

export default function ProductManagementPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  // Fetch overview stats
  const { data: overview } = useAdminProductOverviewQuery();

  // Fetch products with pagination and search
  const { data: productsData, isLoading } = useAllProductsQuery({
    search,
    skip: page * limit,
    limit,
  });

  // Mutation to change product status
  const [changeStatus] = useChangeProductStatusMutation();

  const statsData = overview?.data;
  const products = productsData?.data || [];
  const total = productsData?.total || 0;

  const stats = [
    {
      id: 1,
      label: "Total Products",
      value: statsData?.totalProducts || 0,
      icon: FiUsers,
    },
    {
      id: 2,
      label: "Active",
      value: statsData?.activeProducts || 0,
      icon: FiCheckCircle,
    },
    {
      id: 3,
      label: "Pending Approve",
      value: statsData?.pendingProducts || 0,
      icon: FiClock,
    },
    {
      id: 4,
      label: "Rejected",
      value: statsData?.rejectedProducts || 0,
      icon: FiXCircle,
    },
  ];

  const statusColors = {
    active: "bg-[#E6F8EF] text-[#32A35A]",
    rejected: "bg-[#FEE2E2] text-[#D32F2F]",
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to mark this product as "${newStatus}".`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await changeStatus({
          id: productId,
          status: newStatus,
        }).unwrap();
        Swal.fire({
          title: "Updated!",
          text: `Product status has been updated to "${newStatus}".`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        console.log(response);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update product status.",
        icon: "error",
      });
      console.error("Failed to update status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // reset page when searching
  };

  return (
    <div className='min-h-screen w-full px-2 pt-6'>
      {/* Header */}
      <div>
        <h1 className='text-[26px] font-semibold text-gray-900'>
          Product Management
        </h1>
        <p className='text-sm text-[#9C6BFF] mt-1'>
          Manage all marketplace products
        </p>
      </div>

      {/* Stats */}
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className='bg-white rounded-xl shadow-sm border border-[#F0ECFF] px-5 py-4 flex items-center justify-between'>
              <div>
                <p className='text-[13px] text-gray-600'>{card.label}</p>
                <p className='mt-2 text-[22px] font-semibold text-[#F88D25]'>
                  {card.value}
                </p>
              </div>
              <div className='w-10 h-10 bg-[#F5F0FF] flex items-center justify-center rounded-lg text-[#9C6BFF] text-xl'>
                <Icon />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className='mt-8 bg-white p-4 rounded-xl border border-[#ECECEC] shadow-sm flex flex-col md:flex-row gap-4 items-center'>
        {/* Search */}
        <div className='relative w-full'>
          <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
          <input
            type='text'
            placeholder='Search by product name or seller name...'
            value={search}
            onChange={handleSearchChange}
            className='w-full bg-[#FCFCFF] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A855F7]/40'
          />
        </div>

        {/* Filter dropdown */}
        <div className='relative w-full md:w-80'>
          <select className='appearance-none w-full px-4 py-3 bg-[#FCFCFF] border border-[#E5E7EB] text-sm rounded-lg outline-none cursor-pointer'>
            <option>All Product</option>
            <option>Delivered</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Canceled</option>
            <option>Shipping</option>
          </select>
          <FiChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none' />
        </div>
      </div>

      {/* Products Table */}
      <div className='mt-6 bg-white rounded-xl shadow-sm border border-[#F0ECFF] overflow-hidden'>
        <div className='p-5 overflow-x-auto'>
          {isLoading ? (
            <div className='text-center py-10 text-gray-500'>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className='text-center py-10 text-gray-500'>
              No products found
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-[#9838E1] text-[12px] bg-[#F8F4FD] border-b border-gray-200'>
                  <th className='py-3 px-3 text-left'>PRODUCT</th>
                  <th className='py-3 px-3 text-left'>SELLER</th>
                  <th className='py-3 px-3 text-left'>CATEGORY</th>
                  <th className='py-3 px-3 text-left'>PRICE</th>
                  <th className='py-3 px-3 text-left'>STOCK</th>
                  <th className='py-3 px-3 text-left'>STATUS</th>
                  <th className='py-3 px-3 text-left'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={`text-[13px] ${
                      idx !== products.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}>
                    {/* Product */}
                    <td className='py-3 px-3'>
                      <div className='flex items-center gap-3'>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className='rounded-lg object-cover'
                          />
                        ) : (
                          <div className='w-[50px] h-[50px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs'>
                            No Image
                          </div>
                        )}
                        <span className='max-w-[200px] truncate'>
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className='py-3 px-3 text-gray-700'>
                      {item.seller?.name || "N/A"}
                    </td>

                    {/* Category */}
                    <td className='py-3 px-3 text-gray-700'>
                      {item.category || "N/A"}
                    </td>

                    {/* Price */}
                    <td className='py-3 px-3 text-[#F88D25] font-medium'>
                      ${item.price?.toFixed(2) || "0.00"}
                    </td>

                    {/* Stock */}
                    <td className='py-3 px-3 text-gray-700'>
                      {item.stock || 0}
                    </td>

                    {/* Status */}
                    <td className='py-3 px-3'>
                      <select
                        value={item.status || "active"}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${
                          statusColors[item.status || "active"]
                        }`}>
                        <option value='active'>Active</option>
                        <option value='rejected'>Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className='py-3 px-3 text-right'>
                      <button className='text-xs border rounded-lg px-3 py-1 text-[#9C6BFF] border-[#E2D4FF] bg-[#F9F6FF] mr-2'>
                        View
                      </button>
                      <button className='text-xs bg-[#E6F8EF] text-[#32A35A] px-2 py-1 rounded-lg mr-2'>
                        ✔
                      </button>
                      <button className='text-xs bg-[#FEE2E2] text-[#D32F2F] px-2 py-1 rounded-lg'>
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && products.length > 0 && (
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            total={total}
            currentCount={products.length}
          />
        )}
      </div>
    </div>
  );
}
