"use client";

import Pagination from "@/components/Pagination";
import {
  useChangeUserStatusMutation,
  useGetAdminOverviewQuery,
  useGetAllUsersQuery,
} from "@/feature/admin/AdminUserApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiSearch, FiShoppingBag, FiUserCheck, FiUsers } from "react-icons/fi";
import { TbUserStar } from "react-icons/tb";

const statusColors = {
  active: "bg-[#E6F8EF] text-[#32A35A]",
  suspend: "bg-[#FEE2E2] text-[#D32F2F]",
  pending: "bg-[#FFF8E1] text-[#D97706]",
};

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("All Users");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /** Debounce search */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /** Overview stats */
  const { data: overview } = useGetAdminOverviewQuery();

  const stats = overview?.data; // FIXED

  /** Determine role based on tab */
  const role =
    activeTab === "All Users"
      ? ""
      : activeTab === "Buyer"
      ? "buyer"
      : activeTab === "Seller"
      ? "seller"
      : "provider";

  /** Fetch users */
  const { data, isLoading } = useGetAllUsersQuery({
    search: debouncedSearch,
    page,
    limit,
    role,
  });

  const [changeStatus] = useChangeUserStatusMutation();

  const users = data?.users || [];
  const total = data?.total || 0;

  return (
    <div className='min-h-screen w-full px-2 pt-6'>
      {/* HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-[26px] md:text-[28px] font-semibold text-gray-900'>
            User Management
          </h1>
          <p className='text-sm text-[#9C6BFF] mt-1'>
            Manage all platform users
          </p>
        </div>

        <button className='hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] shadow-md hover:opacity-90 transition'>
          <span className='text-lg'>+</span>
          Add Users
        </button>
      </div>

      {/* STAT CARDS */}
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        {[
          { label: "Total Users", value: stats?.totalUsers, icon: FiUsers },
          {
            label: "Total Sellers",
            value: stats?.totalSellers,
            icon: FiUserCheck,
          },
          {
            label: "Total Buyers",
            value: stats?.totalBuyers,
            icon: FiShoppingBag,
          },
          {
            label: "Total Service Providers",
            value: stats?.totalServiceProviders,
            icon: TbUserStar,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className='bg-white rounded-2xl shadow-sm border border-[#F0ECFF] px-6 py-5 flex items-center justify-between'>
              <div>
                <p className='text-[15px] font-medium text-[#2E2E2E]'>
                  {card.label}
                </p>
                <p className='mt-1 text-[28px] font-semibold text-[#F88D25] leading-none'>
                  {card.value ?? 0}
                </p>
              </div>

              <div className='w-12 h-12 rounded-xl bg-[#F2E9FF] flex items-center justify-center'>
                <Icon className='text-[26px] text-[#8736C5]' />
              </div>
            </div>
          );
        })}
      </div>

      {/* TABS + SEARCH */}
      <div className='mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div className='flex flex-wrap gap-3'>
          {["All Users", "Buyer", "Seller", "Service Provider"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "text-white bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] shadow"
                  : "text-gray-700 bg-white border border-[#E4E2F5]"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className='w-full lg:w-[320px]'>
          <div className='relative'>
            <span className='absolute left-3 top-2.5 text-[#F88D25]'>
              <FiSearch size={18} />
            </span>
            <input
              type='text'
              placeholder='Search by name or email'
              className='w-full pl-9 pr-3 py-2.5 bg-white rounded-full border border-[#E4E2F5] text-sm focus:outline-none focus:ring-1 focus:ring-[#F88D25]'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className='mt-6 mb-10 bg-white rounded-xl shadow-sm border border-[#F0ECFF] p-4 md:p-5'>
        <div className='overflow-x-scroll'>
          <table className='min-w-full text-left text-sm'>
            <thead>
              <tr className='text-[12px] text-[#A3A3B5] border-b border-gray-200 bg-[#F9F6FF]'>
                <th className='py-3 px-3'>USER</th>
                <th className='py-3 px-3'>CONTACT</th>
                <th className='py-3 px-3'>TYPE</th>
                <th className='py-3 px-3'>STATUS</th>
                <th className='py-3 px-3'>REGISTERED</th>
                <th className='py-3 px-3 text-right'>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {users?.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`text-[13px] ${
                    idx !== users.length - 1 ? "border-b border-gray-200" : ""
                  }`}>
                  <td className='py-3 px-3'>
                    <div className='flex items-center gap-3'>
                      <Image
                        src='/user2.png'
                        width={40}
                        height={40}
                        alt='avatar'
                      />
                      <p className='font-medium text-gray-800'>{user.name}</p>
                    </div>
                  </td>

                  <td className='py-3 px-3 text-gray-700'>
                    <div className='flex flex-col'>
                      <span>{user.email}</span>
                      <span className='text-xs text-gray-500'>
                        {user.phoneNumber}
                      </span>
                    </div>
                  </td>

                  <td className='py-3 px-3'>{user.role}</td>

                  <td className='py-3 px-3'>
                    <select
                      defaultValue={user.status}
                      onChange={(e) =>
                        changeStatus({
                          id: user._id,
                          status: e.target.value,
                        })
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border ${
                        statusColors[user.status]
                      }`}>
                      <option value='active'>Active</option>
                      <option value='pending'>Pending</option>
                      <option value='suspend'>Suspended</option>
                    </select>
                  </td>

                  <td className='py-3 px-3'>{user.createdAt.slice(0, 10)}</td>

                  <td className='py-3 px-3 text-right'>
                    <button className='text-xs border rounded-lg px-3 py-1 text-[#9C6BFF] border-[#E2D4FF] bg-[#F9F6FF]'>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <Pagination
            page={page - 1}
            setPage={(p) => setPage(p + 1)}
            limit={limit}
            total={total}
            currentCount={users?.length || 0}
          />
        </div>
      </div>
    </div>
  );
}
