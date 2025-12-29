"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

export default function Termspage() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const termsData = [
    {
      id: "general",
      title: "General Terms & Conditions",
      content: [
        "Welcome to our multi-vendor e-commerce platform. By accessing or using our services, you agree to be bound by these Terms & Conditions.",
        "Our platform connects buyers with multiple vendors offering products and services across various categories.",
        "You must be at least 18 years old to use our services or have parental consent if between 13-17 years.",
        "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance."
      ]
    },
    {
      id: "accounts",
      title: "User Accounts & Registration",
      content: [
        "Users must provide accurate, current, and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "We reserve the right to suspend or terminate accounts that violate our policies or engage in fraudulent activities.",
        "Vendors must complete additional verification processes to sell products/services on our platform."
      ]
    },
    {
      id: "transactions",
      title: "Transactions & Payments",
      content: [
        "All transactions are processed through our secure payment gateway with encryption.",
        "Prices are set by individual vendors and may include applicable taxes and shipping fees.",
        "We act as an intermediary between buyers and sellers and are not party to the actual sale contract.",
        "Payment disputes must be raised within 7 days of transaction completion."
      ]
    },
    {
      id: "vendor",
      title: "Vendor Terms",
      content: [
        "Vendors are responsible for product quality, accurate descriptions, and timely delivery.",
        "Commission rates vary by product category and will be clearly communicated.",
        "Vendors must maintain minimum service standards and respond to customer inquiries within 24 hours.",
        "Prohibited items include illegal products, counterfeit goods, and restricted items as per local laws."
      ]
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      content: [
        "Return policies are set by individual vendors but must comply with our minimum standards.",
        "Damaged or defective products may be returned within 14 days of delivery.",
        "Digital products and services may have different refund policies as specified by the vendor.",
        "Refunds are processed within 7-10 business days after return approval."
      ]
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      content: [
        "All platform content, including logos, designs, and software, is protected by copyright.",
        "Vendors retain rights to their product images and descriptions but grant us license to display them.",
        "User-generated content must not infringe on third-party intellectual property rights.",
        "Unauthorized use of platform content may result in legal action."
      ]
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: [
        "We are not liable for vendor actions, product quality issues, or delivery delays.",
        "Maximum liability is limited to the amount paid for the specific transaction in question.",
        "We do not guarantee uninterrupted service and are not liable for temporary platform outages.",
        "Users agree to indemnify us against claims arising from their use of the platform."
      ]
    },
    {
      id: "termination",
      title: "Termination & Suspension",
      content: [
        "We may terminate or suspend accounts for violations of these terms without prior notice.",
        "Terminated users must cease all use of the platform immediately.",
        "Outstanding transactions will be processed according to our dispute resolution policy.",
        "Users may request account deletion, subject to retention of transaction records as required by law."
      ]
    },
    {
      id: "disputes",
      title: "Dispute Resolution",
      content: [
        "Disputes between buyers and sellers should first be resolved through our internal mediation system.",
        "Unresolved disputes may be escalated to our customer support team.",
        "These terms are governed by the laws of the jurisdiction where our company is registered.",
        "Agreement to arbitration as the primary method of resolving legal disputes."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5FF] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="mt-4 text-lg opacity-80">
            Please read these terms carefully before using our platform
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <div className="flex items-start gap-4">
            <CheckCircle className="text-[#9838E1] flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Important Notice
              </h2>
              <p className="text-gray-600 mb-4">
                These Terms & Conditions govern your use of our multi-vendor e-commerce platform. 
                By accessing or using our website, mobile application, or services, you agree to 
                comply with and be bound by these terms.
              </p>
              <p className="text-gray-600">
                Our platform facilitates transactions between buyers and multiple independent 
                vendors. Each vendor is responsible for their products, services, pricing, 
                and customer service.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsData.map((section) => (
            <div 
              key={section.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-[#9838E1]/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 flex items-center justify-center">
                    <span className="text-[#9838E1] font-bold">
                      {section.title.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {section.title}
                  </h3>
                </div>
                {openSections[section.id] ? (
                  <ChevronUp className="text-[#9838E1]" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400" size={24} />
                )}
              </button>
              
              {openSections[section.id] && (
                <div className="px-8 pb-6 pt-2 border-t border-gray-100">
                  <ul className="space-y-4">
                    {section.content.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#9838E1] mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Acceptance Section */}
        <div className="mt-12 bg-gradient-to-r from-[#9838E1]/5 to-[#F68E44]/5 rounded-2xl p-8 border border-[#9838E1]/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Acceptance of Terms
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">By Continuing to Use Our Platform:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span>You acknowledge reading these terms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span>You agree to be legally bound by them</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span>You consent to our privacy practices</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Need Help?</h4>
              <p className="text-gray-600">
                If you have questions about these terms, please contact our legal team:
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Email: legal@yourplatform.com</p>
                <p className="text-sm text-gray-600">Phone: +1 (555) 123-4567</p>
                <p className="text-sm text-gray-600">Business Hours: Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Your Platform Name. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            These terms are available in multiple languages upon request.
          </p>
        </div>
      </div>
    </div>
  );
}