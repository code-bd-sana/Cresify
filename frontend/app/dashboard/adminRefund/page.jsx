'use client'
import { useAdminRefundQuery, useProcessRefundMutation } from '@/feature/refund/RefundApi';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheck, FiX, FiEye, FiFileText, FiImage, FiLink, FiUser, FiShoppingBag, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';

const AdminRefundpage = () => {
    const { data: session } = useSession();
    const adminId = session?.user?.id;
    
    // States
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [action, setAction] = useState('approve');
    const [partialAmount, setPartialAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // API calls
    const { data, isLoading, refetch } = useAdminRefundQuery({ page, limit });
    const [processRefund] = useProcessRefundMutation();
    
    // Data extraction
    const refunds = data?.refunds || [];
    const pagination = data?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

    // Helper functions
    const formatAmount = (amount, currency = 'usd') => {
        const symbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : '₹';
        return `${symbol}${amount?.toFixed(2) || '0.00'}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const config = {
            'approved': { bg: 'bg-[#E2FFE9]', text: 'text-[#38A169]', label: 'Approved', icon: <FiCheck /> },
            'rejected': { bg: 'bg-[#FFE2E2]', text: 'text-[#E53E3E]', label: 'Rejected', icon: <FiX /> },
            'requested': { bg: 'bg-[#FFF1E2]', text: 'text-[#F39C4A]', label: 'Pending', icon: <FiDollarSign /> },
            'processing': { bg: 'bg-[#E2F3FF]', text: 'text-[#3182CE]', label: 'Processing', icon: <FiDollarSign /> },
        };
        return config[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status || 'Unknown', icon: null };
    };

    const getEvidenceIcon = (type) => {
        return type === 'image' ? <FiImage className="text-blue-500" /> : <FiLink className="text-green-500" />;
    };

    const handleProcessRefund = async () => {
        if (!selectedRefund || !adminId) {
            setMessage({ type: 'error', text: 'Please select a refund and ensure you are logged in.' });
            return;
        }

        if (action === 'partial' && (!partialAmount || parseFloat(partialAmount) <= 0)) {
            setMessage({ type: 'error', text: 'Please enter a valid partial refund amount.' });
            return;
        }

        setIsProcessing(true);
        setMessage({ type: '', text: '' });

        try {
            const requestData = {
                refundId: selectedRefund._id,
                action: action,
                adminId: adminId
            };

            if (action === 'partial') {
                requestData.partialAmount = parseFloat(partialAmount);
            }

            console.log('Processing refund:', requestData);
            
            await processRefund(requestData).unwrap();
            
            setMessage({ type: 'success', text: `Refund ${action}d successfully!` });
            setSelectedRefund(null);
            setAction('approve');
            setPartialAmount('');
            refetch();
            
        } catch (error) {
            setMessage({ type: 'error', text: error?.data?.message || 'Failed to process refund.' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPage(newPage);
        }
    };

    // Log data to console
    console.log(data, "Admin Refund Data");

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Refund Management</h2>
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9838E1] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading refund data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Refund Management</h2>
            
            {/* Message Display */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            
            {/* Refund Details Modal */}
            {selectedRefund && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Refund Details</h3>
                            <button onClick={() => setSelectedRefund(null)} className="text-gray-500 hover:text-gray-700">
                                <MdClose size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiShoppingBag /> Refund Information
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Refund ID:</span>
                                            <span className="font-mono text-sm">{selectedRefund._id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-bold text-orange-500">
                                                {formatAmount(selectedRefund.amount, selectedRefund.currency)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedRefund.status).bg} ${getStatusBadge(selectedRefund.status).text}`}>
                                                {getStatusBadge(selectedRefund.status).icon}
                                                {getStatusBadge(selectedRefund.status).label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Requested:</span>
                                            <span className="text-gray-600">{formatDate(selectedRefund.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiUser /> Customer Information
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium">{selectedRefund.requestedBy?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="text-blue-600">{selectedRefund.requestedBy?.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span>{selectedRefund.requestedBy?.phoneNumber || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Seller Information */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-8">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FiUser /> Seller Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-gray-600 text-sm">Shop Name</p>
                                        <p className="font-medium">{selectedRefund.seller?.shopName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Seller Name</p>
                                        <p className="font-medium">{selectedRefund.seller?.name || selectedRefund.seller?.fullName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Email</p>
                                        <p className="text-blue-600">{selectedRefund.seller?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Reason */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FiFileText /> Refund Reason
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">{selectedRefund.reason || 'No reason provided'}</p>
                                </div>
                            </div>
                            
                            {/* Evidence */}
                            {selectedRefund.evidence && selectedRefund.evidence.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiImage /> Evidence ({selectedRefund.evidence.length})
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedRefund.evidence.map((evidence, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getEvidenceIcon(evidence.type)}
                                                    <span className="text-sm font-medium capitalize">{evidence.type}</span>
                                                </div>
                                                <a href={evidence.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                                                    {evidence.url}
                                                </a>
                                                {evidence.note && (
                                                    <p className="text-gray-600 text-sm mt-2">{evidence.note}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Items */}
                            {selectedRefund.items && selectedRefund.items.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-semibold text-gray-700 mb-3">Refund Items ({selectedRefund.items.length})</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedRefund.items.map((item, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="px-4 py-2 text-sm">Product ID: {item.product || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                                                        <td className="px-4 py-2 text-sm">{formatAmount(item.price, selectedRefund.currency)}</td>
                                                        <td className="px-4 py-2 text-sm font-medium">{formatAmount(item.amount, selectedRefund.currency)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            
                            {/* Action Form */}
                            {selectedRefund.status === 'requested' && (
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-gray-700 mb-4">Process Refund</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                                            <select
                                                value={action}
                                                onChange={(e) => setAction(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="approve">Approve Full Refund</option>
                                                <option value="partial">Approve Partial Refund</option>
                                                <option value="reject">Reject Refund</option>
                                            </select>
                                        </div>
                                        
                                        {action === 'partial' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Partial Amount (Max: {formatAmount(selectedRefund.amount, selectedRefund.currency)})
                                                </label>
                                                <input
                                                    type="number"
                                                    value={partialAmount}
                                                    onChange={(e) => setPartialAmount(e.target.value)}
                                                    min="0.01"
                                                    max={selectedRefund.amount}
                                                    step="0.01"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter amount"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setSelectedRefund(null)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                            disabled={isProcessing}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleProcessRefund}
                                            disabled={isProcessing}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                                                action === 'reject' 
                                                    ? 'bg-red-600 hover:bg-red-700' 
                                                    : 'bg-green-600 hover:bg-green-700'
                                            } disabled:opacity-50`}
                                        >
                                            {isProcessing ? 'Processing...' : 
                                             action === 'reject' ? 'Reject Refund' : 
                                             action === 'partial' ? 'Approve Partial' : 'Approve Refund'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="text-gray-600">
                    Total: <span className="font-bold">{pagination.total}</span> refund requests
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Items per page:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[5, 10, 20, 50].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Refunds Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {refunds.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No refund requests found
                                </td>
                            </tr>
                        ) : (
                            refunds.map((refund) => {
                                const statusBadge = getStatusBadge(refund.status);
                                
                                return (
                                    <tr key={refund._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-mono text-gray-900">
                                                {refund._id.substring(0, 10)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {refund.requestedBy?.name || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {refund.requestedBy?.email || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {refund.seller?.shopName || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {refund.seller?.name || refund.seller?.fullName || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-orange-600">
                                                {formatAmount(refund.amount, refund.currency)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                                {statusBadge.icon}
                                                {statusBadge.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(refund.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedRefund(refund)}
                                                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-[#9810FA]"
                                                >
                                                    <FiEye /> View Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 px-2 gap-4">
                    <div className="text-sm text-gray-600">
                        Page {page} of {pagination.pages}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`p-2 rounded-lg ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.pages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= pagination.pages - 2) {
                                pageNum = pagination.pages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                                        page === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pagination.pages}
                            className={`p-2 rounded-lg ${page === pagination.pages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Go to page:</span>
                        <input
                            type="number"
                            min="1"
                            max={pagination.pages}
                            value={page}
                            onChange={(e) => {
                                const newPage = Number(e.target.value);
                                if (newPage >= 1 && newPage <= pagination.pages) {
                                    handlePageChange(newPage);
                                }
                            }}
                            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRefundpage;