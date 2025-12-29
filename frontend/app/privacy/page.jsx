"use client";

import { useState } from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Globe, 
  Bell,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function Privacypage() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const privacyData = [
    {
      id: "collection",
      title: "Information We Collect",
      icon: <Eye className="text-[#9838E1]" size={20} />,
      content: [
        {
          title: "Personal Information",
          items: ["Name, email, phone number", "Billing and shipping addresses", "Payment information (encrypted)", "Government IDs for vendor verification"]
        },
        {
          title: "Usage Data",
          items: ["IP address and device information", "Browser type and version", "Pages visited and time spent", "Search queries and preferences"]
        },
        {
          title: "Transaction Data",
          items: ["Purchase history", "Vendor interactions", "Reviews and ratings", "Communication logs"]
        }
      ]
    },
    {
      id: "use",
      title: "How We Use Your Information",
      icon: <Users className="text-[#9838E1]" size={20} />,
      content: [
        {
          title: "Service Provision",
          items: ["Process transactions and deliveries", "Facilitate buyer-seller communication", "Provide customer support", "Verify user accounts"]
        },
        {
          title: "Improvement & Personalization",
          items: ["Enhance platform features", "Personalize recommendations", "Develop new services", "Optimize user experience"]
        },
        {
          title: "Communication",
          items: ["Send order updates", "Marketing communications (opt-in)", "Security alerts", "Policy changes"]
        }
      ]
    },
    {
      id: "sharing",
      title: "Information Sharing",
      icon: <Globe className="text-[#9838E1]" size={20} />,
      content: [
        {
          title: "With Vendors",
          items: ["Necessary for order fulfillment", "Shipping information only", "Contact details for communication", "Limited to transaction requirements"]
        },
        {
          title: "Service Providers",
          items: ["Payment processors", "Delivery partners", "Analytics services", "Cloud hosting providers"]
        },
        {
          title: "Legal Requirements",
          items: ["When required by law", "To protect rights and safety", "During business transfers", "With user consent"]
        }
      ]
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock className="text-[#9838E1]" size={20} />,
      content: [
        {
          title: "Protection Measures",
          items: ["SSL/TLS encryption", "Regular security audits", "Access controls", "Secure data centers"]
        },
        {
          title: "Payment Security",
          items: ["PCI DSS compliance", "Tokenization", "Fraud detection", "Regular monitoring"]
        },
        {
          title: "User Responsibilities",
          items: ["Secure account credentials", "Log out from shared devices", "Report suspicious activity", "Keep software updated"]
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Bell className="text-[#9838E1]" size={20} />,
      content: [
        {
          title: "Essential Cookies",
          items: ["Session management", "Shopping cart functionality", "Authentication", "Security features"]
        },
        {
          title: "Analytics Cookies",
          items: ["Usage statistics", "Performance metrics", "Feature testing", "Error tracking"]
        },
        {
          title: "Advertising Cookies",
          items: ["Personalized ads", "Retargeting campaigns", "Conversion tracking", "Audience insights"]
        }
      ]
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <Shield className="text-[#9838E1]" size={20} />,
      content: [
        {
          title: "Access & Control",
          items: ["View personal data", "Request corrections", "Download your data", "Delete your account"]
        },
        {
          title: "Preferences",
          items: ["Opt-out of marketing", "Cookie preferences", "Communication settings", "Location sharing"]
        },
        {
          title: "Complaints",
          items: ["Data protection authority", "Internal complaints", "Dispute resolution", "Legal recourse"]
        }
      ]
    }
  ];

  const retentionData = [
    { category: "Account Information", duration: "Until account deletion" },
    { category: "Transaction Records", duration: "7 years (legal requirement)" },
    { category: "Communication Logs", duration: "3 years" },
    { category: "Marketing Data", duration: "Until opt-out" },
    { category: "Analytics Data", duration: "2 years" },
    { category: "Backup Data", duration: "30 days" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FF] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#9838E1] to-[#F68E44] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <Shield size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Protecting your privacy is our top priority
          </p>
          <p className="mt-4 text-lg opacity-80">
            Effective Date: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 p-4 rounded-xl">
              <Lock className="text-[#9838E1]" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Our Commitment to Your Privacy
              </h2>
              <p className="text-gray-600 mb-4">
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you use our multi-vendor e-commerce platform. We are committed 
                to protecting your personal data and being transparent about our practices.
              </p>
              <p className="text-gray-600">
                As a platform connecting multiple independent vendors with customers, we handle 
                data with the highest standards of security and confidentiality. Each vendor 
                also maintains their own data practices in compliance with our standards.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {privacyData.map((section) => (
            <div 
              key={section.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to {openSections[section.id] ? 'collapse' : 'expand'} details
                    </p>
                  </div>
                </div>
                {openSections[section.id] ? (
                  <ChevronUp className="text-[#9838E1]" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400" size={24} />
                )}
              </button>
              
              {openSections[section.id] && (
                <div className="px-8 pb-8 pt-4 border-t border-gray-100">
                  <div className="grid md:grid-cols-3 gap-6">
                    {section.content.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          {item.title}
                        </h4>
                        <ul className="space-y-2">
                          {item.items.map((point, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-gray-600">
                              <span className="text-[#9838E1]">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Data Retention Table */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Data Retention Periods
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10">
                  <th className="text-left p-4 font-semibold text-gray-700 rounded-l-lg">
                    Data Category
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Retention Period
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 rounded-r-lg">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {retentionData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">
                      {item.category}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 bg-[#9838E1]/10 text-[#9838E1] rounded-full text-sm font-medium">
                        {item.duration}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {item.category === "Transaction Records" 
                        ? "Required for tax and legal compliance"
                        : "Automatically deleted after retention period"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact & Updates */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-[#9838E1]/5 to-[#F68E44]/5 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Contact Our Privacy Team
            </h4>
            <div className="space-y-3">
              <p className="text-gray-600">
                For privacy-related inquiries or to exercise your rights:
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-gray-700">Data Protection Officer</p>
                <p className="text-sm text-gray-600">Email: privacy@yourplatform.com</p>
                <p className="text-sm text-gray-600">Phone: +1 (555) 987-6543</p>
                <p className="text-sm text-gray-600">Address: [Your Company Address]</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#9838E1]/5 to-[#F68E44]/5 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Policy Updates
            </h4>
            <p className="text-gray-600 mb-4">
              We may update this policy periodically. Significant changes will be communicated:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#9838E1]"></div>
                <span className="text-sm text-gray-600">Email notification to registered users</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#9838E1]"></div>
                <span className="text-sm text-gray-600">Platform notification on login</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#9838E1]"></div>
                <span className="text-sm text-gray-600">Updated effective date displayed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Your Platform Name. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            This policy complies with GDPR, CCPA, and other global privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
}