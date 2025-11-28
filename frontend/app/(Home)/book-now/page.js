import BookingCalendar from "@/components/book-now/BookingDateTimePage";
import BookingSteps from "@/components/book-now/BookingSteps";
import React from "react";

const page = () => {
  return (
    <div>
      <BookingSteps />
      <BookingCalendar />
    </div>
  );
};

export default page;
