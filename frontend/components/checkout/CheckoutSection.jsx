"use client";

import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function CheckoutSection() {


  return (
    <section className='w-full bg-[#F7F7FA] py-10 px-4'>
      <div className='max-w-[1200px] mx-auto grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)]'>
        {/* LEFT SIDE – SHIPPING + PAYMENT */}
        <div className='space-y-6'>
          {/* SHIPPING DETAILS */}
          <div className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5'>
            <div className='flex items-center gap-2 mb-4'>
              <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]'>
                <MapPin className='h-4 w-4 text-[#9B51E0]' />
              </span>
              <h3 className='text-[14px] font-semibold text-[#222]'>
                Shipping Details
              </h3>
            </div>

            <div className='space-y-4 text-[12px]'>
              {/* Full name */}
              <div>
                <label className='block text-[#666] mb-[4px]'>Full Name*</label>
                <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                  <User className='h-4 w-4 text-[#C2B7EB]' />
                  <input
                    className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                    placeholder='Your name'
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-[#666] mb-[4px]'>Email*</label>
                  <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                    <Mail className='h-4 w-4 text-[#C2B7EB]' />
                    <input
                      className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                      placeholder='youremail@example.com'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-[#666] mb-[4px]'>
                    Telephone*
                  </label>
                  <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                    <Phone className='h-4 w-4 text-[#C2B7EB]' />
                    <input
                      className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                      placeholder='+880'
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className='block text-[#666] mb-[4px]'>Address*</label>
                <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                  <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                  <input
                    className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                    placeholder='Street, city, region'
                  />
                </div>
              </div>

              {/* Country + City */}
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-[#666] mb-[4px]'>Country*</label>
                  <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                    <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                    <span className='flex-1 text-[12px] text-[#B4B4C0]'>
                      Select Country
                    </span>
                    <ChevronDown className='h-4 w-4 text-[#B4B4C0]' />
                  </div>
                </div>
                <div>
                  <label className='block text-[#666] mb-[4px]'>City*</label>
                  <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                    <MapPin className='h-4 w-4 text-[#C2B7EB]' />
                    <span className='flex-1 text-[12px] text-[#B4B4C0]'>
                      Select city
                    </span>
                    <ChevronDown className='h-4 w-4 text-[#B4B4C0]' />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5'>
            <div className='flex items-center gap-2 mb-4'>
              <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]'>
                <CreditCard className='h-4 w-4 text-[#9B51E0]' />
              </span>
              <h3 className='text-[14px] font-semibold text-[#222]'>
                Payment Method
              </h3>
            </div>

            {/* Method list */}
            <div className='space-y-3 text-[12px] mb-4'>
              {/* Card – ACTIVE with gradient border */}
              <div className='rounded-[10px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] p-[1px]'>
                <div className='flex items-center justify-between rounded-[9px] bg-[#FAF7FF] px-3 py-[9px]'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-white'>
                      <CreditCard className='h-3.5 w-3.5 text-[#9B51E0]' />
                    </span>
                    <div>
                      <p className='text-[12px] font-semibold text-[#4A4A4A]'>
                        Credit/Debit Card
                      </p>
                      <p className='text-[11px] text-[#9B51E0]'>
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </div>
                  <span className='h-[14px] w-[14px] rounded-full border-2 border-white bg-gradient-to-r from-[#9838E1] to-[#F68E44] shadow-[0_0_0_2px_rgba(152,56,225,0.25)]' />
                </div>
              </div>

              {/* Cash on delivery */}
              <div className='flex items-center justify-between rounded-[10px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                <div className='flex items-center gap-2'>
                  <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F4ECFF]'>
                    <ShieldCheck className='h-3.5 w-3.5 text-[#9B51E0]' />
                  </span>
                  <p className='text-[12px] text-[#4A4A4A]'>Cash On Delivery</p>
                </div>
                <span className='h-[14px] w-[14px] rounded-full border border-[#D3D3E6]' />
              </div>
            </div>

            {/* Card fields */}
            <div className='space-y-3 text-[12px]'>
              {/* Card number */}
              <div>
                <label className='block text-[#666] mb-[4px]'>
                  Card number*
                </label>
                <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                  <CreditCard className='h-4 w-4 text-[#C2B7EB]' />
                  <input
                    className='w-full text-[12px] outline-none placeholder:text-[#B4B4C0]'
                    placeholder='2950 1533 8297 8890'
                  />
                </div>
              </div>

              {/* Expiration + CVV */}
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-[#666] mb-[4px]'>
                    Expiration Date*
                  </label>
                  <input
                    className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                    placeholder='MM/YY'
                  />
                </div>
                <div>
                  <label className='block text-[#666] mb-[4px]'>CVV*</label>
                  <input
                    className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                    placeholder='•••'
                  />
                </div>
              </div>

              {/* Name + City select */}
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-[#666] mb-[4px]'>
                    Name of the Holder*
                  </label>
                  <input
                    className='w-full rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] text-[12px] outline-none placeholder:text-[#B4B4C0]'
                    placeholder='Name on the card'
                  />
                </div>
                <div>
                  <label className='block text-[#666] mb-[4px]'>City*</label>
                  <div className='flex items-center gap-2 rounded-[8px] border border-[#E3E1ED] px-3 py-[9px] bg-white'>
                    <span className='flex-1 text-[12px] text-[#B4B4C0]'>
                      Select city
                    </span>
                    <ChevronDown className='h-4 w-4 text-[#B4B4C0]' />
                  </div>
                </div>
              </div>

              {/* Stripe note + checkbox */}
              <div className='mt-3 space-y-2'>
                <div className='flex items-start gap-2 text-[11px] text-[#7F7F90]'>
                  <ShieldCheck className='mt-[1px] h-4 w-4 text-[#52B788]' />
                  <p>
                    Your payment is protected by Stripe, <br />
                    <span className='text-[#9B51E0]'>
                      256-bit SSL encryption
                    </span>
                    .
                  </p>
                </div>

                <label className='flex items-center gap-2 text-[11px] text-[#7F7F90]'>
                  <input type='checkbox' className='h-[12px] w-[12px]' />
                  My billing address is the same as my shipping address
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – ORDER SUMMARY */}
        <aside className='bg-white rounded-[16px] border border-[#ECE6F7] shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-6 py-5 h-fit'>
          <h3 className='text-[14px] font-semibold text-[#222] mb-4'>
            Order Summary
          </h3>

          {/* Items */}
          <div className='space-y-3 text-[12px] mb-4'>
            {/* Item 1 */}
            <div className='flex items-center justify-between gap-3 pb-3 border-b border-[#F1ECF8]'>
              <div className='flex items-center gap-3'>
                <div className='h-[42px] w-[42px] overflow-hidden rounded-[10px] bg-[#F2F2F7]'>
                  <img
                    src='/product/p1.jpg'
                    alt='Handmade Ceramic Vase'
                    className='h-full w-full object-cover'
                  />
                </div>
                <div>
                  <p className='text-[12px] font-semibold text-[#333]'>
                    Handmade Ceramic Vase
                  </p>
                  <p className='text-[11px] text-[#9B9B9B]'>Quantity: 2</p>
                </div>
              </div>
              <p className='text-[12px] font-semibold text-[#F78D25]'>$45.00</p>
            </div>

            {/* Item 2 */}
            <div className='flex items-center justify-between gap-3 pb-3 border-b border-[#F1ECF8]'>
              <div className='flex items-center gap-3'>
                <div className='h-[42px] w-[42px] overflow-hidden rounded-[10px] bg-[#F2F2F7]'>
                  <img
                    src='/product/p2.jpg'
                    alt='Organic Product'
                    className='h-full w-full object-cover'
                  />
                </div>
                <div>
                  <p className='text-[12px] font-semibold text-[#333]'>
                    Organic Product
                  </p>
                  <p className='text-[11px] text-[#9B9B9B]'>Quantity: 2</p>
                </div>
              </div>
              <p className='text-[12px] font-semibold text-[#F78D25]'>$45.00</p>
            </div>
          </div>

          {/* Totals */}
          <div className='space-y-1 text-[11px] text-[#777] mb-4'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span className='text-[#333]'>$120.00</span>
            </div>
            <div className='flex justify-between'>
              <span>Shipment</span>
              <span className='text-[#333]'>$5.00</span>
            </div>
            <div className='flex justify-between'>
              <span>Tax (5%)</span>
              <span className='text-[#333]'>$6.00</span>
            </div>
          </div>

          <div className='flex justify-between items-center text-[12px] font-semibold text-[#333] mb-4'>
            <span>Total</span>
            <span className='text-[#F78D25]'>$131.00</span>
          </div>

          {/* Confirm button */}
          <button className='flex w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#9838E1] to-[#F68E44] py-[10px] text-[13px] font-medium text-white shadow-[0_4px_16px_rgba(0,0,0,0.20)] mb-3'>
            <Lock className='h-4 w-4' />
            Confirm and Pay
          </button>

          {/* Security line */}
          <div className='flex items-center justify-center gap-2 mb-3'>
            <CheckCircle2 className='h-4 w-4 text-[#52B788]' />
            <p className='text-[11px] text-[#777]'>
              100% secure and encrypted payment.
            </p>
          </div>

          {/* Payment methods */}
          <div className='flex border-t border-[#F1ECF8]  justify-center w-full'>
            <div className='pt-3'>
              <p className='text-[11px] text-[#999] mb-2'>
                Accepted payment methods
              </p>
              <div className='flex gap-2'>
                <span className='inline-flex items-center justify-center rounded-[4px] bg-[#1A1F71] px-2 py-[2px] text-[10px] font-semibold text-white'>
                  VISA
                </span>
                <span className='inline-flex items-center justify-center rounded-[4px] bg-[#EB001B] px-2 py-[2px] text-[10px] font-semibold text-white'>
                  MC
                </span>
                <span className='inline-flex items-center justify-center rounded-[4px] bg-[#F79E1B] px-2 py-[2px] text-[10px] font-semibold text-white'>
                  AMEX
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
