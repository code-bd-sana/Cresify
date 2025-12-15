"use client";
import Pagination from "@/components/Pagination";
import {
  useDeleteProductMutation,
  useMyProductQuery,
} from "@/feature/ProductApi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit3, FiSearch } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

export default function ProductTable() {
  const { data: session } = useSession();
  const id = session?.user?.id;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteProduct, { deleteLoading, deleteError }] =
    useDeleteProductMutation();

  const skip = page * limit;

  // Debounce search for 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
      setPage(0); // Reset to first page on new search
    }
  }, [debouncedSearch]);

  const {
    data: resp,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useMyProductQuery({ id, skip, limit, search }, { skip: !id });

  const apiProducts = resp?.data ?? [];
  const total = resp?.total ?? 0;

  const totalPages = Math.ceil(total / limit) || 1;

  const handleEdit = (p) => console.log("Edit", p._id);

  const handleDelete = (p) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9810FA",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        productDelete(p?._id);
      }
    });
    console.log("Delete", p._id);
  };

  const productDelete = async (id) => {
    await deleteProduct(id);
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
    });
  };
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h1 className='text-2xl md:text-[28px] font-semibold text-gray-900'>
              Products
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Manage your product inventory efficiently
            </p>
          </div>

          <Link
            href='/dashboard/products/add-product'
            className='flex items-center gap-2 bg-gradient-to-r from-[#AA4BF5] to-[#FF7C74] text-white px-5 py-3 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-shadow duration-200'>
            <HiPlus className='text-lg' />
            Add New Product
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className='mt-8 bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm'>
          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative w-full md:w-2/3'>
              <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg' />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                type='text'
                placeholder='Search by product name, category, or ID...'
                className='w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition'
              />
              <button
                onClick={handleSearch}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition'>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
        {isLoading || isFetching ? (
          <div className='py-20 text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
            <p className='mt-4 text-gray-500'>Loading products...</p>
          </div>
        ) : error ? (
          <div className='py-20 text-center'>
            <div className='text-red-500 text-lg mb-2'>
              ⚠️ Error loading products
            </div>
            <p className='text-gray-600 mb-4'>
              {error?.message || "Something went wrong"}
            </p>
            <button
              onClick={() => refetch()}
              className='px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'>
              Try Again
            </button>
          </div>
        ) : apiProducts.length === 0 ? (
          <div className='py-20 text-center'>
            <div className='text-gray-400 text-6xl mb-4'>📦</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No products found
            </h3>
            <p className='text-gray-500 mb-6'>
              {search
                ? "Try a different search term"
                : "Start by adding your first product"}
            </p>
            {!search && (
              <Link
                href='/dashboard/products/add-product'
                className='inline-flex items-center gap-2 bg-gradient-to-r from-[#AA4BF5] to-[#FF7C74] text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition'>
                <HiPlus className='text-lg' />
                Add New Product
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200'>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        Product
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        Category
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        Price
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        Stock
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        Status
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiProducts.map((p) => (
                    <tr
                      key={p._id}
                      className='border-b border-gray-100 hover:bg-gray-50/50 transition-colors'>
                      <td className='px-6 py-5'>
                        <div className='flex items-center gap-4'>
                          <div className='relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200'>
                            <Image
                              src={p.image || "/product/bag.jpg"}
                              alt={p.name}
                              fill
                              className='object-cover'
                              sizes='56px'
                            />
                          </div>
                          <div>
                            <p className='font-medium text-gray-900'>
                              {p.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <span className='px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium'>
                          {p.category}
                        </span>
                      </td>
                      <td className='px-6 py-5'>
                        <span className='font-semibold text-gray-900'>
                          ${p.price}
                        </span>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`font-semibold ${
                              p.stock < 10 ? "text-red-600" : "text-gray-900"
                            }`}>
                            {p.stock}
                          </span>
                          {p.stock < 10 && (
                            <span className='text-xs text-red-500 bg-red-50 px-2 py-1 rounded'>
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium
                          ${
                            p.status === "active"
                              ? "bg-green-100 text-green-800"
                              : p.status === "out-of-stock"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {p.status?.charAt(0).toUpperCase() +
                            p.status?.slice(1)}
                        </span>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex items-center gap-2'>
                          <Link href={`/dashboard/products/edit/${p?._id}`}>
                            <button
                              className='p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition'
                              title='Edit'>
                              <FiEdit3 className='text-lg' />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(p)}
                            className='p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition'
                            title='Delete'>
                            <RiDeleteBin6Line className='text-lg' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              total={total}
              currentCount={apiProducts.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
