import BookingPaymentPage from "@/components/book-details/BookingPaymentPage";
import StepIndicator from "@/components/book-details/StepIndicator";
import React from "react";

const page = () => {
  return (
    <div>
      <StepIndicator />
      <BookingPaymentPage />
    </div>
  );
};

export default page;
