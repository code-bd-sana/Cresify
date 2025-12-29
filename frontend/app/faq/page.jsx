'use client'
import React from 'react';
import { ChevronDown, HelpCircle, FileText, CreditCard, Shield, Truck, Headphones, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQPage = () => {
    const { t } = useTranslation('faq');
    const [openItems, setOpenItems] = React.useState({});

    const toggleItem = (categoryKey, questionIndex) => {
        const key = `${categoryKey}-${questionIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const categories = [
        { key: 'general', icon: <HelpCircle className="w-5 h-5" /> },
        { key: 'billing', icon: <CreditCard className="w-5 h-5" /> },
        { key: 'security', icon: <Shield className="w-5 h-5" /> },
        { key: 'shipping', icon: <Truck className="w-5 h-5" /> },
        { key: 'support', icon: <Headphones className="w-5 h-5" /> },
        { key: 'technical', icon: <Package className="w-5 h-5" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F9F7FF] to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#9838E1] to-[#F68E44] py-16 px-6">
                <div className="max-w-6xl mx-auto text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t('meta.title')}
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                        {t('meta.description')}
                    </p>
                    <div className="mt-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('meta.search_placeholder')}
                                className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <div className="absolute right-3 top-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {categories.map((category, categoryIndex) => {
                        const categoryData = t(`categories.${category.key}`, { returnObjects: true });
                        const questions = categoryData.questions || [];
                        
                        return (
                            <div 
                                key={category.key}
                                className="bg-white rounded-2xl shadow-lg p-6 border border-[#ECE6F7] hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-[#9838E1]/10 to-[#F68E44]/10">
                                        {React.cloneElement(category.icon, { className: "w-6 h-6 text-[#9838E1]" })}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {categoryData.title}
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {questions.map((item, questionIndex) => (
                                        <div 
                                            key={questionIndex}
                                            className="border border-[#ECE6F7] rounded-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleItem(category.key, questionIndex)}
                                                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <span className="font-semibold text-gray-800 pr-4">
                                                    {item.question}
                                                </span>
                                                <ChevronDown 
                                                    className={`w-5 h-5 text-[#9838E1] transition-transform duration-300 ${
                                                        openItems[`${category.key}-${questionIndex}`] ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            
                                            <div 
                                                className={`px-4 overflow-hidden transition-all duration-300 ${
                                                    openItems[`${category.key}-${questionIndex}`] 
                                                        ? 'max-h-96 pb-4' 
                                                        : 'max-h-0'
                                                }`}
                                            >
                                                <p className="text-gray-600 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Still Have Questions Section */}
                <div className="mt-16 bg-gradient-to-r from-[#9838E1] to-[#F68E44] rounded-3xl p-8 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">
                            {t('cta.title')}
                        </h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                            {t('cta.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-white text-[#9838E1] font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                                {t('cta.contact_support')}
                            </button>
                            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors duration-300">
                                {t('cta.schedule_call')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#ECE6F7] shadow-sm">
                        <FileText className="w-8 h-8 text-[#9838E1] mb-4" />
                        <h3 className="font-bold text-gray-800 mb-2">
                            {t('quick_links.documentation.title')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {t('quick_links.documentation.description')}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[#ECE6F7] shadow-sm">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#9838E1] to-[#F68E44] rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">
                            {t('quick_links.video_tutorials.title')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {t('quick_links.video_tutorials.description')}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[#ECE6F7] shadow-sm">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#9838E1] to-[#F68E44] rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">
                            {t('quick_links.community_forum.title')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {t('quick_links.community_forum.description')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;