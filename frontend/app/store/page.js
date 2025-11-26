import SupportEntrepreneurs from "@/components/marketplace/SupportEntrepreneurs";
import ProductsPage from "@/components/store/ProductsPage";
import StoreHeader from "@/components/store/StoreHeader";
import React from "react";

const page = () => {
  return (
    <div>
      <StoreHeader />
      <ProductsPage />
      <SupportEntrepreneurs />
    </div>
  );
};

export default page;
