"use client";


import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/TopBar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f2f2f4]">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-60 transition-all duration-300">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="px-4 md:px-6 lg:px-10 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
