"use client";

import { LuShieldCheck, LuMapPin, LuHeadphones } from "react-icons/lu";
import { useTranslation } from "react-i18next";

export default function WhyChoose() {
  const { t } = useTranslation('whyChoose');
  
  // Translation থেকে items নাও
  const items = [
    {
      title: t('items.0.title'),
      desc: t('items.0.description'),
      icon: <LuShieldCheck size={34} color="white" />,
    },
    {
      title: t('items.1.title'),
      desc: t('items.1.description'),
      icon: <LuMapPin size={34} color="white" />,
    },
    {
      title: t('items.2.title'),
      desc: t('items.2.description'),
      icon: <LuHeadphones size={34} color="white" />,
    },
  ];

  // অথবা dynamic way তে
  // const getTranslatedItems = () => {
  //   const itemsData = t('items', { returnObjects: true });
  //   const icons = [LuShieldCheck, LuMapPin, LuHeadphones];
    
  //   return itemsData.map((item, index) => ({
  //     ...item,
  //     icon: icons[index] ? React.createElement(icons[index], { size: 34, color: "white" }) : null
  //   }));
  // };
  
  // const items = getTranslatedItems();

  return (
    <section className="w-full py-20 px-10">
      <div className="max-w-[1350px] mx-auto">

        {/* Heading */}
        <h2 className="text-[36px] font-bold text-center mb-2">
          {t('title')}
        </h2>

        {/* Subheading */}
        <p className="text-center text-[#AC65EE] font-bold text-[15px] leading-[22px] mb-16">
          {t('subtitle')}
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[18px] shadow-[0px_4px_18px_rgba(0,0,0,0.12)] 
              p-10 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-[70px] h-[70px] rounded-full mb-5 
                bg-gradient-to-br from-[#9838E1] to-[#F68E44] 
                flex items-center justify-center">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] text-[#9838E1] leading-[22px] max-w-[450px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}