"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBox,
  FiCreditCard,
  FiGrid,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiShoppingCart,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { PiArticleFill } from "react-icons/pi";
import { SiTemporal } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { TbReceiptRefund } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { data } = useSession();
  const { t } = useTranslation('sidebar');
  
  const role = data?.user?.role;

  const adminItem = [
    { 
      label: t('dashboard'), 
      icon: FiGrid, 
      path: "/dashboard/admin-dashboard" 
    },
    {
      label: t('user_management'),
      icon: FiUser,
      path: "/dashboard/admin-dashboard/users",
    },
    {
      label: t('products'),
      icon: SiTemporal,
      path: "/dashboard/admin-dashboard/products",
    },
    {
      label: t('orders'),
      icon: FiShoppingCart, 
      path: "/dashboard/orders" 
    },
    { 
      label: t('payments'), 
      icon: FiCreditCard, 
      path: "/dashboard/payments" 
    },
    { 
      label: t('content'), 
      icon: PiArticleFill, 
      path: "/dashboard/content" 
    },
    {
      label: t('product_refunds'),
      icon: TbReceiptRefund,
      path: "/dashboard/adminRefund",
    },
    {
      label: t('service_refunds'),
      icon: TbReceiptRefund,
      path: "/dashboard/serviceRefund",
    },
    { 
      label: t('settings'), 
      icon: FiSettings, 
      path: "/dashboard/settings" 
    },
  ];

  const sellerItem = [
    { 
      label: t('dashboard'), 
      icon: FiGrid, 
      path: "/dashboard" 
    },
    { 
      label: t('products'), 
      icon: FiBox, 
      path: "/dashboard/products" 
    },
    { 
      label: t('orders'), 
      icon: FiShoppingCart, 
      path: "/dashboard/orders" 
    },
    { 
      label: t('store_profile'), 
      icon: FiUser, 
      path: "/dashboard/store-profile" 
    },
    { 
      label: t('payments'), 
      icon: FiCreditCard, 
      path: "/dashboard/payments" 
    },
    { 
      label: t('refund'), 
      icon: TbReceiptRefund, 
      path: "/dashboard/refund" 
    },
    { 
      label: t('wallet_details'), 
      icon: FiBox, 
      path: "/dashboard/wallet-details" 
    },
    { 
      label: t('reviews'), 
      icon: FiStar, 
      path: "/dashboard/reviews" 
    },
    { 
      label: t('messages'), 
      icon: FiMessageSquare, 
      path: "/dashboard/messages" 
    },
    { 
      label: t('settings'), 
      icon: FiSettings, 
      path: "/dashboard/settings" 
    },
  ];
  
  const providerItem = [
    { 
      label: t('dashboard'), 
      icon: FiGrid, 
      path: "/dashboard/service-provider-dashboard" 
    },
    { 
      label: t('bookings'), 
      icon: FiShoppingCart, 
      path: "/dashboard/booking" 
    },
    {
      label: t('calendar'),
      icon: SlCalender,
      path: "/dashboard/service-provider-dashboard/calendar",
    },
    { 
      label: t('wallet_details'), 
      icon: FiBox, 
      path: "/dashboard/wallet-details" 
    },
    {
      label: t('payments'),
      icon: FiCreditCard,
      path: "/dashboard/providerPayments",
    },
    { 
      label: t('messages'), 
      icon: FiMessageSquare, 
      path: "/dashboard/messages" 
    },
    { 
      label: t('reviews'), 
      icon: FiStar, 
      path: "/dashboard/reviews" 
    },
    { 
      label: t('settings'), 
      icon: FiSettings, 
      path: "/dashboard/settings" 
    },
    {
      label: t('refund'),
      icon: TbReceiptRefund,
      path: "/dashboard/providerRefund",
    },
  ];

  const menuItems =
    role === "seller"
      ? sellerItem
      : role === "provider"
      ? providerItem
      : role === "admin"
      ? adminItem
      : [];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          className='fixed inset-0 bg-black/30 z-40 lg:hidden'
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 lg:z-20 
          h-full w-64 bg-white border-r border-[#ECECEC]
          flex flex-col pt-6 pb-6 px-4
          transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
        {/* LOGO */}
        <Link href='/'>
          <div className='px-2 mb-8'>
            <Image
              src='/logo.png'
              alt='Cresify Logo'
              width={170}
              height={32}
              className='rounded-xl mx-auto'
            />
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className='flex-1 overflow-y-auto scrollbar-hide space-y-1'>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-all
                  ${
                    isActive
                      ? "bg-[#F4F0FF] text-[#4C1D95] font-semibold shadow-sm"
                      : "text-[#6F6C90] hover:bg-[#F7F6FF]"
                  }
                `}>
                <item.icon
                  className={`text-[18px] ${
                    isActive ? "text-[#4C1D95]" : "text-[#6F6C90]"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className='border-t border-[#F1F1F1] pt-4 mt-4'>
          <button
            onClick={() => {
              signOut({
                callbackUrl: "/",
              });
            }}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-[#FF6A3D] hover:bg-[#FFF3EC] transition'>
            <FiLogOut className='text-[18px]' />
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}