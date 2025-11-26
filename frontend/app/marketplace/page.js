"use client";
import FeaturedStores from "@/components/marketplace/FeaturedStores";
import ProductsPage from "@/components/marketplace/ProductsPage";
import SearchHero from "@/components/marketplace/SearchHero";
import SupportEntrepreneurs from "@/components/marketplace/SupportEntrepreneurs";
import React from "react";

const page = () => {
  return (
    <div>
      <SearchHero />
      <ProductsPage />
      <FeaturedStores />
      <SupportEntrepreneurs />
    </div>
  );
};

export default page;
