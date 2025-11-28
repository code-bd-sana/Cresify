import BlogBanner from "@/components/blogs/BlogBanner";
import LatestArticles from "@/components/blogs/LatestArticles";
import React from "react";

const page = () => {
  return (
    <div className="bg-white pt-10">
      <BlogBanner />
      <LatestArticles />
    </div>
  );
};

export default page;
