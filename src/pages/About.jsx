import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    HiArrowRight as ArrowRight,
    HiCheckCircle as CheckCircle
} from 'react-icons/hi';

const About = ({ currentLanguage = 'es' }) => {
    const [isVisible, setIsVisible] = useState({});
    const { t, ready } = useTranslation();

    // Animation on scroll with performance optimization
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for better performance
                    requestAnimationFrame(() => {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    });
                    // Stop observing once animated to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Delay observation to ensure DOM is ready
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
        // Handle CTA actions - could integrate with analytics or routing
        if (action === 'about-primary') {
            // Navigate to contact form or open contact modal
            window.location.href = '/contact';
        } else if (action === 'about-secondary') {
            // Navigate to products page
            window.location.href = '/products';
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

    // Component is ready to render

    return (
        <div className="bg-white">

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                            {t('about.breadcrumb.home')}
                        </a>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{t('about.breadcrumb.about')}</span>
                    </nav>
                </div>
            </div>

            {/* Page Hero */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-20 overflow-hidden">
                {/* Background Pattern */}
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
                            {t('about.hero.title')}
                        </h1>
                        <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4">
                            {t('about.hero.subtitle')}
                        </div>
                        <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {t('about.hero.description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section - Historia */}
            <section className="py-20 bg-white" id="historia">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        id="about-content"
                        data-animate
                        className={`grid lg:grid-cols-2 gap-16 items-center mb-20 transition-all duration-1000 ${isVisible['about-content']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <div className="about-text">
                            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6 leading-tight">
                                {t('about.history.title')}
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {t('about.history.paragraph1')}
                            </p>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {t('about.history.paragraph2')}
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {t('about.history.paragraph3')}
                            </p>
                        </div>

                        <div className="about-image bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl p-10 text-white text-center relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='20' cy='20' r='2' fill='white' opacity='0.3'/%3E%3Ccircle cx='80' cy='40' r='1.5' fill='white' opacity='0.3'/%3E%3Ccircle cx='40' cy='80' r='1' fill='white' opacity='0.3'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'repeat'
                                }} />
                            </div>

                            <div className="relative z-10">
                                <div className="text-7xl mb-6">🏭</div>
                                <h3 className="text-2xl font-bold mb-4">{t('about.history.imageTitle')}</h3>
                                <p className="text-blue-100 leading-relaxed">
                                    {t('about.history.imageDescription')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div
                        id="stats"
                        data-animate
                        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 transition-all duration-1000 ${isVisible['stats']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <div className="stat-card bg-gray-50 rounded-xl p-8 text-center hover:bg-blue-50 transition-colors duration-300">
                            <div className="text-5xl font-bold text-blue-600 mb-3">{t('about.stats.experience.number')}</div>
                            <div className="text-gray-600 font-medium">{t('about.stats.experience.label')}</div>
                        </div>
                        <div className="stat-card bg-gray-50 rounded-xl p-8 text-center hover:bg-blue-50 transition-colors duration-300">
                            <div className="text-5xl font-bold text-blue-600 mb-3">{t('about.stats.divisions.number')}</div>
                            <div className="text-gray-600 font-medium">{t('about.stats.divisions.label')}</div>
                        </div>
                        <div className="stat-card bg-gray-50 rounded-xl p-8 text-center hover:bg-blue-50 transition-colors duration-300">
                            <div className="text-5xl font-bold text-blue-600 mb-3">{t('about.stats.experts.number')}</div>
                            <div className="text-gray-600 font-medium">{t('about.stats.experts.label')}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values Section */}
            <section className="py-20 bg-gray-50" id="mision">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        id="mission-header"
                        data-animate
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible['mission-header']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                            {t('about.mission.sectionTitle')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('about.mission.sectionDescription')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Misión */}
                        <div
                            id="mission-card"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${isVisible['mission-card']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white text-2xl">
                                🎯
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('about.mission.mission.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">{t('about.mission.mission.description')}</p>
                        </div>

                        {/* Visión */}
                        <div
                            id="vision-card"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${isVisible['vision-card']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '150ms' }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white text-2xl">
                                👁️
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('about.mission.vision.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">{t('about.mission.vision.description')}</p>
                        </div>

                        {/* Valores */}
                        <div
                            id="values-card"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${isVisible['values-card']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '300ms' }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white text-2xl">
                                ⭐
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('about.mission.values.title')}</h3>
                            

                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p className="text-gray-600 leading-relaxed">{t('about.mission.values.description')}</p>
                                <p><strong className="text-blue-900">{t('about.mission.values.experience.title')}:</strong> {t('about.mission.values.experience.description')}</p>
                                <p><strong className="text-blue-900">{t('about.mission.values.solutions.title')}:</strong> {t('about.mission.values.solutions.description')}</p>
                                <p><strong className="text-blue-900">{t('about.mission.values.commitment.title')}:</strong> {t('about.mission.values.commitment.description')}</p>
                                <p><strong className="text-blue-900">{t('about.mission.values.working.title')}:</strong> {t('about.mission.values.working.description')}</p>
                                <p><strong className="text-blue-900">{t('about.mission.values.responsibility.title')}:</strong> {t('about.mission.values.responsibility.description')}</p>
                            </div>
                        </div>

                        {/* Diferenciadores */}
                        <div
                            id="differentiators-card"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${isVisible['differentiators-card']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '450ms' }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white text-2xl">
                                🤝
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('about.mission.differentiators.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">{t('about.mission.differentiators.description')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section 
            <section className="py-20 bg-white" id="equipo">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        id="team-header"
                        data-animate
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible['team-header']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                            {t('about.team.sectionTitle')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            {t('about.team.sectionDescription')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"> */}
                        {/* Team Member 1 
                        <div
                            id="member-1"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 text-center ${isVisible['member-1']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                                {t('about.team.members.member1.initials')}
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2">{t('about.team.members.member1.name')}</h3>
                            <p className="text-blue-600 font-medium mb-3">{t('about.team.members.member1.role')}</p>
                            <div className="text-2xl font-bold text-green-600 mb-3">{t('about.team.members.member1.experience')}</div>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{t('about.team.members.member1.description')}</p>
                            <ul className="text-left text-sm space-y-2">
                                {t('about.team.members.member1.specialties', { returnObjects: true }).map((specialty, index) => (
                                    <li key={index} className="text-gray-600 flex items-start">
                                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{specialty}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>*/}

                        {/* Team Member 2 
                        <div
                            id="member-2"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 text-center ${isVisible['member-2']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '150ms' }}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                                {t('about.team.members.member2.initials')}
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2">{t('about.team.members.member2.name')}</h3>
                            <p className="text-blue-600 font-medium mb-3">{t('about.team.members.member2.role')}</p>
                            <div className="text-2xl font-bold text-green-600 mb-3">{t('about.team.members.member2.experience')}</div>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{t('about.team.members.member2.description')}</p>
                            <ul className="text-left text-sm space-y-2">
                                {t('about.team.members.member2.specialties', { returnObjects: true }).map((specialty, index) => (
                                    <li key={index} className="text-gray-600 flex items-start">
                                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{specialty}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>*/}

                        {/* Team Member 3 
                        <div
                            id="member-3"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 text-center ${isVisible['member-3']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '300ms' }}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                                {t('about.team.members.member3.initials')}
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2">{t('about.team.members.member3.name')}</h3>
                            <p className="text-blue-600 font-medium mb-3">{t('about.team.members.member3.role')}</p>
                            <div className="text-2xl font-bold text-green-600 mb-3">{t('about.team.members.member3.experience')}</div>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{t('about.team.members.member3.description')}</p>
                            <ul className="text-left text-sm space-y-2">
                                {t('about.team.members.member3.specialties', { returnObjects: true }).map((specialty, index) => (
                                    <li key={index} className="text-gray-600 flex items-start">
                                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{specialty}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>*/}

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        id="cta-content"
                        data-animate
                        className={`transition-all duration-1000 ${isVisible['cta-content']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            {t('about.cta.title')}
                        </h2>
                        <p className="text-xl text-blue-200 mb-8 max-w-4xl mx-auto leading-relaxed">
                            {t('about.cta.description')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                            <button
                                onClick={() => handleCTA('about-primary')}
                                className="w-full sm:w-auto bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <span className="text-sm md:text-base">{t('about.cta.primaryButton')}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                            <button
                                onClick={() => handleCTA('about-secondary')}
                                className="w-full sm:w-auto bg-transparent border-2 border-blue-300 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm md:text-base"
                            >
                                {t('about.cta.secondaryButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;