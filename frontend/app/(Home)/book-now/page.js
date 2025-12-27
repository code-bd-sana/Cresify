import BookingCalendar from "@/components/book-now/BookingDateTimePage";
import BookingSteps from "@/components/book-now/BookingSteps";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
 <Suspense fallback={<div>Loading...</div>}>
       <BookingSteps />
      <BookingCalendar />
 </Suspense>
    </div>
  );
};

export default page;
