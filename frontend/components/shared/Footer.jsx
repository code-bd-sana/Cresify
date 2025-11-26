"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="
        w-full 
        pt-16 pb-6 
        bg-[linear-gradient(135deg,#F5EEFB_0%,#FFFFFF_100%)]
      "
    >
      <div className="max-w-[1350px] mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-14">

        {/* COLUMN 1 — Logo + Text + Social */}
        <div >
          <div className="-ml-8 mb-4">
            <Image
              src="/logo.png"
              width={118}
              height={118}
              alt="Cresify Logo"
            />
          
          </div>

          <p className="text-[14px] text-[#444] leading-[22px] mb-5">
            Emprendedores creando un futuro digital.  
            Plataforma simple y segura para negocios  
            digitales en línea.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-[#7A4ACF]">
            <FaFacebookF className="text-[18px] cursor-pointer hover:opacity-70" />
            <FaTwitter className="text-[18px] cursor-pointer hover:opacity-70" />
            <FaInstagram className="text-[18px] cursor-pointer hover:opacity-70" />
            <FaYoutube className="text-[18px] cursor-pointer hover:opacity-70" />
          </div>
        </div>

        {/* COLUMN 2 — Navegación */}
        <div>
          <h4 className="text-[16px] font-semibold text-[#7A4ACF] mb-4">
            Navegación
          </h4>

          <ul className="space-y-2 text-[14px] text-[#444]">
            <li className="cursor-pointer hover:text-[#7A4ACF]">FAQ</li>
            <li className="cursor-pointer hover:text-[#7A4ACF]">Términos</li>
            <li className="cursor-pointer hover:text-[#7A4ACF]">Privacidad</li>
          </ul>
        </div>

        {/* COLUMN 3 — Recursos */}
        <div>
          <h4 className="text-[16px] font-semibold text-[#7A4ACF] mb-4">
            Recursos
          </h4>

          <ul className="space-y-2 text-[14px] text-[#444]">
            <li className="cursor-pointer hover:text-[#7A4ACF]">Blog</li>
            <li className="cursor-pointer hover:text-[#7A4ACF]">Contacto</li>
          </ul>
        </div>

        {/* COLUMN 4 — Contacto */}
        <div>
          <h4 className="text-[16px] font-semibold text-[#7A4ACF] mb-4">
            Contacto
          </h4>

          <div className="flex items-center gap-3 text-[14px] text-[#444] mb-3">
            <MdEmail className="text-[18px] text-[#7A4ACF]" />
            hello@emprendechile.com
          </div>

          <div className="flex items-center gap-3 text-[14px] text-[#444]">
            <MdPhone className="text-[18px] text-[#7A4ACF]" />
            +56 9 1234 5547
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#D9C7F3] w-full mt-12"></div>

      {/* Bottom text */}
      <p className="text-center text-[13px] text-[#7A4ACF] mt-4">
        © 2025 Cresify. All rights reserved.
      </p>
    </footer>
  );
}
