"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMessageCircle, FiHeart, FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="w-full  flex items-center justify-between px-16 py-2">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-72">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
            />
       
          </div>

          {/* MENU */}
          <div className="flex items-center font-medium gap-8 text-[15px]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative transition font-medium ${
                    isActive
                      ? "text-[#FF7A00]"
                      : "text-black hover:text-[#FF7A00]"
                  }`}
                >
                  {item.label}

               
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* SEARCH BAR EXACT FIGMA */}
          <div className="flex items-center border border-[#D6D6D6] rounded-md px-3 py-[7px] w-[320px] shadow-sm">
            <input
              type="text"
              placeholder="Search for product or service...."
              className="w-full text-sm outline-none placeholder:text-[#9F9F9F]"
            />
          </div>

          {/* ICONS EXACT 22PX LIKE FIGMA */}
          <FiMessageCircle className="text-[22px] text-black cursor-pointer" />
          <FiHeart className="text-[22px] text-black cursor-pointer" />
          <FiShoppingCart className="text-[22px] text-black cursor-pointer" />

          {/* BUTTON with EXACT GRADIENT */}
          <button className="px-6 py-[10px] text-white font-medium rounded-md bg-gradient-to-r from-[#9838E1] to-[#F68E44]">
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
}
