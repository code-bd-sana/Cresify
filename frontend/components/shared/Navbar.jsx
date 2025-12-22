"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiMenu, FiMessageCircle, FiShoppingCart, FiX } from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const { data } = useSession();
  console.log(data?.user, "kire mamaur beta");
  const user = data?.user;
  

  return (
    <nav className='w-full bg-white border-b border-gray-100 sticky top-0 z-50'>
      {/* ---------------- DESKTOP NAV ---------------- */}
      <div className='hidden xl:flex w-full items-center justify-between px-16 py-2'>
        {/* LEFT */}
        <div className='flex items-center gap-72'>
          {/* LOGO */}
          <Link href='/'>
            <Image
              src='/logo.png'
              alt='logo'
              width={100}
              height={100}
              className='cursor-pointer'
            />
          </Link>

          {/* MENU */}
          <div className='flex items-center font-medium gap-8 text-[15px]'>
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
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className='flex items-center gap-6'>
          {/* SEARCH BAR */}
          <div className='flex items-center border border-[#D6D6D6] rounded-md px-3 py-[7px] w-[320px] shadow-sm'>
            <input
              type='text'
              placeholder='Search for product or service....'
              className='w-full text-sm outline-none placeholder:text-[#9F9F9F]'
            />
          </div>

          {/* ICONS */}
          {/* <FiMessageCircle className='text-[22px] text-black cursor-pointer' /> */}
          {/* <FiHeart className='text-[22px] text-black cursor-pointer' /> */}
          <Link href='/cart'>
            <FiShoppingCart className='text-[22px] text-black cursor-pointer' />
          </Link>

          {/* BUTTON  */}
          {user?.role === "buyer" ? (
            <Link href={"/profile"}>
              <FaUser className='text-2xl cursor-pointer' />
            </Link>
          ) : (
            <Link href='/dashboard'>
              <button className='px-6 py-[10px] text-white font-medium rounded-md bg-linear-to-r from-[#9838E1] to-[#F68E44] cursor-pointer'>
                Get started
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ---------------- MOBILE NAV ---------------- */}
      <div className='xl:hidden px-4 py-3 flex items-center justify-between'>
        {/* LEFT SIDE LOGO */}
        <Image
          src='/logo.png'
          alt='logo'
          width={80}
          height={80}
          className='cursor-pointer'
        />

        {/* ICONS + MENU BUTTON */}
        <div className='flex items-center gap-4'>
          {/* <FiHeart className='text-[22px] text-black cursor-pointer' /> */}
          <Link href='/cart'>
            <FiShoppingCart className='text-[22px] text-black cursor-pointer' />
          </Link>

          {/* Hamburger */}
          {open ? (
            <FiX
              className='text-[26px] cursor-pointer'
              onClick={() => setOpen(false)}
            />
          ) : (
            <FiMenu
              className='text-[26px] cursor-pointer'
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </div>

      {/* ---------------- MOBILE MENU DROPDOWN ---------------- */}
      {open && (
        <div className='lg:hidden bg-white px-4 pb-5 border-t animate-slideDown'>
          {/* SEARCH BAR */}
          <div className='mt-3 flex items-center border border-[#D6D6D6] rounded-md px-3 py-[7px] w-full shadow-sm'>
            <input
              type='text'
              placeholder='Search for product or service....'
              className='w-full text-sm outline-none placeholder:text-[#9F9F9F]'
            />
          </div>

          {/* MENU ITEMS */}
          <div className='flex flex-col gap-4 mt-4'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-[15px] font-medium ${
                    isActive
                      ? "text-[#FF7A00]"
                      : "text-black hover:text-[#FF7A00]"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* MESSAGE ICON */}
          <div className='flex mt-4 items-center gap-4'>
            <FiMessageCircle className='text-[22px] text-black cursor-pointer' />

            {user?.role === "buyer" ? (
              <FaUser />
            ) : (
              <button className='flex-1 px-5 py-[10px] text-white font-medium rounded-md bg-linear-to-r from-[#9838E1] to-[#F68E44] cursor-pointer'>
                Get started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
