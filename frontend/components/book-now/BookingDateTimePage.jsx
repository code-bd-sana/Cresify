"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingDateTimePage() {
  const GRADIENT_FROM = "#9838E1";
  const GRADIENT_TO = "#F68E44";

  // ---------------- STATE ----------------
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("08:00 AM");
  const [duration, setDuration] = useState(1);

  // ---------------- CALENDAR ----------------
  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekday = firstDayOfMonth.getDay(); // Su-Mo-Tu-We...

    const startDate = new Date(year, month, 1 - firstWeekday);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      cells.push({
        date: d,
        isCurrentMonth: d.getMonth() === month,
      });
    }
    return cells;
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const goPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const times = ["08:00 AM", "12:00 AM", "04:00 PM", "08:00 PM"];

  // --------------------------------------------------
  //                        UI
  // --------------------------------------------------

  return (
    <section className="w-full bg-[#F7F7FA] py-10 px-6">
      <div className="mx-auto max-w-[1250px] grid gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        {/* ---------------- LEFT CARD ---------------- */}
        <div className="rounded-[20px] border border-[#ECE6F7] bg-white px-8 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          {/* HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-[#111827]">
              Select Date & Time
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={goPrevMonth}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E4DDF5] bg-white text-[#8A42D9]"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-[14px] font-semibold text-[#111827]">
                {monthLabel}
              </span>

              <button
                onClick={goNextMonth}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E4DDF5] bg-white text-[#8A42D9]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* CALENDAR */}
          <div className="rounded-[16px] border border-[#F0E6FF] bg-[#FBFAFF] px-5 pt-4 pb-3">
            <div className="mb-3 grid grid-cols-7 text-center text-[11px] font-medium text-[#A3A3B1]">
              {dayNames.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-[6px] text-center">
              {days.map(({ date, isCurrentMonth }) => {
                const isSelected =
                  selectedDate && isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                let classes =
                  "flex h-[52px] items-center justify-center rounded-[10px] text-[12px] cursor-pointer transition ";

                if (!isCurrentMonth) {
                  classes += "text-[#D1D5DB] hover:bg-[#F2F2F7]";
                } else {
                  classes += "text-[#4B4B5C] hover:bg-[#F1E8FF]";
                }

                if (isSelected) {
                  classes =
                    "flex h-[52px] items-center justify-center rounded-[10px] text-[12px] border border-[#9D5CFF] bg-[#F6EEFF] text-[#7C35D8] shadow-[0_0_0_1px_rgba(152,56,225,0.12)]";
                }

                if (!isSelected && isToday && isCurrentMonth) {
                  classes += " border border-[#E2D4FF]";
                }

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => isCurrentMonth && setSelectedDate(date)}
                    className={classes}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIME SLOTS */}
          <div className="mt-6">
            <p className="mb-2 text-[13px] font-medium text-[#111827]">
              Available Time Slots
            </p>

            <div className="flex flex-wrap gap-3">
              {times.map((t) => {
                const isActive = selectedTime === t;

                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={
                      "h-[44px] px-8 rounded-[12px] text-[13px] font-medium transition " +
                      (isActive
                        ? "bg-gradient-to-r from-[#F7F4FF] to-[#FFF7F0] text-[#7A3CE5] shadow-[0_4px_14px_rgba(0,0,0,0.12)] relative overflow-hidden"
                        : "border border-[#E4DDF5] bg-white text-[#4B4B5C] hover:border-[#C5B5FF]")
                    }
                    style={
                      isActive
                        ? {
                            backgroundImage:
                              "linear-gradient(90deg,#F6EEFF,#FFF3EA)",
                          }
                        : {}
                    }
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-[12px]"
                        style={{
                          padding: "1px",
                          backgroundImage:
                            "linear-gradient(90deg,#9838E1,#F68E44)",
                          WebkitMask:
                            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                        }}
                      />
                    )}
                    <span className="relative">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DURATION + CTA */}
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-[13px] font-medium text-[#111827] mb-1">
                Service Duration
              </p>

              <div className="inline-flex h-[40px] items-center rounded-[10px] border border-[#E4DDF5]">
                <button
                  className="px-4 border-r border-[#E4DDF5] text-[#8A42D9]"
                  onClick={() => setDuration((d) => Math.max(1, d - 1))}
                >
                  –
                </button>
                <span className="px-5">{duration}</span>
                <button
                  className="px-4 border-l border-[#E4DDF5] text-[#8A42D9]"
                  onClick={() => setDuration((d) => d + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA button */}
            <button
              className="flex-1 h-[46px] rounded-[12px] text-white text-[13px] font-medium shadow-[0_6px_18px_rgba(0,0,0,0.20)]"
              style={{
                backgroundImage: "linear-gradient(90deg,#9838E1,#F68E44)",
              }}
            >
              Continue to Booking Details
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT ORDER SUMMARY ---------------- */}
        <aside
          className="w-full rounded-[18px] border border-[#E9E5F4] bg-white px-6 py-6 
             shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
        >
          {/* TITLE */}
          <h3 className="text-[15px] font-semibold text-[#1B1B1B] mb-5">
            Order Summary
          </h3>

          {/* SERVICE ITEM */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-[48px] w-[48px] rounded-[12px] overflow-hidden bg-[#F5F4FA]">
                <img
                  src="/services/serv1.jpg"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#222]">
                  Smart Electricians
                </p>
                <p className="text-[11px] text-[#8B6FEA]">Electrical</p>
              </div>
            </div>
            <p className="text-[14px] font-semibold text-[#F26A00]">$55.00</p>
          </div>

          {/* DATE BLOCK */}
          <div className="border-t border-[#EEEAF7] pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-[28px] w-[28px] rounded-full bg-[#F7F7FA] flex items-center justify-center">
                <svg width="15" height="15" fill="#8A42D9">
                  <path d="M4 1v2M11 1v2M2 5h11M3 3h9c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1z" />
                </svg>
              </div>
              <p className="text-[12px] text-[#6F6F6F] font-medium">Date</p>
            </div>
            <p className="text-[13px] text-[#404040] ml-[34px]">
              Friday, April 12, 2024
            </p>
          </div>

          {/* TIME BLOCK */}
          <div className="border-t border-[#EEEAF7] pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-[28px] w-[28px] rounded-full bg-[#F7F7FA] flex items-center justify-center">
                <svg width="15" height="15" fill="#8A42D9">
                  <path d="M7.5 3v4l3 1.8M7.5 1a6.5 6.5 0 110 13 6.5 6.5 0 010-13z" />
                </svg>
              </div>
              <p className="text-[12px] text-[#6F6F6F] font-medium">Time</p>
            </div>
            <p className="text-[13px] text-[#404040] ml-[34px]">08:00 AM</p>
          </div>

          {/* DURATION BLOCK */}
          <div className="border-t border-[#EEEAF7] pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-[28px] w-[28px] rounded-full bg-[#F7F7FA] flex items-center justify-center">
                <svg width="15" height="15" fill="#8A42D9">
                  <path d="M5 1h5l3 4v8c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V5l3-4z" />
                </svg>
              </div>
              <p className="text-[12px] text-[#6F6F6F] font-medium">Duration</p>
            </div>
            <p className="text-[13px] text-[#404040] ml-[34px]">2 hours</p>
          </div>

          {/* PRICE DETAILS */}
          <div className="border-t border-[#EEEAF7] pt-4 space-y-2 text-[12px] text-[#666] mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#333]">$110.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipment</span>
              <span className="text-[#333]">$5.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span className="text-[#333]">$6.00</span>
            </div>
          </div>

          {/* TOTAL */}
          <div className="flex items-center justify-between mb-5 text-[13px] font-semibold">
            <span>Total</span>
            <span className="text-[#F26A00]">$121.00</span>
          </div>

          {/* CONFIRM BUTTON */}
          <button
            className="w-full rounded-[12px] text-white flex items-center justify-center gap-2 
               font-medium text-[14px] mb-5 shadow-[0_8px_22px_rgba(152,56,225,0.25)]"
            style={{
              height: "60px",
              backgroundImage: "linear-gradient(90deg,#9838E1,#F68E44)",
            }}
          >
            <svg width="17" height="17" fill="white">
              <path d="M4 7l4 4 8-8" />
            </svg>
            Confirm and Pay
          </button>

          {/* SECURITY */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="16" height="16" fill="#52B788">
              <path d="M8 1l6 3v4c0 3.9-2.7 7.4-6 8-3.3-.6-6-4.1-6-8V4l6-3z" />
            </svg>
            <p className="text-[11px] text-[#6F6F6F]">
              100% secure and encrypted payment.
            </p>
          </div>

          {/* PAYMENT METHODS */}
          <div className="border-t border-[#EEEAF7] pt-3 text-center">
            <p className="text-[11px] text-[#999] mb-2">
              Accepted payment methods
            </p>

            <div className="flex justify-center gap-2">
              <span className="px-2 py-[2px] bg-[#1A1F71] rounded-[4px] text-white text-[10px] font-semibold">
                VISA
              </span>
              <span className="px-2 py-[2px] bg-[#EB001B] rounded-[4px] text-white text-[10px] font-semibold">
                MC
              </span>
              <span className="px-2 py-[2px] bg-[#F79E1B] rounded-[4px] text-white text-[10px] font-semibold">
                AMEX
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
