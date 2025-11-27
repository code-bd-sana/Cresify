"use client";

import { useState } from "react";
import Image from "next/image";
import { FiCalendar, FiClock, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function RequestsPage() {
  const tabs = [
    "New Requests",
    "Upcoming",
    "In Progress",
    "Completed",
    "Canceled",
  ];
  const [activeTab, setActiveTab] = useState("New Requests");

  /* -------------------------------------------------------
     DIFFERENT DATA FOR EACH TAB
  --------------------------------------------------------*/

  const data = {
    "New Requests": [
      {
        id: 1,
        name: "Cody Fisher",
        service: "Electrical",
        date: "Friday, April 12, 2024",
        time: "08:00 AM",
        duration: "2 hours",
        price: "180",
        address: "123 Main Road Rampura, Dhaka 1205, Bangladesh",
        email: "sarah.ahmed@gmail.com",
        phone: "+8801555-975442",
        status: "Pending",
      },
      {
        id: 2,
        name: "Cody Fisher",
        service: "Electrical",
        date: "Friday, April 12, 2024",
        time: "08:00 AM",
        duration: "2 hours",
        price: "180",
        address: "Rampura, Dhaka 1205",
        email: "sarah.ahmed@gmail.com",
        phone: "+8801555-975442",
        status: "Pending",
      },
    ],

    Upcoming: [
      {
        id: 10,
        name: "Arlene McCoy",
        service: "Plumbing",
        date: "Sunday, April 14, 2024",
        time: "10:00 AM",
        duration: "1 hour",
        price: "250",
        address: "Banani, Dhaka",
        email: "arlene@gmail.com",
        phone: "+8801999-456123",
        status: "Upcoming",
      },
    ],

    "In Progress": [
      {
        id: 22,
        name: "John Watson",
        service: "Home Cleaning",
        date: "Today",
        time: "01:00 PM",
        duration: "3 hours",
        price: "350",
        address: "Dhanmondi, Dhaka",
        email: "john@gmail.com",
        phone: "+8801888-996644",
        status: "In Progress",
      },
    ],

    Completed: [
      {
        id: 33,
        name: "Jane Cooper",
        service: "Painting",
        date: "Wednesday, April 10, 2024",
        time: "02:00 PM",
        duration: "4 hours",
        price: "560",
        address: "Mirpur DOHS, Dhaka",
        email: "jane@gmail.com",
        phone: "+8801777-123456",
        status: "Completed",
      },
    ],

    Canceled: [
      {
        id: 44,
        name: "Theresa Webb",
        service: "Gardening",
        date: "Saturday, April 6, 2024",
        time: "09:00 AM",
        duration: "1.5 hours",
        price: "200",
        address: "Gulshan-1, Dhaka",
        email: "theresa@gmail.com",
        phone: "+8801666-554433",
        status: "Canceled",
      },
    ],
  };

  const currentList = data[activeTab];

  return (
    <div className="px-4 py-6 space-y-6 min-h-screen">
      {/* ======================= TABS ======================= */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EDE9FF] flex items-center gap-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab
                ? "bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white shadow-md"
                : "bg-[#F6F6FA] text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ======================= REQUEST LIST ======================= */}
      <div className="space-y-5">
        {currentList.map((req) => (
          <RequestCard key={req.id} req={req} />
        ))}
      </div>
    </div>
  );
}

/* ===================================================================
   REQUEST CARD COMPONENT
=================================================================== */
function RequestCard({ req }) {
  return (
    <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-sm px-6 py-5 flex items-start justify-between">
      <div className="flex flex-col gap-10">
        {/* LEFT SIDE: Profile + Name + Service + Status */}
        <div className="flex items-start gap-4 min-w-[250px]">
          {/* Profile Image */}
          <Image
            src="/user2.png"
            width={48}
            height={48}
            alt="user"
            className="rounded-full"
          />

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h3 className="text-[16px] font-semibold text-gray-900">
                {req.name}
              </h3>

              {/* Status Badge — exact like screenshot */}
              <span className="px-3 py-[2px] rounded-full text-xs font-medium bg-[#F3E8FF] text-[#9838E1]">
                {req.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 -mt-[2px]">{req.service}</p>
          </div>
        </div>

        {/* MIDDLE — EXACT ROW LIKE SCREENSHOT */}
        <div className="flex-1 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-gray-700">
          <DetailRow icon={<FiCalendar />} label={req.date} />
          <DetailRow icon={<FiClock />} label={req.time} />
          <DetailRow icon={<FiClock />} label={req.duration} />
          <DetailRow icon={<FiClock />} label={req.price} />
          <DetailRow icon={<FiMapPin />} label={req.address} />
          <DetailRow icon={<FiMail />} label={req.email} />
          <DetailRow icon={<FiPhone />} label={req.phone} />
        </div>
      </div>

      {/* RIGHT SIDE BUTTONS — EXACT ALIGNMENT */}
      <div className="flex flex-col items-end gap-2 min-w-[130px]">
        <button className="w-28 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#8736C5] to-[#F88D25] shadow-sm hover:opacity-90 transition">
          Accept
        </button>

        <button className="w-28 py-2 rounded-lg font-medium text-[#F88D25] border border-[#F88D25] bg-white hover:bg-orange-50 transition">
          Reject
        </button>

        <button className="w-28 py-2 rounded-lg text-[#9838E1] font-medium border border-[#D7C8FF] hover:bg-purple-50 transition">
          View Details
        </button>
      </div>
    </div>
  );
}

/* ===================================================================
   SMALL COMPONENT
=================================================================== */
function DetailRow({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-[14px]">
      <span className="text-gray-500 text-[16px]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
