import CustomerReviews from "@/components/products/CustomerReviews";
import ServiceDetails from "@/components/services/ServiceDetails";
import React from "react";

const page = () => {
  return (
    <div>
      <ServiceDetails />
      <CustomerReviews/>
    </div>
  );
};

export default page;
