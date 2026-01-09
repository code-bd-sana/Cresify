"use client";

import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SearchHero({ onSearch, initialSearch = "" }) {
  const [search, setSearch] = useState(initialSearch);
  const { t } = useTranslation('marketPlace');

  const handleSearchClick = () => {
    if (onSearch && typeof onSearch === 'function') {
      console.log("Searching for:", search);
      onSearch(search);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <section className="w-full py-20 text-center">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Heading */}
        <h2 className="text-[36px] font-bold leading-[44px] text-[#1E1E1E] mb-3">
          {t('search_hero.title_line1')} <br /> {t('search_hero.title_line2')}
        </h2>

        {/* Subheading */}
        <p className="text-[15px] text-[#8F63E8] font-medium mb-10">
          {t('search_hero.subtitle')}
        </p>

        {/* Search Bar */}
        {/* <div className="w-full max-w-[780px] mx-auto flex items-center border border-[#A766E5] rounded-[12px] bg-white px-3 py-2 shadow-[0px_4px_18px_rgba(0,0,0,0.08)]">

          <FiSearch className="text-[#F78D25] text-[20px] mr-3" />

   
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('search_hero.search_placeholder')}
            className="flex-1 text-[15px] text-[#444] placeholder:text-[#A3A3A3] outline-none py-1"
          />

          <button
            onClick={handleSearchClick}
            className="px-8 py-[12px] cursor-pointer rounded-[10px] text-white text-[15px] font-medium
              bg-gradient-to-r from-[#9838E1] to-[#F68E44]
              shadow-[0px_4px_14px_rgba(0,0,0,0.15)]
              hover:from-[#8a2dc8] hover:to-[#e57f3a] transition-all
              hover:shadow-[0px_6px_20px_rgba(152,56,225,0.3)]"
          >
            {t('search_hero.search_button')}
          </button>
        </div> */}
      </div>
    </section>
  );
}