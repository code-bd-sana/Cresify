"use client";

import { Plus, Trash2 } from "lucide-react";

export default function PaymentMethods() {
  const cards = [
    {
      id: 1,
      brand: "Visa",
      last4: "4846",
      expires: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      brand: "MASTERCARD",
      last4: "4896",
      expires: "12/26",
      isDefault: false,
    },
  ];

  return (
    <section className="w-full bg-white rounded-lg px-4 py-10">
      <div className="mx-auto w-full max-w-[880px]">
        {/* HEADER ROW */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-[#161616]">
            Payment Methods
          </h2>

          <button
            className="flex items-center gap-2 rounded-[999px] px-4 py-2 text-[13px] font-medium text-white
                       shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
            style={{
              backgroundImage: "linear-gradient(90deg,#9838E1,#F68E44)",
            }}
          >
            <Plus size={16} />
            Add New Card
          </button>
        </div>

        {/* CARD LIST */}
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-full rounded-[14px] border border-[#F1ECF8] bg-white px-5 py-4
                         shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between gap-6">
                {/* LEFT: LOGO + TEXT */}
                <div className="flex items-center gap-4">
                  {/* Brand logo mimic – sized to match Figma */}
                  {card.brand === "Visa" ? (
                    <div className="flex h-[40px] w-[64px] items-center justify-center rounded-[10px] bg-[#1A1F71]">
                      <span className="text-[15px] font-semibold tracking-[0.08em] text-white">
                        VISA
                      </span>
                    </div>
                  ) : (
                    <div className="flex h-[40px] w-[64px] items-center justify-center rounded-[10px] bg-white">
                      <div className="flex items-center gap-[4px]">
                        <span className="inline-block h-[26px] w-[26px] rounded-full bg-[#EB001B]" />
                        <span className="inline-block h-[26px] w-[26px] rounded-full bg-[#F79E1B] -ml-[10px]" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-[2px]">
                    <p className="text-[13px] font-semibold text-[#151515]">
                      {card.brand}{" "}
                      <span className="tracking-[0.18em]">
                        ****{card.last4}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#8E8E95]">
                      Expires {card.expires}
                    </p>
                  </div>

                  {/* DEFAULT PILL */}
                  {card.isDefault && (
                    <span className="ml-2 rounded-full bg-[#F3E6FF] px-3 py-[3px] text-[11px] font-medium text-[#9838E1]">
                      Default
                    </span>
                  )}
                </div>

                {/* RIGHT: ACTION BUTTONS */}
                <div className="flex items-center gap-3">
                  {!card.isDefault && (
                    <button
                      className="rounded-lg border-2 border-[#D2C3FF]
                                 px-4 py-[6px] text-[12px] font-medium text-[#7C3AED]
                                 hover:bg-[#F3EBFF] transition"
                    >
                      Set as Default
                    </button>
                  )}

                  <button
                    className="flex items-center gap-1 rounded-lg border-2 border-[#FFC9A7] 
                               px-4 py-[6px] text-[12px] font-medium text-[#F78D25]
                               hover:bg-[#FFEBDD] transition"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
