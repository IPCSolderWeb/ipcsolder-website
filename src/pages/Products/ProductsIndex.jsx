import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ProductsIndex = () => {
    const { t, ready } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isVisible, setIsVisible] = useState({});

    // Animation on scroll
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const timer = setTimeout(() => {
            const sections = document.querySelectorAll('[data-animate]');
            sections.forEach((section) => observer.observe(section));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    const categories = [
        { id: 'all', name: t('common.all') },
        { id: 'mro', name: 'MRO' },
        { id: 'esd', name: 'ESD' },
        { id: 'solder', name: 'SOLDER' },
        { id: 'machines', name: 'MACHINES' },
        { id: 'laser', name: 'LASER' },
        { id: 'tooling', name: 'TOOLING' }
    ];

    const handleCategoryFilter = (categoryId) => {
        setActiveCategory(categoryId);
        if (categoryId !== 'all') {
            const element = document.getElementById(categoryId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Si las traducciones no están listas, mostrar loading
    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-4">{t('common.loading')}</div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                            {t('products.breadcrumb.home')}
                        </a>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{t('products.breadcrumb.products')}</span>
                    </nav>
                </div>
            </div>

            {/* Page Hero */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' fill='%23ffffff'%3E%3Cpath d='M0,20 Q250,80 500,20 T1000,20 L1000,100 L0,100 Z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: '100% 100px'
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        id="hero-content"
                        data-animate
                        className={`transition-all duration-1000 ${isVisible['hero-content']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {t('products.hero.title')}
                        </h1>
                        <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4">
                            {t('products.hero.subtitle')}
                        </div>
                        <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {t('products.hero.description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Filter */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-center">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryFilter(category.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeCategory === category.id
                                        ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1'
                                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* MRO Category */}
                    <div className="mb-20 scroll-mt-32" id="mro">
                        <div
                            data-animate
                            className={`text-center mb-12 transition-all duration-1000 ${isVisible['mro-header']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            id="mro-header"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-lg">MRO</div>
                            </div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('products.categories.mro.title')}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('products.categories.mro.description')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* Termopares Tipo K */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/mro/thermocouples.jpg"
                                            alt={t('products.mro.thermocouples.title')}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.mro.thermocouples.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.mro.thermocouples.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.mro.thermocouples.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.mro.thermocouples.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* {t('products.mro.redGlue.title')} Chip Bonder */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/mro/red-glue.jpg"
                                            alt="{t('products.mro.redGlue.title')}"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.mro.redGlue.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.mro.redGlue.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.mro.redGlue.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.mro.redGlue.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Isopropyl Alcohol (IPA) */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/mro/ipa.jpg"
                                            alt={t('products.mro.ipa.title')}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.mro.ipa.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.mro.ipa.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.mro.ipa.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.mro.ipa.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* F37 Gel Nozzle Cleaner */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/mro/nozzle-cleaner.jpg"
                                            alt="F37 Gel Nozzle Cleaner"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.mro.nozzleCleaner.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.mro.nozzleCleaner.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.mro.nozzleCleaner.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.mro.nozzleCleaner.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Router Bits */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/mro/router-bits.jpg"
                                            alt="Router Bits"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.mro.routerBits.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.mro.routerBits.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.mro.routerBits.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.mro.routerBits.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>
                        </div>
                    </div>

                    {/* ESD Category */}
                    <div className="mb-20 scroll-mt-32" id="esd">
                        <div
                            data-animate
                            className={`text-center mb-12 transition-all duration-1000 ${isVisible['esd-header']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            id="esd-header"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-lg">ESD</div>
                            </div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('products.categories.esd.title')}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('products.categories.esd.description')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Trays and Bins ESD Safe */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/esd/trays-bins.jpg"
                                            alt="Trays and Bins ESD Safe"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.esd.traysAndBins.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.esd.traysAndBins.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.esd.traysAndBins.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.esd.traysAndBins.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Conductive EVA Sheets */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/esd/eva-sheets.jpg"
                                            alt="Conductive EVA Sheets"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.esd.evaSheets.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.esd.evaSheets.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.esd.evaSheets.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.esd.evaSheets.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>
                        </div>
                    </div>

                    {/* SOLDER Category */}
                    <div className="mb-20 scroll-mt-32" id="solder">
                        <div
                            data-animate
                            className={`text-center mb-12 transition-all duration-1000 ${isVisible['solder-header']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            id="solder-header"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-sm">SOLDER</div>
                            </div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('products.categories.solder.title')}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('products.categories.solder.description')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* Solder Bars */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/solder/solder-bars.jpg"
                                            alt="Solder Bars"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.solder.solderBars.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.solder.solderBars.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.solder.solderBars.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.solder.solderBars.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Solder Wires */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/solder/solder-wires.jpg"
                                            alt="Solder Wires"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.solder.solderWire.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.solder.solderWire.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.solder.solderWire.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.solder.solderWire.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Liquid Flux */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/solder/liquid-flux.jpg"
                                            alt="Liquid Flux"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.solder.liquidFlux.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.solder.liquidFlux.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.solder.liquidFlux.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.solder.liquidFlux.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Solder Preforms */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/solder/solder-preforms.jpg"
                                            alt="Solder Preforms"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.solder.preforms.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.solder.preforms.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.solder.preforms.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.solder.preforms.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>
                        </div>
                    </div>

                    {/* MACHINES Category */}
                    <div className="mb-20 scroll-mt-32" id="machines">
                        <div
                            data-animate
                            className={`text-center mb-12 transition-all duration-1000 ${isVisible['machines-header']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            id="machines-header"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-xs">MACHINES</div>
                            </div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('products.categories.machines.title')}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('products.categories.machines.description')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Machine Spares */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/machines/machine-spares.jpg"
                                            alt="Machine Spares"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.machines.spareParts.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.machines.spareParts.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.machines.spareParts.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.machines.spareParts.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Preventive Maintenance & Repair Service */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/machines/maintenance-service.jpg"
                                            alt="Maintenance Service"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.machines.maintenance.title')} y {t('products.machines.repair.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.machines.maintenance.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.machines.maintenance.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.machines.maintenance.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>
                        </div>
                    </div>

                    {/* LASER Category */}
                    <div className="mb-20 scroll-mt-32" id="laser">
                        <div
                            data-animate
                            className={`text-center mb-12 transition-all duration-1000 ${isVisible['laser-header']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            id="laser-header"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-sm">LASER</div>
                            </div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('products.categories.laser.title')}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('products.categories.laser.description')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* Precision Cutting */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/laser/precision-cutting.jpg"
                                            alt="Precision Cutting"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.laser.precisionCutting.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.laser.precisionCutting.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.laser.precisionCutting.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.laser.precisionCutting.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Laser Engraving */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/laser/laser-engraving.jpg"
                                            alt="Laser Engraving"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.laser.laserEngraving.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.laser.laserEngraving.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.laser.laserEngraving.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.laser.laserEngraving.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Inspection Templates */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/laser/inspection-templates.jpg"
                                            alt="Inspection Templates"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.laser.inspectionTemplates.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.laser.inspectionTemplates.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.laser.inspectionTemplates.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.laser.inspectionTemplates.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>
                        </div>
                    </div>

                    {/* TOOLING Category */}
                    <div className="mb-20 scroll-mt-32" id="tooling">
                        <div
                            data-animate
                            className={`text-center mb-12 transition-all duration-1000 ${isVisible['tooling-header']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            id="tooling-header"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-sm">TOOLING</div>
                            </div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('products.categories.tooling.title')}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('products.categories.tooling.description')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* Squeegees */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/tooling/squeegees.jpg"
                                            alt="Squeegees"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.tooling.squeegees.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.tooling.squeegees.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.tooling.squeegees.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.tooling.squeegees.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Board Holders */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/tooling/board-holders.jpg"
                                            alt="Board Holders"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.tooling.cardHolders.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.tooling.cardHolders.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.tooling.cardHolders.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.tooling.cardHolders.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Router Plates */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/tooling/router-plates.jpg"
                                            alt="Router Plates"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.tooling.routerPlates.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.tooling.routerPlates.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.tooling.routerPlates.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.tooling.routerPlates.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Pallets */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/tooling/pallets.jpg"
                                            alt="Pallets"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.tooling.palletsFixtures.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.tooling.palletsFixtures.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.tooling.palletsFixtures.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.tooling.palletsFixtures.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>

                            {/* Fixtures */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/products/tooling/fixtures.jpg"
                                            alt="Fixtures"
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium" style={{ display: 'none' }}>
                                            IMG
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-1">
                                            {t('products.tooling.palletsFixtures.title')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t('products.tooling.palletsFixtures.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {t('products.tooling.palletsFixtures.description')}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {t('products.tooling.palletsFixtures.features', { returnObjects: true }).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div><a href="/contacto" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</a></div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        data-animate
                        className={`transition-all duration-1000 ${isVisible['cta-section']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                        id="cta-section"
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            {t('products.cta.title')}
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            {t('products.cta.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/contacto" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                                {t('products.cta.primaryButton')}
                            </a>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                                {t('products.cta.secondaryButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductsIndex;




