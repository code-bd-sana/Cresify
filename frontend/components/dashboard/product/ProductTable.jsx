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
import { useTranslation } from "react-i18next";
import { FiEdit3, FiSearch } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

export default function ProductTable() {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();
  const skip = page * limit;

  // Get translations for product status
  const getStatusText = (status) => {
    if (status === "active") {
      return t("seller:productsPage.status.active", "Active");
    }
    if (status === "rejected") {
      return t("seller:productsPage.status.rejected", "Rejected");
    }
    if (status === "out-of-stock") {
      return t("common:outOfStock", "Out of Stock");
    }
    return status?.charAt(0).toUpperCase() + status?.slice(1);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
      setPage(0);
    }
  }, [debouncedSearch]);

  const {
    data: resp,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useMyProductQuery({ id: userId, skip, limit, search }, { skip: !userId });

  const apiProducts = resp?.data ?? [];
  const total = resp?.total ?? 0;

  const handleDelete = (product) => {
    Swal.fire({
      title: t("common:deleteConfirm.title", "Are you sure?"),
      text: t("common:deleteConfirm.text", "You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9810FA",
      cancelButtonColor: "#d33",
      confirmButtonText: t("common:deleteConfirm.confirm", "Yes, delete it!"),
    }).then((result) => {
      if (result.isConfirmed) handleProductDelete(product._id);
    });
  };

  const handleProductDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      Swal.fire(
        t("common:deleteSuccess.title", "Deleted!"),
        t("common:deleteSuccess.text", "Product has been deleted."),
        "success"
      );
    } catch (error) {
      Swal.fire(
        t("common:error", "Error"),
        t("common:deleteFailed", "Failed to delete product"),
        "error"
      );
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      {/* Header */}
      <div className='mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-semibold text-gray-900'>
            {t("seller:productsPage.title", "Products")}
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            {t(
              "seller:productsPage.subtitle",
              "Manage your product inventory efficiently"
            )}
          </p>
        </div>
        <Link
          href='/dashboard/products/add-product'
          className='flex items-center gap-2 bg-gradient-to-r from-[#AA4BF5] to-[#FF7C74] text-white px-5 py-3 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition'>
          <HiPlus className='text-lg' />
          {t("seller:productsPage.addNewProduct", "Add New Product")}
        </Link>
      </div>

      {/* Search */}
      <div className='mb-8 bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm'>
        <div className='relative w-full md:w-2/3'>
          <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg' />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            type='text'
            placeholder={t(
              "seller:productsPage.searchPlaceholder",
              "Search by product name, category, or ID..."
            )}
            className='w-full border border-gray-300 rounded-xl pl-12 pr-24 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition'
          />
          <button
            onClick={handleSearch}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition'>
            {t("seller:productsPage.searchButton", "Search")}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
        {(isLoading || isFetching) && (
          <div className='py-20 text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
            <p className='mt-4 text-gray-500'>
              {t("common:loading", "Loading...")}
            </p>
          </div>
        )}

        {error && (
          <div className='py-20 text-center'>
            <div className='text-red-500 text-lg mb-2'>
              ⚠️ {t("common:errorLoading", "Error loading products")}
            </div>
            <p className='text-gray-600 mb-4'>
              {t("common:somethingWentWrong", "Something went wrong")}
            </p>
            <button
              onClick={() => refetch()}
              className='px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'>
              {t("common:tryAgain", "Try Again")}
            </button>
          </div>
        )}

        {apiProducts.length === 0 && !isLoading && (
          <div className='py-20 text-center'>
            <div className='text-gray-400 text-6xl mb-4'>📦</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              {t("common:noProducts", "No products found")}
            </h3>
            <p className='text-gray-500 mb-6'>
              {search
                ? t("common:tryDifferentSearch", "Try a different search term")
                : t("common:startAdding", "Start by adding your first product")}
            </p>
            {!search && (
              <Link
                href='/dashboard/products/add-product'
                className='inline-flex items-center gap-2 bg-gradient-to-r from-[#AA4BF5] to-[#FF7C74] text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition'>
                <HiPlus className='text-lg' />
                {t("seller:productsPage.addNewProduct", "Add New Product")}
              </Link>
            )}
          </div>
        )}

        {apiProducts.length > 0 && (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200'>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        {t("seller:productsPage.table.product", "Product")}
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        {t("seller:productsPage.table.category", "Category")}
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        {t("seller:productsPage.table.price", "Price")}
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        {t("seller:productsPage.table.stock", "Stock")}
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        {t("seller:productsPage.table.status", "Status")}
                      </span>
                    </th>
                    <th className='py-5 px-6 text-left'>
                      <span className='text-xs font-semibold text-purple-700 uppercase tracking-wider'>
                        {t("seller:productsPage.table.actions", "Actions")}
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
                          <p className='font-medium text-gray-900'>{p.name}</p>
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
                              {t("common:lowStock", "Low")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            p.status === "active"
                              ? "bg-green-100 text-green-800"
                              : p.status === "out-of-stock"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {getStatusText(p.status)}
                        </span>
                      </td>
                      <td className='px-6 py-5 flex items-center gap-2'>
                        <Link href={`/dashboard/products/edit/${p._id}`}>
                          <button
                            className='p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition'
                            title={t("common:edit", "Edit")}>
                            <FiEdit3 className='text-lg' />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deleteLoading}
                          className='p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed'
                          title={t("common:delete", "Delete")}>
                          <RiDeleteBin6Line className='text-lg' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              total={total}
              currentCount={apiProducts.length}
              translations={t("seller:productsPage.pagination", {
                showing: "Showing",
                to: "to",
                of: "of",
                products: "products",
                previous: "Previous",
                next: "Next",
              })}
            />
          </>
        )}
      </div>
    </div>
  );
}
