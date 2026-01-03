"use client";

import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
  page = 0,
  setPage,
  limit = 10,
  total = 0,
  currentCount = 0,
}) {
  const { t } = useTranslation();
  const pageNum = Number(page) || 0;
  const pageLimit = Number(limit) || 10;
  const totalItems = Number(total) || 0;
  const currentItems = Number(currentCount) || 0;

  const totalPages = Math.ceil(totalItems / pageLimit) || 1;
  const skip = pageNum * pageLimit;

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (pageNum < 2) {
        // Near the beginning
        for (let i = 0; i < 3; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages - 1);
      } else if (pageNum > totalPages - 3) {
        // Near the end
        pages.push(0);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(0);
        pages.push("ellipsis");
        pages.push(pageNum - 1);
        pages.push(pageNum);
        pages.push(pageNum + 1);
        pages.push("ellipsis");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='px-6 py-6 border-t border-gray-200 bg-white'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
        {/* Showing X to Y of Z - with i18n */}
        <div className='text-sm text-gray-600'>
          {t("seller:productsPage.pagination.showing")}{" "}
          <span className='font-semibold text-gray-900'>
            {currentItems > 0 ? skip + 1 : 0}
          </span>{" "}
          {t("seller:productsPage.pagination.to")}{" "}
          <span className='font-semibold text-gray-900'>
            {skip + currentItems}
          </span>{" "}
          {t("seller:productsPage.pagination.of")}{" "}
          <span className='font-semibold text-gray-900'>{totalItems}</span>{" "}
          {t("seller:dashboard.products")}
        </div>

        {/* Pagination Buttons */}
        <div className='flex items-center gap-2'>
          {/* Previous Button */}
          <button
            onClick={() => setPage(Math.max(pageNum - 1, 0))}
            disabled={pageNum === 0}
            className='px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2'>
            <FiChevronLeft className='w-4 h-4' />
            {t("seller:productsPage.pagination.previous", "Previous")}
          </button>

          {/* Page Numbers */}
          <div className='flex items-center gap-1'>
            {pageNumbers.map((pageIndex, idx) => {
              if (pageIndex === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className='w-10 h-10 flex items-center justify-center text-gray-400'>
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageIndex}
                  onClick={() => setPage(pageIndex)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    pageNum === pageIndex
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}>
                  {pageIndex + 1}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setPage(Math.min(pageNum + 1, totalPages - 1))}
            disabled={pageNum + 1 >= totalPages}
            className='px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2'>
            {t("seller:productsPage.pagination.next", "Next")}
            <FiChevronRight className='w-4 h-4' />
          </button>
        </div>

        {/* Page Info - Optional */}
        <div className='hidden md:block text-sm text-gray-600'>
          {t("seller:productsPage.pagination.page", "Page")}{" "}
          <span className='font-semibold text-gray-900'>{pageNum + 1}</span>{" "}
          {t("seller:productsPage.pagination.ofTotal", "of")}{" "}
          <span className='font-semibold text-gray-900'>{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
