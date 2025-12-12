import CustomerReviews from "@/components/products/CustomerReviews";
import ServiceDetails from "@/components/services/ServiceDetails";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading service details...</div>}>
        <ServiceDetails />
      </Suspense>
      <CustomerReviews />
    </div>
  );
};

export default page;
