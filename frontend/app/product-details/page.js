import CustomerReviews from "@/components/products/CustomerReviews";
import ProductDetails from "@/components/products/ProductDetails";
import React from "react";

const page = () => {
  return (
    <div>
      <ProductDetails />
      <CustomerReviews />
    </div>
  );
};

export default page;
