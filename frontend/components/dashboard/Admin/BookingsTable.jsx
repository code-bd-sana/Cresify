"use client";

const bookings = [
  {
    id: "#BOOK-2501",
    buyer: "Wade Warren",
    provider: "Wade Warren",
    category: "Electrical",
    amount: "$120.00",
    status: "Completed",
    datetime: "2025-06-01 01:10 PM",
  },
  {
    id: "#BOOK-2502",
    buyer: "Esther Howard",
    provider: "Esther Howard",
    category: "Plumbing",
    amount: "$84.00",
    status: "Pending",
    datetime: "2025-06-01 01:10 PM",
  },
  {
    id: "#BOOK-2503",
    buyer: "Leslie Alexander",
    provider: "Leslie Alexander",
    category: "Carpentry",
    amount: "$220.00",
    status: "Completed",
    datetime: "2025-06-01 01:10 PM",
  },
  {
    id: "#BOOK-2504",
    buyer: "Jacob Jones",
    provider: "Jacob Jones",
    category: "Pest Control",
    amount: "$201.00",
    status: "Completed",
    datetime: "2025-06-01 01:10 PM",
  },
];

const statusColors = {
  Completed: "bg-[#E6F8EF] text-[#3BAE66]",
  Pending: "bg-[#FFF5E5] text-[#F59E0B]",
};

export default function BookingsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#F0ECFF] p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Recent Bookes
        </h3>
        <button className="text-xs border rounded-lg px-3 py-1 text-gray-600 bg-gray-50">
          View All Booking
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-[12px] text-[#A3A3B5] border-b bg-[#F9F6FF]">
              <th className="py-3 px-3">ORDER ID</th>
              <th className="py-3 px-3">Buyer</th>
              <th className="py-3 px-3">Services Provider</th>
              <th className="py-3 px-3">CATEGORY</th>
              <th className="py-3 px-3">AMOUNT</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3">DATE & TIME</th>
              <th className="py-3 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((row, idx) => (
              <tr
                key={row.id}
                className={`text-[13px] ${
                  idx !== bookings.length - 1 ? "border-b" : ""
                }`}
              >
                <td className="py-3 px-3 text-[#9C6BFF] font-medium">
                  {row.id}
                </td>
                <td className="py-3 px-3 text-gray-700">{row.buyer}</td>
                <td className="py-3 px-3 text-gray-700">{row.provider}</td>
                <td className="py-3 px-3 text-gray-700">{row.category}</td>
                <td className="py-3 px-3 text-gray-700">{row.amount}</td>
                <td className="py-3 px-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[row.status]
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-700">{row.datetime}</td>
                <td className="py-3 px-3 text-right">
                  <button className="text-xs border rounded-lg px-3 py-1 text-[#9C6BFF] border-[#E2D4FF] bg-[#F9F6FF]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
