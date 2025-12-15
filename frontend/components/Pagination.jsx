"use client";

export default function Pagination({
  page = 0,
  setPage,
  limit = 10,
  total = 0,
  currentCount = 0,
}) {
  const pageNum = Number(page) || 0;
  const pageLimit = Number(limit) || 10;
  const totalItems = Number(total) || 0;
  const currentItems = Number(currentCount) || 0;

  const totalPages = Math.ceil(totalItems / pageLimit) || 1;
  const skip = pageNum * pageLimit;

  return (
    <div className='px-6 py-6 border-t border-gray-200 bg-white'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
        {/* Showing X to Y of Z */}
        <div className='text-sm text-gray-600'>
          Showing{" "}
          <span className='font-semibold text-gray-900'>
            {currentItems > 0 ? skip + 1 : 0}
          </span>
          {" to "}
          <span className='font-semibold text-gray-900'>
            {skip + currentItems}
          </span>
          {" of "}
          <span className='font-semibold text-gray-900'>{totalItems}</span>
          {" products"}
        </div>

        {/* Pagination Buttons */}
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setPage(Math.max(pageNum - 1, 0))}
            disabled={pageNum === 0}
            className='px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'>
            Previous
          </button>

          <div className='flex items-center gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageIndex;

              if (totalPages <= 5) pageIndex = i;
              else if (pageNum < 3) pageIndex = i;
              else if (pageNum > totalPages - 4) pageIndex = totalPages - 5 + i;
              else pageIndex = pageNum - 2 + i;

              return pageIndex < totalPages ? (
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
              ) : null;
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(pageNum + 1, totalPages - 1))}
            disabled={pageNum + 1 >= totalPages}
            className='px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
