"use client";

import { Grid2x2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MissionVision() {
  const { t } = useTranslation('missionVision');
  
  return (
    <section className="w-full bg-[#F7F7FA] py-16 px-6">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* MISSION CARD */}
        <div className="bg-white rounded-[18px] min-h-[280px] p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)] border border-[#F0ECF9] hover:shadow-lg transition-shadow flex flex-col">
          
          {/* Icon */}
          <div className="w-[48px] h-[48px] rounded-[12px] 
            bg-gradient-to-r from-[#9838E1] to-[#F68E44] 
            flex items-center justify-center mb-4 flex-shrink-0">
            <Grid2x2 size={26} color="#ffffff" />
          </div>

          {/* Title */}
          <h3 className="text-[16px] font-bold text-[#1B1B1B] mb-3 flex-shrink-0">
            {t('mission.title')}
          </h3>

          {/* Text - Fixed overflow */}
          <p className="text-[14px] leading-[20px] text-[#A46CFF] overflow-y-auto flex-grow pr-2">
            {t('mission.description')}
          </p>
        </div>

        {/* VISION CARD */}
        <div className="bg-white rounded-[18px] min-h-[280px] p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)] border border-[#F0ECF9] hover:shadow-lg transition-shadow flex flex-col">

          {/* Icon */}
          <div className="w-[48px] h-[48px] rounded-[12px] 
            bg-gradient-to-r from-[#9838E1] to-[#F68E44] 
            flex items-center justify-center mb-4 flex-shrink-0">
            <Grid2x2 size={26} color="#ffffff" />
          </div>

          {/* Title */}
          <h3 className="text-[16px] font-bold text-[#1B1B1B] mb-3 flex-shrink-0">
            {t('vision.title')}
          </h3>

          {/* Text - Fixed overflow */}
          <p className="text-[14px] leading-[20px] text-[#A46CFF] overflow-y-auto flex-grow pr-2">
            {t('vision.description')}
          </p>
        </div>

      </div>
    </section>
  );
}