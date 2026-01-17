import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ProductsIndex = () => {
    const { t, ready, i18n } = useTranslation();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isVisible, setIsVisible] = useState({});
    
    // Estado para el modal de catálogo
    const [showCatalogModal, setShowCatalogModal] = useState(false);
    const [catalogForm, setCatalogForm] = useState({
        email: '',
        name: '',
        company: '',
        subscribeNewsletter: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    // Verificar si hay un filtro específico solicitado desde Home
    useEffect(() => {
        const selectedCategory = localStorage.getItem('selectedProductCategory');
        if (selectedCategory) {
            // Aplicar el filtro específico
            setActiveCategory(selectedCategory);
            // Limpiar el localStorage para futuras visitas
            localStorage.removeItem('selectedProductCategory');
            // Hacer scroll a la categoría específica después de un breve delay
            setTimeout(() => {
                const element = document.getElementById(selectedCategory);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    }, []);

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
        } else {
            // Scroll al top cuando selecciona "Todos"
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Función para manejar navegación a contacto
    const handleQuoteRequest = (e) => {
        e.preventDefault();
        navigate('/contacto');
        // Scroll al top después de la navegación
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    // Función para abrir modal de catálogo
    const handleCatalogDownload = () => {
        setShowCatalogModal(true);
        setSubmitMessage({ type: '', text: '' });
    };

    // Función para manejar cambios en el formulario
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCatalogForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Función para enviar formulario y descargar catálogo
    const handleCatalogSubmit = async (e) => {
        e.preventDefault();
        
        // Validar email
        if (!catalogForm.email || !catalogForm.email.includes('@')) {
            setSubmitMessage({
                type: 'error',
                text: i18n.language === 'es' ? 'Por favor ingresa un email válido' : 'Please enter a valid email'
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            // Llamar a la API para registrar la descarga
            const response = await fetch('/api/catalog/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: catalogForm.email,
                    name: catalogForm.name,
                    company: catalogForm.company,
                    subscribeNewsletter: catalogForm.subscribeNewsletter,
                    language: i18n.language,
                    source: 'products-page'
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Mostrar mensaje de éxito
                setSubmitMessage({
                    type: 'success',
                    text: i18n.language === 'es' 
                        ? '¡Gracias! Tu descarga comenzará en un momento...' 
                        : 'Thank you! Your download will start shortly...'
                });

                // Iniciar descarga del PDF
                setTimeout(() => {
                    window.open('/documents/catalogoIPCSolder.pdf', '_blank');
                    
                    // Cerrar modal después de 2 segundos
                    setTimeout(() => {
                        setShowCatalogModal(false);
                        setCatalogForm({
                            email: '',
                            name: '',
                            company: '',
                            subscribeNewsletter: false
                        });
                    }, 2000);
                }, 500);

            } else {
                setSubmitMessage({
                    type: 'error',
                    text: data.error || (i18n.language === 'es' ? 'Error al procesar la solicitud' : 'Error processing request')
                });
            }
        } catch (error) {
            console.error('Error submitting catalog form:', error);
            setSubmitMessage({
                type: 'error',
                text: i18n.language === 'es' 
                    ? 'Error de conexión. Por favor intenta de nuevo.' 
                    : 'Connection error. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Si las traducciones no est�n listas, mostrar contenido con placeholders
    if (!ready) {
        return (
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
                        </div>
                    </div>
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
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/mro/thermocouples-k.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.mro.thermocouples.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.mro.thermocouples.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.mro.thermocouples.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.mro.thermocouples.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Red Glue Chip Bonder */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/mro/red-glue.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.mro.redGlue.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.mro.redGlue.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.mro.redGlue.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.mro.redGlue.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Isopropyl Alcohol (IPA) */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/mro/ipa-alcohol.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.mro.ipa.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.mro.ipa.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.mro.ipa.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.mro.ipa.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* F37 Gel Nozzle Cleaner */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/mro/nozzle-cleaner.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.mro.nozzleCleaner.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.mro.nozzleCleaner.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.mro.nozzleCleaner.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.mro.nozzleCleaner.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Router Bits */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/mro/router-bits.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.mro.routerBits.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.mro.routerBits.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.mro.routerBits.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.mro.routerBits.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
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
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/esd/trays-bins.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.esd.traysAndBins.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.esd.traysAndBins.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.esd.traysAndBins.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.esd.traysAndBins.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Conductive EVA Sheets */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/esd/eva-sheets.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.esd.evaSheets.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.esd.evaSheets.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.esd.evaSheets.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.esd.evaSheets.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
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
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/solder/solder-bars.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.solder.solderBars.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.solder.solderBars.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.solder.solderBars.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.solder.solderBars.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Solder Wires */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/solder/solder-wire.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.solder.solderWire.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.solder.solderWire.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.solder.solderWire.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.solder.solderWire.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Liquid Flux */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/solder/liquid-flux.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.solder.liquidFlux.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.solder.liquidFlux.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.solder.liquidFlux.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.solder.liquidFlux.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Solder Preforms */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/solder/preforms.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.solder.preforms.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.solder.preforms.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.solder.preforms.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.solder.preforms.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Solder Paste */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/solder/solder-paste.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.solder.solderPaste.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.solder.solderPaste.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-4 leading-relaxed">
                                        {t('products.solder.solderPaste.description')}
                                    </p>

                                    {/* Aleaciones Lead Free y Leaded */}
                                    <div className="mb-4 space-y-2">
                                        <div className="bg-white bg-opacity-10 rounded-lg p-3">
                                            <p className="text-green-400 font-semibold text-sm mb-1">
                                                ✓ {t('products.solder.solderPaste.leadFree.title')}
                                            </p>
                                            <p className="text-gray-200 text-xs">
                                                {t('products.solder.solderPaste.leadFree.alloys', { returnObjects: true }).join(' • ')}
                                            </p>
                                        </div>
                                        <div className="bg-white bg-opacity-10 rounded-lg p-3">
                                            <p className="text-blue-400 font-semibold text-sm mb-1">
                                                ✓ {t('products.solder.solderPaste.leaded.title')}
                                            </p>
                                            <p className="text-gray-200 text-xs">
                                                {t('products.solder.solderPaste.leaded.alloys', { returnObjects: true }).join(' • ')}
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.solder.solderPaste.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Rework & Touch Up */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/solder/rework-touchup.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.solder.reworkTouchUp.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.solder.reworkTouchUp.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-4 leading-relaxed">
                                        {t('products.solder.reworkTouchUp.description')}
                                    </p>

                                    {/* Liquid Flux y Gel Flux */}
                                    <div className="mb-4 space-y-3">
                                        <div className="bg-white bg-opacity-10 rounded-lg p-3">
                                            <p className="text-cyan-400 font-semibold text-sm mb-2">
                                                💧 {t('products.solder.reworkTouchUp.liquidFlux.title')}
                                            </p>
                                            <ul className="space-y-1">
                                                {t('products.solder.reworkTouchUp.liquidFlux.features', { returnObjects: true }).map((feature, index) => (
                                                    <li key={index} className="flex items-center text-xs text-gray-200">
                                                        <span className="text-green-400 mr-2">✓</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-white bg-opacity-10 rounded-lg p-3">
                                            <p className="text-purple-400 font-semibold text-sm mb-2">
                                                🧪 {t('products.solder.reworkTouchUp.gelFlux.title')}
                                            </p>
                                            <ul className="space-y-1">
                                                {t('products.solder.reworkTouchUp.gelFlux.features', { returnObjects: true }).map((feature, index) => (
                                                    <li key={index} className="flex items-center text-xs text-gray-200">
                                                        <span className="text-green-400 mr-2">✓</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
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
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/machines/spare-parts.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.machines.spareParts.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.machines.spareParts.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.machines.spareParts.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.machines.spareParts.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Preventive Maintenance & Repair Service */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/machines/maintenance.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.machines.maintenance.title')} y {t('products.machines.repair.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.machines.maintenance.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.machines.maintenance.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.machines.maintenance.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
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
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/laser/precision-cutting.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.laser.precisionCutting.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.laser.precisionCutting.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.laser.precisionCutting.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.laser.precisionCutting.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Laser Engraving */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/laser/laser-engraving.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.laser.laserEngraving.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.laser.laserEngraving.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.laser.laserEngraving.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.laser.laserEngraving.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Inspection Templates */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/laser/inspection-templates.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.laser.inspectionTemplates.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.laser.inspectionTemplates.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.laser.inspectionTemplates.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.laser.inspectionTemplates.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
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
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/tooling/squeegees.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.tooling.squeegees.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.tooling.squeegees.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.tooling.squeegees.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.tooling.squeegees.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Board Holders */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/tooling/card-holders.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.tooling.cardHolders.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.tooling.cardHolders.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.tooling.cardHolders.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.tooling.cardHolders.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Router Plates */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/tooling/router-plates.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.tooling.routerPlates.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.tooling.routerPlates.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.tooling.routerPlates.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.tooling.routerPlates.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
                            </div>

                            {/* Pallets */}
                            <div 
                                className="relative rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/images/products/tooling/pallets-fixtures.webp)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Overlay semitransparente */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
                                
                                {/* Contenido */}
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('products.tooling.palletsFixtures.title')}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {t('products.tooling.palletsFixtures.subtitle')}
                                        </p>
                                    </div>

                                    <p className="text-gray-100 mb-6 leading-relaxed">
                                        {t('products.tooling.palletsFixtures.description')}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {t('products.tooling.palletsFixtures.features', { returnObjects: true }).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-200">
                                                <span className="text-green-400 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div><button onClick={handleQuoteRequest} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">{t('products.actions.quote')}</button></div>
                                </div>
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
                            <button
                                onClick={handleQuoteRequest}
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                            >
                                {t('products.cta.primaryButton')}
                            </button>
                            <button 
                                onClick={handleCatalogDownload}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                {t('products.cta.secondaryButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Descarga de Catálogo */}
            {showCatalogModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Header del Modal */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-6 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {i18n.language === 'es' ? '📄 Descargar Catálogo' : '📄 Download Catalog'}
                                </h3>
                                <button
                                    onClick={() => setShowCatalogModal(false)}
                                    className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
                                    disabled={isSubmitting}
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-blue-100 mt-2">
                                {i18n.language === 'es' 
                                    ? 'Completa el formulario para acceder a nuestro catálogo completo' 
                                    : 'Complete the form to access our complete catalog'}
                            </p>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleCatalogSubmit} className="p-6 space-y-4">
                            {/* Email (Requerido) */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    {i18n.language === 'es' ? 'Email' : 'Email'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={catalogForm.email}
                                    onChange={handleFormChange}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder={i18n.language === 'es' ? 'tu@email.com' : 'your@email.com'}
                                />
                            </div>

                            {/* Nombre (Opcional) */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    {i18n.language === 'es' ? 'Nombre' : 'Name'} <span className="text-gray-400 text-xs">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={catalogForm.name}
                                    onChange={handleFormChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder={i18n.language === 'es' ? 'Juan Pérez' : 'John Doe'}
                                />
                            </div>

                            {/* Empresa (Opcional) */}
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                    {i18n.language === 'es' ? 'Empresa' : 'Company'} <span className="text-gray-400 text-xs">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={catalogForm.company}
                                    onChange={handleFormChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder={i18n.language === 'es' ? 'Tu Empresa S.A.' : 'Your Company Inc.'}
                                />
                            </div>

                            {/* Checkbox Newsletter */}
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="subscribeNewsletter"
                                    name="subscribeNewsletter"
                                    checked={catalogForm.subscribeNewsletter}
                                    onChange={handleFormChange}
                                    disabled={isSubmitting}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                                />
                                <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-700">
                                    {i18n.language === 'es' 
                                        ? 'Suscribirme al newsletter para recibir novedades y artículos técnicos' 
                                        : 'Subscribe to newsletter to receive updates and technical articles'}
                                </label>
                            </div>

                            {/* Mensaje de estado */}
                            {submitMessage.text && (
                                <div className={`p-3 rounded-lg ${
                                    submitMessage.type === 'success' 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                    {submitMessage.text}
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCatalogModal(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {i18n.language === 'es' ? 'Cancelar' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {i18n.language === 'es' ? 'Procesando...' : 'Processing...'}
                                        </>
                                    ) : (
                                        <>
                                            📥 {i18n.language === 'es' ? 'Descargar Catálogo' : 'Download Catalog'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsIndex;





