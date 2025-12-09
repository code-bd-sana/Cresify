"use client";
import { ArrowRightIcon, PencilLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ArticlesPage = () => {
  const articles = [
    {
      title: "10 Tips for Managing Your Digital Marketing Services",
      category: "Digital Marketing",
      description:
        "Discover how to choose the right service provider for your needs with expert guidance. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ",
      date: "March 15, 2024",
    },
    {
      title: "Supporting Local Businesses: Why It Matters",
      category: "Business",
      description:
        "Learn about the impact of shopping local and how it benefits your community.",
      date: "March 12, 2024",
    },
    {
      title: "How to Get the Most of Online Marketplaces",
      category: "Online Marketplaces",
      description:
        "Maximize your shopping experience with these proven strategies and insider tips.",
      date: "March 10, 2024",
    },
    {
      title: "Home Maintenance: Essential Services Every Home Needs",
      category: "Home Maintenance",
      description:
        "Explore must-have services for maintaining your home, from cleaning to repairs.",
      date: "March 11, 2024",
    },
    {
      title: "The Rise of Eco-Friendly Products in Latin America",
      category: "Eco-Friendly Products",
      description:
        "Explore the growing trend of sustainable and eco-friendly products in Latin America.",
      date: "March 13, 2024",
    },
    {
      title: "How to Get the Most of Online Marketplaces",
      category: "Online Marketplaces",
      description:
        "Understanding the best strategies for buying and selling on online platforms.",
      date: "March 10, 2024",
    },
    {
      title: "Seasonal Services: What You Need and When",
      category: "Seasonal Services",
      description:
        "A seasonal guide to maintaining your home with the best services throughout the year.",
      date: "March 15, 2024",
    },
    {
      title: "Building Trust in Online Marketplaces",
      category: "Online Marketplaces",
      description:
        "Learn how to ensure security and build trust with your buyers and sellers online.",
      date: "March 12, 2024",
    },
    {
      title: "Customer Reviews: How to Write Helpful Reviews",
      category: "Customer Reviews",
      description:
        "Guide on how to write reviews that help others make informed decisions.",
      date: "March 10, 2024",
    },
  ];

  return (
    <div className='p-6 bg-gray-50'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-gray-800'>All Articles</h1>
        <Link href={"/dashboard/content/add-blog"}>
          <button className='px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg cursor-pointer transition'>
            + Add Articles
          </button>
        </Link>
      </div>

      {/* Articles Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {articles.map((article, index) => (
          <div className='relative' key={index}>
            {/* Edit Icon Overlay */}
            <div className='absolute top-[11px] right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg z-1'>
              <PencilLine className='w-5 h-5 text-[#3881E1]' />
            </div>
            <div className='bg-white rounded-lg shadow-lg overflow-hidden p-5'>
              <div className='w-full h-48 overflow-hidden rounded-lg pb-4 relative group'>
                <Image
                  src={`https://placehold.co/362x240/8736C5/white?text=Article+${
                    index + 1
                  }`}
                  alt={article.title}
                  width={362}
                  height={240}
                  className='w-full h-full object-cover rounded-lg'
                  unoptimized
                />
              </div>
              <p className='text-sm text-[#AC65EE] font-semibold mb-3'>
                {article.category}
              </p>
              <div>
                <h3 className='text-lg font-bold text-gray-900'>
                  {article.title}
                </h3>
                <p className='text-sm text-[#000000] mt-2 two-line-ellipsis'>
                  {article.description}
                </p>
                <div className='flex justify-between items-center mt-4'>
                  <span className='text-sm text-gray-400'>{article.date}</span>
                  <a
                    href='#'
                    className='text-sm text-[#F78D25] transition flex items-center gap-2'>
                    Read More <ArrowRightIcon className='w-6 h-6' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className='flex justify-center mt-8'>
        <button className='px-6 py-2 bg-gradient-to-r from-[#8736C5] via-[#9C47C6] to-[#F88D25] text-white rounded-lg transition cursor-pointer'>
          View All
        </button>
      </div>
    </div>
  );
};

export default ArticlesPage;
