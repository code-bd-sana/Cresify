"use client";
import FeaturedStores from "@/components/marketplace/FeaturedStores";
import ProductsPage from "@/components/marketplace/ProductsPage";
import SearchHero from "@/components/marketplace/SearchHero";
import SupportEntrepreneurs from "@/components/shared/SupportEntrepreneurs";
import React, { Suspense, useState } from "react";

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
     <Suspense fallback={<div>Loading...</div>}>

       <SearchHero 
        onSearch={(term) => setSearchTerm(term)}
        initialSearch={searchTerm}
      />
      <ProductsPage 
        searchTerm={searchTerm}
      />
      {/* <FeaturedStores /> */}
      <SupportEntrepreneurs />
     </Suspense>
    </div>
  );
};

export default MarketplacePage;