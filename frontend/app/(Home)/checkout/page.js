import CheckoutSection from "@/components/checkout/CheckoutSection";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import React from "react";

const page = () => {
  return (
    <div>
      <CheckoutStepper />
      <CheckoutSection />
    </div>
  );
};

export default page;
