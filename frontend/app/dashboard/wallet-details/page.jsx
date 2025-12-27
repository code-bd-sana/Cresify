"use client";

import { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBuilding,
  FaCalendarAlt,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaEdit,
  FaEnvelope,
  FaHistory,
  FaIdCard,
  FaInfoCircle,
  FaLink,
  FaMoneyBillAlt,
  FaPhone,
  FaSearch,
  FaShieldAlt,
  FaSync,
  FaUnlink,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { SiStripe } from "react-icons/si";

/* ======================================================
  SUMMARY CARD COMPONENT
====================================================== */
function SummaryCard({ title, value, icon, color, subtitle, onClick }) {
  const colors = {
    green:
      "bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border-green-200",
    blue: "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 border-blue-200",
    amber:
      "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 border-amber-200",
    purple:
      "bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700 border-purple-200",
  };

  return (
    <div
      className={`p-5 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md ${
        onClick ? "hover:scale-[1.02]" : ""
      } ${colors[color]}`}
      onClick={onClick}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium opacity-80'>{title}</p>
          <p className='text-2xl font-bold mt-1'>{value}</p>
          {subtitle && <p className='text-xs opacity-70 mt-1'>{subtitle}</p>}
        </div>
        <div className='text-3xl opacity-90'>{icon}</div>
      </div>
    </div>
  );
}

/* ======================================================
  STRIPE ACCOUNT CARD COMPONENT
====================================================== */
function StripeAccountCard({ account, onEdit, onUnlink, onRefresh }) {
  if (!account) {
    return (
      <div className='bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4'>
            <SiStripe className='text-3xl text-gray-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>
            No Stripe Express Account Connected
          </h3>
          <p className='text-gray-600 mb-4'>
            Connect your Stripe Express account to receive payments
          </p>
          <button
            onClick={() => onEdit(true)}
            className='px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2'>
            <FaLink /> Connect Stripe Express Account
          </button>
          <p className='text-xs text-gray-500 mt-3'>
            Secure • Verified • Instant Transfers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-purple-100 rounded-lg'>
            <SiStripe className='text-2xl text-purple-600' />
          </div>
          <div>
            <h3 className='font-bold text-lg text-gray-900'>
              Stripe Express Account
            </h3>
            <div className='flex items-center gap-2 mt-1'>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  account.status === "verified"
                    ? "bg-green-100 text-green-800"
                    : account.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                {account.status === "verified"
                  ? "✓ Verified"
                  : account.status === "pending"
                  ? "⏳ Pending"
                  : "✗ Unverified"}
              </span>
              <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                Express Type
              </span>
              <span className='text-xs text-gray-500'>
                ID: {account.accountId?.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className='p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors'
          title='Refresh Status'>
          <FaSync />
        </button>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='bg-white p-3 rounded-lg border'>
          <p className='text-xs text-gray-500 mb-1'>Account Type</p>
          <p className='font-semibold capitalize'>Express</p>
        </div>
        <div className='bg-white p-3 rounded-lg border'>
          <p className='text-xs text-gray-500 mb-1'>Currency</p>
          <p className='font-semibold uppercase'>{account.currency}</p>
        </div>
        <div className='bg-white p-3 rounded-lg border'>
          <p className='text-xs text-gray-500 mb-1'>Payouts Enabled</p>
          <p
            className={`font-semibold ${
              account.payoutsEnabled ? "text-green-600" : "text-red-600"
            }`}>
            {account.payoutsEnabled ? "Yes" : "No"}
          </p>
        </div>
        <div className='bg-white p-3 rounded-lg border'>
          <p className='text-xs text-gray-500 mb-1'>Requirements</p>
          <p
            className={`font-semibold ${
              account.requirementsDue.length === 0
                ? "text-green-600"
                : "text-amber-600"
            }`}>
            {account.requirementsDue.length === 0
              ? "Complete"
              : `${account.requirementsDue.length} pending`}
          </p>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg border mb-4'>
        <h4 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
          <FaUser className='text-purple-500' />
          Express Account Details
        </h4>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Email:</span>
            <span className='font-medium'>{account.email}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Country:</span>
            <span className='font-medium'>{account.country}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Default Currency:</span>
            <span className='font-medium uppercase'>
              {account.defaultCurrency}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Charges Enabled:</span>
            <span
              className={`font-medium ${
                account.chargesEnabled ? "text-green-600" : "text-red-600"
              }`}>
              {account.chargesEnabled ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {account.requirementsDue.length > 0 && (
        <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4'>
          <h4 className='font-semibold text-amber-800 mb-2 flex items-center gap-2'>
            <FaInfoCircle />
            Action Required
          </h4>
          <ul className='text-sm text-amber-700 space-y-1'>
            {account.requirementsDue.map((req, idx) => (
              <li key={idx}>• {req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className='flex gap-3'>
        <button
          onClick={() => onEdit(false)}
          className='flex-1 px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2'>
          <FaEdit /> Edit Details
        </button>
        <button
          onClick={onUnlink}
          className='flex-1 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2'>
          <FaUnlink /> Unlink Account
        </button>
      </div>
    </div>
  );
}

/* ======================================================
  STRIPE ACCOUNT FORM MODAL
====================================================== */
function StripeAccountForm({
  isOpen,
  onClose,
  account,
  onSave,
  mode = "connect",
}) {
  const [formData, setFormData] = useState({
    email: "",
    businessName: "",
    phone: "",
    taxId: "",
    address: {
      line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
    bankAccount: {
      accountNumber: "",
      routingNumber: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (account && mode === "edit") {
      setFormData({
        email: account.email || "",
        businessName: account.businessName || "",
        phone: account.phone || "",
        taxId: account.taxId || "",
        address: account.address || {
          line1: "",
          city: "",
          state: "",
          postal_code: "",
          country: "US",
        },
        bankAccount: account.bankAccount || {
          accountNumber: "",
          routingNumber: "",
        },
      });
    }
  }, [account, mode]);

  if (!isOpen) return null;

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.businessName)
        newErrors.businessName = "Business name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
    }

    if (stepNumber === 2) {
      if (!formData.address.line1)
        newErrors["address.line1"] = "Address is required";
      if (!formData.address.city)
        newErrors["address.city"] = "City is required";
      if (!formData.address.state)
        newErrors["address.state"] = "State is required";
      if (!formData.address.postal_code)
        newErrors["address.postal_code"] = "Postal code is required";
    }

    if (stepNumber === 3) {
      if (!formData.bankAccount.accountNumber)
        newErrors["bankAccount.accountNumber"] = "Account number is required";
      if (!formData.bankAccount.routingNumber)
        newErrors["bankAccount.routingNumber"] = "Routing number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      setLoading(true);
      try {
        await onSave({
          ...formData,
          type: "express", // Force Express type
        });
        onClose();
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConnectStripe = async () => {
    setLoading(true);
    try {
      // Redirect to Stripe Connect with Express type
      window.location.href = `/api/stripe/connect?type=express&returnUrl=${encodeURIComponent(
        window.location.href
      )}`;
    } catch (error) {
      console.error("Stripe connect error:", error);
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className='space-y-4'>
            <h4 className='font-semibold text-gray-900 mb-4'>
              Basic Information
            </h4>

            <div className='bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4'>
              <div className='flex items-center gap-2'>
                <SiStripe className='text-purple-600' />
                <p className='text-sm font-medium text-blue-800'>
                  Stripe Express Account
                </p>
              </div>
              <p className='text-xs text-blue-700 mt-1'>
                You're connecting a Stripe Express account for receiving
                payments
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <FaEnvelope className='inline mr-2' />
                Email Address
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`block w-full rounded-lg border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder='your@email.com'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <FaBuilding className='inline mr-2' />
                Business Name
              </label>
              <input
                type='text'
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className={`block w-full rounded-lg border ${
                  errors.businessName ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder='Your Business Name'
              />
              {errors.businessName && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <FaPhone className='inline mr-2' />
                Phone Number
              </label>
              <input
                type='tel'
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`block w-full rounded-lg border ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder='+1 (555) 123-4567'
              />
              {errors.phone && (
                <p className='mt-1 text-sm text-red-600'>{errors.phone}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-4'>
            <h4 className='font-semibold text-gray-900 mb-4'>
              Business Address
            </h4>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Street Address
              </label>
              <input
                type='text'
                value={formData.address.line1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, line1: e.target.value },
                  })
                }
                className={`block w-full rounded-lg border ${
                  errors["address.line1"] ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder='123 Main St'
              />
              {errors["address.line1"] && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors["address.line1"]}
                </p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  className={`block w-full rounded-lg border ${
                    errors["address.city"]
                      ? "border-red-300"
                      : "border-gray-300"
                  } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder='City'
                />
                {errors["address.city"] && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors["address.city"]}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  State
                </label>
                <input
                  type='text'
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                  className={`block w-full rounded-lg border ${
                    errors["address.state"]
                      ? "border-red-300"
                      : "border-gray-300"
                  } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder='State'
                />
                {errors["address.state"] && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors["address.state"]}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Postal Code
                </label>
                <input
                  type='text'
                  value={formData.address.postal_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        postal_code: e.target.value,
                      },
                    })
                  }
                  className={`block w-full rounded-lg border ${
                    errors["address.postal_code"]
                      ? "border-red-300"
                      : "border-gray-300"
                  } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder='12345'
                />
                {errors["address.postal_code"] && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors["address.postal_code"]}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Country
                </label>
                <select
                  value={formData.address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value },
                    })
                  }
                  className='block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                  <option value='US'>United States</option>
                  <option value='CA'>Canada</option>
                  <option value='GB'>United Kingdom</option>
                  <option value='AU'>Australia</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-4'>
            <h4 className='font-semibold text-gray-900 mb-4'>
              Bank Account Details
            </h4>
            <p className='text-sm text-gray-600 mb-4'>
              This information is securely transmitted to Stripe for Express
              account payout processing.
            </p>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Account Number
              </label>
              <input
                type='text'
                value={formData.bankAccount.accountNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankAccount: {
                      ...formData.bankAccount,
                      accountNumber: e.target.value,
                    },
                  })
                }
                className={`block w-full rounded-lg border ${
                  errors["bankAccount.accountNumber"]
                    ? "border-red-300"
                    : "border-gray-300"
                } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder='000123456789'
              />
              {errors["bankAccount.accountNumber"] && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors["bankAccount.accountNumber"]}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Routing Number
              </label>
              <input
                type='text'
                value={formData.bankAccount.routingNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankAccount: {
                      ...formData.bankAccount,
                      routingNumber: e.target.value,
                    },
                  })
                }
                className={`block w-full rounded-lg border ${
                  errors["bankAccount.routingNumber"]
                    ? "border-red-300"
                    : "border-gray-300"
                } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder='021000021'
              />
              {errors["bankAccount.routingNumber"] && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors["bankAccount.routingNumber"]}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <FaIdCard className='inline mr-2' />
                Tax ID (Optional)
              </label>
              <input
                type='text'
                value={formData.taxId}
                onChange={(e) =>
                  setFormData({ ...formData, taxId: e.target.value })
                }
                className='block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='12-3456789'
              />
              <p className='mt-1 text-xs text-gray-500'>
                Required for business accounts in some countries
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <SiStripe className='text-purple-600' />
              {mode === "connect"
                ? "Connect Stripe Express Account"
                : "Update Stripe Express Account"}
            </h3>
            <p className='text-sm text-gray-600'>
              {mode === "connect"
                ? "Connect your Stripe Express account to receive payments"
                : "Update your Stripe Express account information"}
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-xl'>
            ✕
          </button>
        </div>

        {/* Progress Steps */}
        <div className='flex justify-between mb-8 relative'>
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className='flex flex-col items-center z-10'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step === stepNumber
                    ? "bg-purple-600 border-purple-600 text-white"
                    : step > stepNumber
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}>
                {step > stepNumber ? <FaCheck /> : stepNumber}
              </div>
              <span className='text-xs mt-2 text-gray-600'>
                {stepNumber === 1
                  ? "Basic Info"
                  : stepNumber === 2
                  ? "Address"
                  : "Bank Details"}
              </span>
            </div>
          ))}
          <div className='absolute top-5 left-1/2 right-1/2 h-0.5 bg-gray-200 -translate-x-1/2 w-2/3'></div>
        </div>

        {/* Form Content */}
        {renderStep()}

        {/* Security Notice */}
        <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <div className='flex items-start gap-3'>
            <FaShieldAlt className='text-blue-500 text-xl flex-shrink-0' />
            <div>
              <p className='text-sm font-medium text-blue-800'>
                Secure & Encrypted
              </p>
              <p className='text-xs text-blue-700 mt-1'>
                All information is encrypted and securely transmitted to Stripe
                Express. We never store your bank account details on our
                servers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 mt-6'>
          {step > 1 && (
            <button
              onClick={handleBack}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              disabled={loading}>
              Back
            </button>
          )}

          <div className='flex-1 flex gap-3'>
            {mode === "connect" && step === 1 && (
              <button
                onClick={handleConnectStripe}
                disabled={loading}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2'>
                <SiStripe className='text-xl' />
                Connect Stripe Express
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50'
                disabled={loading}>
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2'>
                {loading
                  ? "Saving..."
                  : mode === "connect"
                  ? "Complete Setup"
                  : "Update Account"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
  WITHDRAWAL REQUEST MODAL
====================================================== */
function WithdrawalModal({ isOpen, onClose, wallet, onSubmit, stripeAccount }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const newErrors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (parseFloat(amount) > wallet.balance) {
      newErrors.amount = "Amount exceeds available balance";
    }

    if (parseFloat(amount) < 10) {
      newErrors.amount = "Minimum withdrawal is $10";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        amount: parseFloat(amount),
        method: "stripe",
        currency: wallet.currency,
        fee: 1.5,
        netAmount: parseFloat(amount) * 0.985,
        stripeAccountId: stripeAccount?.accountId,
      });
      onClose();
    } catch (error) {
      console.error("Withdrawal error:", error);
    } finally {
      setLoading(false);
    }
  };

  const netAmount = parseFloat(amount || 0) * 0.985;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-md w-full p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-bold text-gray-900'>
              Request Stripe Withdrawal
            </h3>
            <p className='text-sm text-gray-600'>
              Withdraw funds via Stripe Express
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'>
            ✕
          </button>
        </div>

        <div className='space-y-4'>
          {/* Available Balance */}
          <div className='bg-blue-50 p-4 rounded-lg'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-blue-700'>Available Balance</span>
              <span className='font-bold text-blue-900'>
                {wallet.currency}
                {wallet.balance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Stripe Account Info */}
          {stripeAccount && (
            <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
              <div className='flex items-center gap-2 mb-2'>
                <SiStripe className='text-purple-600' />
                <span className='font-medium text-purple-800'>
                  Stripe Express Account
                </span>
              </div>
              <div className='text-sm text-purple-700'>
                <p>Connected to: {stripeAccount.email}</p>
                <p className='text-xs mt-1'>
                  Funds will be transferred to your connected bank account
                </p>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Amount to Withdraw
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 sm:text-sm'>
                  {wallet.currency}
                </span>
              </div>
              <input
                type='number'
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors({ ...errors, amount: null });
                }}
                className={`pl-10 block w-full rounded-lg border ${
                  errors.amount ? "border-red-300" : "border-gray-300"
                } px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder='0.00'
                step='0.01'
                min='10'
                max={wallet.balance}
              />
            </div>
            {errors.amount && (
              <p className='mt-1 text-sm text-red-600'>{errors.amount}</p>
            )}
            <div className='flex gap-2 mt-2'>
              {[100, 250, 500, wallet.balance].map((suggestedAmount) => (
                <button
                  key={suggestedAmount}
                  type='button'
                  onClick={() =>
                    setAmount(
                      Math.min(suggestedAmount, wallet.balance).toString()
                    )
                  }
                  className='text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors'>
                  {wallet.currency}
                  {suggestedAmount === wallet.balance ? "All" : suggestedAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Summary */}
          <div className='bg-gray-50 p-4 rounded-lg space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Withdrawal Amount</span>
              <span className='font-medium'>
                {wallet.currency}
                {amount || "0.00"}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Stripe Fee (1.5%)</span>
              <span className='font-medium text-red-600'>
                -{wallet.currency}
                {(parseFloat(amount || 0) * 0.015).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between text-sm pt-2 border-t border-gray-300'>
              <span className='font-semibold'>Amount You'll Receive</span>
              <span className='font-bold text-green-600'>
                {wallet.currency}
                {netAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className='flex items-start gap-2 text-xs text-gray-500'>
            <FaInfoCircle className='w-4 h-4 flex-shrink-0 mt-0.5' />
            <p>
              Withdrawal requests are processed within 2-3 business days via
              Stripe Express. Minimum withdrawal: {wallet.currency}10.
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              disabled={loading}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !stripeAccount}
              className='flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50'>
              {loading ? "Processing..." : "Request Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
  MAIN COMPONENT
====================================================== */
export default function WalletDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripeAccount, setStripeAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stripeFormMode, setStripeFormMode] = useState("connect");

  useEffect(() => {
    setTimeout(() => {
      setWallet({
        balance: 1240.5,
        totalEarned: 3560.75,
        pending: 320.25,
        lastPayout: 780.5,
        currency: "$",
        nextPayoutDate: "2025-02-01",
        payoutFrequency: "weekly",
        totalWithdrawn: 2320.25,
        thisMonthEarnings: 890.5,
      });

      // Mock Stripe Express account data
      setStripeAccount({
        accountId: "acct_1MnpWjP9NtFqXy2L",
        email: "provider@example.com",
        businessName: "Professional Property Inspections LLC",
        phone: "+1 (555) 123-4567",
        status: "verified",
        type: "express",
        country: "US",
        currency: "usd",
        defaultCurrency: "usd",
        chargesEnabled: true,
        payoutsEnabled: true,
        requirementsDue: [],
        address: {
          line1: "123 Main St",
          city: "New York",
          state: "NY",
          postal_code: "10001",
          country: "US",
        },
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      });

      setTransactions([
        {
          id: "TXN-1001",
          type: "credit",
          title: "Service Payment - Property Inspection",
          amount: 120,
          status: "completed",
          createdAt: "2025-01-20",
          method: "stripe",
          reference: "INV-2025-001",
        },
        {
          id: "TXN-1002",
          type: "debit",
          title: "Platform Commission",
          amount: 12,
          status: "completed",
          createdAt: "2025-01-20",
          method: "system",
          reference: "COM-2025-001",
        },
        {
          id: "TXN-1003",
          type: "credit",
          title: "Service Payment - Commercial Inspection",
          amount: 200,
          status: "pending",
          createdAt: "2025-01-18",
          method: "stripe",
          reference: "INV-2025-002",
        },
        {
          id: "TXN-1004",
          type: "debit",
          title: "Withdrawal via Stripe",
          amount: 500,
          status: "completed",
          createdAt: "2025-01-15",
          method: "stripe",
          reference: "WTH-2025-001",
        },
      ]);

      setLoading(false);
    }, 800);
  }, []);

  const handleStripeAccountSave = async (data) => {
    console.log("Saving Stripe Express account:", data);
    setLoading(true);
    setTimeout(() => {
      setStripeAccount({
        ...stripeAccount,
        ...data,
        type: "express", // Ensure type is express
        updatedAt: new Date().toISOString().split("T")[0],
      });
      setLoading(false);
      setShowStripeForm(false);
    }, 1000);
  };

  const handleStripeAccountUnlink = async () => {
    if (
      window.confirm(
        "Are you sure you want to unlink your Stripe Express account? This will disable Stripe payouts."
      )
    ) {
      setLoading(true);
      setTimeout(() => {
        setStripeAccount(null);
        setLoading(false);
      }, 800);
    }
  };

  const handleStripeAccountRefresh = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleWithdrawalSubmit = async (withdrawalData) => {
    console.log("Submitting withdrawal:", withdrawalData);
    setLoading(true);
    setTimeout(() => {
      // Update wallet balance
      setWallet({
        ...wallet,
        balance: wallet.balance - withdrawalData.amount,
        totalWithdrawn: wallet.totalWithdrawn + withdrawalData.amount,
      });

      // Add transaction
      const newTransaction = {
        id: `TXN-${Date.now()}`,
        type: "debit",
        title: `Withdrawal via Stripe Express`,
        amount: withdrawalData.amount,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        method: "stripe",
        reference: `WTH-${Date.now().toString().slice(-6)}`,
      };

      setTransactions([newTransaction, ...transactions]);
      setLoading(false);
      setShowWithdrawalModal(false);
    }, 1500);
  };

  if (loading || !wallet) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-500 text-lg'>Loading wallet details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* ===== HEADER ===== */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
          <div className='flex items-center gap-3'>
            <FaWallet className='text-3xl text-blue-600' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Wallet Details
              </h1>
              <p className='text-gray-600'>
                Manage your earnings and Stripe Express account
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowWithdrawalModal(true)}
            disabled={!stripeAccount}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
              !stripeAccount
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
            }`}>
            <GiTakeMyMoney className='text-xl' />
            Request Stripe Payout
          </button>
        </div>

        {/* ===== SUMMARY CARDS ===== */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <SummaryCard
            title='Available Balance'
            value={`${wallet.currency}${wallet.balance.toFixed(2)}`}
            icon={<GiTakeMyMoney />}
            color='green'
            subtitle='Ready for withdrawal'
            onClick={() => stripeAccount && setShowWithdrawalModal(true)}
          />
          <SummaryCard
            title='Total Earned'
            value={`${wallet.currency}${wallet.totalEarned.toFixed(2)}`}
            icon={<FaMoneyBillAlt />}
            color='blue'
            subtitle='All-time earnings'
          />
          <SummaryCard
            title='Pending Payouts'
            value={`${wallet.currency}${wallet.pending.toFixed(2)}`}
            icon={<FaClock />}
            color='amber'
            subtitle='Clearing in 2-3 days'
          />
          <SummaryCard
            title='Next Payout'
            value={new Date(wallet.nextPayoutDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            icon={<FaCalendarAlt />}
            color='purple'
            subtitle={`${wallet.payoutFrequency} schedule`}
          />
        </div>

        {/* ===== MAIN CONTENT GRID ===== */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Stripe Account Section - Left Column */}
          <div className='lg:col-span-2'>
            <StripeAccountCard
              account={stripeAccount}
              onEdit={(isNew) => {
                setStripeFormMode(isNew ? "connect" : "edit");
                setShowStripeForm(true);
              }}
              onUnlink={handleStripeAccountUnlink}
              onRefresh={handleStripeAccountRefresh}
            />
          </div>

          {/* Quick Stats - Right Column */}
          <div className='space-y-6'>
            <div className='bg-white rounded-xl border p-5'>
              <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <SiStripe className='text-purple-500' />
                Stripe Express Info
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Payouts Enabled</span>
                  <span
                    className={`font-semibold ${
                      stripeAccount?.payoutsEnabled
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {stripeAccount?.payoutsEnabled ? "Yes" : "No"}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Account Type</span>
                  <span className='font-semibold'>Express</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Withdrawal Fee</span>
                  <span className='font-semibold'>1.5%</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Processing Time</span>
                  <span className='font-semibold'>2-3 days</span>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5'>
              <h3 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                <SiStripe className='text-purple-600' />
                Stripe Express Benefits
              </h3>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-center gap-2'>
                  <FaCheckCircle className='text-green-500' />
                  <span className='text-gray-700'>Direct bank transfers</span>
                </li>
                <li className='flex items-center gap-2'>
                  <FaCheckCircle className='text-green-500' />
                  <span className='text-gray-700'>Low 1.5% fee</span>
                </li>
                <li className='flex items-center gap-2'>
                  <FaCheckCircle className='text-green-500' />
                  <span className='text-gray-700'>Secure & PCI compliant</span>
                </li>
                <li className='flex items-center gap-2'>
                  <FaCheckCircle className='text-green-500' />
                  <span className='text-gray-700'>24/7 support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== TRANSACTIONS TABLE ===== */}
        <div className='bg-white rounded-xl shadow overflow-hidden'>
          <div className='px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <FaHistory />
                Wallet Transactions
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                All your earnings and Stripe withdrawals
              </p>
            </div>

            <div className='relative'>
              <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search transactions...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              <FaHistory className='w-12 h-12 text-gray-300 mx-auto mb-4' />
              <p className='text-lg font-medium text-gray-900'>
                No transactions yet
              </p>
              <p className='text-gray-600 mt-1'>
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Transaction
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Type
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Method
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {txn.title}
                          </div>
                          <div className='text-xs text-gray-500'>
                            Ref: {txn.reference}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {txn.type === "credit" ? (
                          <span className='text-green-600 font-semibold flex items-center gap-1'>
                            <FaArrowUp /> Credit
                          </span>
                        ) : (
                          <span className='text-red-600 font-semibold flex items-center gap-1'>
                            <FaArrowDown /> Debit
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div
                          className={`font-semibold ${
                            txn.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}>
                          {txn.type === "credit" ? "+" : "-"}
                          {wallet.currency}
                          {txn.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                          {txn.method === "stripe" ? (
                            <>
                              <SiStripe className='text-purple-500' />
                              <span className='text-sm text-gray-700'>
                                Stripe Express
                              </span>
                            </>
                          ) : (
                            <>
                              <FaCreditCard className='text-gray-500' />
                              <span className='text-sm text-gray-700 capitalize'>
                                {txn.method}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {txn.status === "completed" ? (
                          <span className='text-green-600 font-semibold flex items-center gap-1'>
                            <FaCheckCircle /> Completed
                          </span>
                        ) : (
                          <span className='text-amber-600 font-semibold flex items-center gap-1'>
                            <FaClock /> Pending
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(txn.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StripeAccountForm
        isOpen={showStripeForm}
        onClose={() => setShowStripeForm(false)}
        account={stripeAccount}
        onSave={handleStripeAccountSave}
        mode={stripeFormMode}
      />

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        wallet={wallet}
        onSubmit={handleWithdrawalSubmit}
        stripeAccount={stripeAccount}
      />
    </div>
  );
}
