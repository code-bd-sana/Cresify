"use client";

export default function Pagination({
  page,
  setPage,
  limit,
  total,
  currentCount,
}) {
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = page * limit;

  return (
    <div className='px-6 py-6 border-t border-gray-200 bg-white'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
        {/* Showing X to Y of Z */}
        <div className='text-sm text-gray-600'>
          Showing{" "}
          <span className='font-semibold text-gray-900'>
            {currentCount > 0 ? skip + 1 : 0}
          </span>
          {" to "}
          <span className='font-semibold text-gray-900'>
            {skip + currentCount}
          </span>
          {" of "}
          <span className='font-semibold text-gray-900'>{total}</span>
          {" products"}
        </div>

        {/* Pagination Buttons */}
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className='px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'>
            Previous
          </button>

          <div className='flex items-center gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;

              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return pageNum < totalPages ? (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition
                    ${
                      page === pageNum
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                  {pageNum + 1}
                </button>
              ) : null;
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages}
            className='px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
