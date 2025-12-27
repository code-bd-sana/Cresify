import SupportEntrepreneurs from "@/components/shared/SupportEntrepreneurs";
import AllServiceProviders from "@/components/services/AllServiceProviders";
import ServiceCategories from "@/components/services/ServiceCategories";
import ServicesHeading from "@/components/services/ServicesHeading";
import React from "react";

const page = () => {
  return (
    <div>
      <ServicesHeading />
      {/* <ServiceCategories /> */}
      <AllServiceProviders />
      <SupportEntrepreneurs />
    </div>
  );
};

export default page;
