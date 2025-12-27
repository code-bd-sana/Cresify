"use client";

import { Suspense } from "react";
import CustomerReviews from "@/components/products/CustomerReviews";
import ServiceDetails from "@/components/services/ServiceDetails";

// This inner component uses useSearchParams
function ServiceDetailsContent() {
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div>
      <ServiceDetails id={id} />
      <CustomerReviews id={id} />
    </div>
  );
}

// The main wrapper component
export default function ServiceDetailsWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    }>
      <ServiceDetailsContent />
    </Suspense>
  );
}