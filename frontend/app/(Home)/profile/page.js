"use client";

import { useState } from "react";

import ProfileOverview from "@/components/profile/ProfileOverview";
import Sidebar from "@/components/profile/Sidebar";
import AccountStatistics from "@/components/profile/AccountStatistics";
import OrdersPage from "@/components/profile/OrdersPage";
import BookingList from "@/components/profile/BookingList";
import Wishlist from "@/components/profile/Wishlist";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PaymentMethods from "@/components/profile/PaymentMethods";

export default function ProfileLayout() {
  const [active, setActive] = useState("overview");

  const renderContent = () => {
    switch (active) {
      case "overview":
        return <ProfileOverview />;
      case "stats":
        return <AccountStatistics />;
      case "orders":
        return <OrdersPage />;
      case "booking":
        return <BookingList />;
      case "wishlist":
        return <Wishlist />;
        case "payments":
          return <PaymentMethods />;
      //   default:
      //     return <ProfileOverview />;
    }
  };

  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-6">
    
      <div className="max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      
        {/* LEFT SIDE MENU */}
        <Sidebar active={active} setActive={setActive} />

        {/* RIGHT SIDE DYNAMIC CONTENT */}
        <div>{renderContent()}</div>
      </div>
    </section>
  );
}
