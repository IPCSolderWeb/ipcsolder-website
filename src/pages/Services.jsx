import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    HiArrowRight as ArrowRight
} from 'react-icons/hi';

const Services = ({ currentLanguage = 'es' }) => {
    const { t, ready, i18n } = useTranslation();
    const navigate = useNavigate();
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

    const handleCTA = (action) => {
        console.log(`📞 Services: CTA clicked - ${action}`);

        // Mapeo de servicios a mensajes pre-llenados
        const getServiceMessage = (service, lang) => {
            const messages = {
                'assessment': {
                    'es': 'Solicito un assessment gratuito de mi línea de producción',
                    'en': 'I request a free assessment of my production line'
                },
                'consulting': {
                    'es': 'Me interesa consultoría de procesos para optimizar mi producción',
                    'en': 'I\'m interested in process consulting to optimize my production'
                },
                'support': {
                    'es': 'Necesito soporte técnico especializado',
                    'en': 'I need specialized technical support'
                },
                'documentation': {
                    'es': 'Solicito fichas técnicas y documentación especializada',
                    'en': 'I request technical sheets and specialized documentation'
                },
                'field-services': {
                    'es': 'Me interesa agendar una visita de servicios de campo',
                    'en': 'I\'m interested in scheduling a field services visit'
                },
                'analysis': {
                    'es': 'Solicito análisis y reportes de mi línea de producción',
                    'en': 'I request analysis and reports of my production line'
                }
            };

            return messages[service] ? messages[service][lang] : messages['assessment'][lang];
        };

        switch (action) {
            case 'assessment':
            case 'consulting':
            case 'support':
            case 'documentation':
            case 'field-services':
            case 'analysis':
                {
                    const contactUrl = i18n.language === 'es' ? '/contacto' : '/contact';
                    const subject = getServiceMessage(action, i18n.language);
                    navigate(`${contactUrl}?service=${action}&subject=${encodeURIComponent(subject)}&lang=${i18n.language}`);
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                }
                break;
            case 'contact':
                navigate('/contacto');
                window.scrollTo(0, 0);
                break;
            case 'products':
                navigate('/productos');
                window.scrollTo(0, 0);
                break;
            default:
                console.log(`Undefined action: ${action}`);
        }
    };

    // If translations are not ready, show loading
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
                            {t('services.breadcrumb.home')}
                        </a>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{t('services.breadcrumb.services')}</span>
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
                            {t('services.hero.title')}
                        </h1>
                        <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4">
                            {t('services.hero.subtitle')}
                        </div>
                        <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {t('services.hero.description')}
                        </p>
                    </div>
                </div>
            </section>
            {/* Value Proposition Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-6">{t('services.valueProp.title')}</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {t('services.valueProp.paragraph1')}
                            </p>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {t('services.valueProp.paragraph2')}
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {t('services.valueProp.paragraph3')}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl p-10 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='20' cy='20' r='2' fill='white' opacity='0.1'/%3E%3Ccircle cx='80' cy='40' r='1.5' fill='white' opacity='0.1'/%3E%3Ccircle cx='40' cy='80' r='1' fill='white' opacity='0.1'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'repeat'
                                }} />
                            </div>
                            <div className="relative z-10">
                                <div className="text-7xl mb-5">🎯</div>
                                <h3 className="text-2xl font-bold mb-4">{t('services.valueProp.assessmentCard.title')}</h3>
                                <p className="text-blue-100">
                                    {t('services.valueProp.assessmentCard.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>      {/*
 Services Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('services.servicesSection.title')}</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('services.servicesSection.description')}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {/* Assessment de Líneas */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">🔍</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('services.servicesSection.assessment.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('services.servicesSection.assessment.description')}
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                {t('services.servicesSection.assessment.features', { returnObjects: true }).map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCTA('assessment')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t('services.servicesSection.assessment.button')}
                            </button>
                        </div>
                        {/* Consultoría de Procesos */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">⚡</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('services.servicesSection.consulting.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('services.servicesSection.consulting.description')}
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                {t('services.servicesSection.consulting.features', { returnObjects: true }).map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCTA('consulting')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t('services.servicesSection.consulting.button')}
                            </button>
                        </div>
                        {/* Soporte Técnico Especializado */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">🛠️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('services.servicesSection.support.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('services.servicesSection.support.description')}
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                {t('services.servicesSection.support.features', { returnObjects: true }).map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCTA('support')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t('services.servicesSection.support.button')}
                            </button>
                        </div>
                        {/* Fichas Técnicas y Documentación */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">📋</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('services.servicesSection.documentation.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('services.servicesSection.documentation.description')}
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                {t('services.servicesSection.documentation.features', { returnObjects: true }).map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCTA('documentation')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t('services.servicesSection.documentation.button')}
                            </button>
                        </div>
                        {/* Servicios de Campo */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">🏭</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('services.servicesSection.fieldServices.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('services.servicesSection.fieldServices.description')}
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                {t('services.servicesSection.fieldServices.features', { returnObjects: true }).map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCTA('field-services')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t('services.servicesSection.fieldServices.button')}
                            </button>
                        </div>
                        {/* Análisis y Reportes */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('services.servicesSection.analysis.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('services.servicesSection.analysis.description')}
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                {t('services.servicesSection.analysis.features', { returnObjects: true }).map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCTA('analysis')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t('services.servicesSection.analysis.button')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Process Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('services.process.title')}</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('services.process.description')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8">
                        {t('services.process.steps', { returnObjects: true }).map((step, index) => (
                            <div key={index} className={`text-center ${index < 4 ? 'relative' : ''}`}>
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold relative z-10">
                                    {index + 1}
                                </div>
                                <h3 className="text-lg font-semibold text-blue-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 text-sm">
                                    {step.description}
                                </p>
                                {index < 4 && (
                                    <div className="hidden md:block absolute top-10 left-full w-8 h-0.5 bg-gray-200 z-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Industries Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">{t('services.industries.title')}</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('services.industries.description')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {t('services.industries.list', { returnObjects: true }).map((industry, index) => {
                            const icons = ['📱', '🚗', '🏭', '📡', '⚙️', '🔬'];
                            return (
                                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mx-auto mb-5 text-white">
                                        <span className="text-2xl">{icons[index]}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-900 mb-3">{industry.title}</h3>
                                    <p className="text-gray-600 text-sm">
                                        {industry.description}
                                    </p>
                                </div>
                            );
                        })}
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
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            {t('services.cta.title')}
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                            {t('services.cta.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => handleCTA('assessment')}
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <span>{t('services.cta.primaryButton')}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="bg-transparent border-2 border-blue-300 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                            >
                                {t('services.cta.secondaryButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;