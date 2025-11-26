import Image from "next/image";

const products = [
  { name: "Wireless Headphones", sales: 256, price: "$1,250.00" },
  { name: "Smart Watch Pro", sales: 369, price: "$850.00" },
  { name: "Laptop Stand", sales: 296, price: "$5,250.00" },
  { name: "Webcam-HD", sales: 556, price: "$250.00" },
];

export default function TopSellingProduct() {
  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#EEEAF5] shadow-[0_4px_22px_rgba(0,0,0,0.05)]">
      <h2 className="text-lg font-semibold text-[#1D1D1F] mb-6">
        Top Selling Product
      </h2>

      <div className="flex flex-col gap-4">
        {products.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/product/bag.jpg"
                width={40}
                height={40}
                alt={item.name}
                className="rounded-lg"
              />
              <div>
                <p className="text-[15px] text-[#1D1D1F]">{item.name}</p>
                <p className="text-[13px] text-[#A78BFA]">{item.sales} sales</p>
              </div>
            </div>

            <p className="text-[#F39C4A] font-semibold">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
