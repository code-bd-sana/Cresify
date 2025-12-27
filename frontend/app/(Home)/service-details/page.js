"use client";
import CustomerReviews from "@/components/products/CustomerReviews";
import ServiceDetails from "@/components/services/ServiceDetails";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div>
      <Suspense fallback={<div>Loading service details...</div>}>

        <ServiceDetails id={id} />
              <CustomerReviews id={id} />
      </Suspense>



    </div>
  );
};

export default Page;
