"use client";
import ProductsPage from "@/components/store/ProductsPage";
import { useMyProductQuery } from "@/feature/ProductApi";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const { id } = params;
  const { data: response, isLoading } = useMyProductQuery({ id });

  console.log(response?.data, "this is all products");

  return (
    <div>
      <ProductsPage
        products={response?.data || []}
        isLoading={isLoading}
        totalProducts={response?.total || 0}
      />
    </div>
  );
};

export default Page;
