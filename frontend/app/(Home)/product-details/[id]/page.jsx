'use client'
import CustomerReviews from "@/components/products/CustomerReviews";
import ProductDetails from "@/components/products/ProductDetails";
import { useParams } from "next/navigation";
import React from "react";

const ProductDetailspage = () => {

  const params = useParams();
  const id = params?.id
  return (
    <div>
      <ProductDetails id={id}/>
      
      <CustomerReviews id={id}/>
    </div>
  );
};

export default ProductDetailspage;
