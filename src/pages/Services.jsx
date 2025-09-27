import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiArrowRight as ArrowRight
} from 'react-icons/hi';

const Services = ({ currentLanguage = 'es' }) => {
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

        switch (action) {
            case 'contact':
                navigate('/contacto');
                window.scrollTo(0, 0);
                break;
            case 'products':
                navigate('/productos');
                window.scrollTo(0, 0);
                break;
            default:
                console.log(`Acción no definida: ${action}`);
        }
    };

    return (
        <div className="bg-white">
            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                            Inicio
                        </a>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">Servicios</span>
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
                            Nuestros Servicios
                        </h1>
                        <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4">
                            ¿Cómo podemos ayudarte a mejorar?
                        </div>
                        <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Soporte técnico especializado y consultoría para mejorar tu producción, reducir defectos y optimizar procesos con más de 20 años de experiencia.
                        </p>
                    </div>
                </div>
            </section>
            {/* Value Proposition Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-blue-900 mb-6">¿Qué nos hace diferentes?</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Mientras otras empresas envían <span className="text-blue-600 font-semibold">vendedores sin experiencia técnica</span>,
                                nosotros enviamos ingenieros con más de 20 años en la industria electrónica.
                            </p>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                <span className="text-blue-600 font-semibold">No vendemos productos, solucionamos problemas.</span>
                                Nos metemos al proceso, revisamos tu línea y te decimos exactamente dónde
                                estás fallando y cómo mejorarlo.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Nuestro enfoque es simple: <span className="text-blue-600 font-semibold">que les quitemos un problema</span>,
                                que les funcione, y después viene el lado comercial con atención rápida y
                                plan de venta adecuado.
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
                                <h3 className="text-2xl font-bold mb-4">Assessment Gratuito</h3>
                                <p className="text-blue-100">
                                    Revisamos tu línea sin costo y te decimos dónde mejorar
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
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">Servicios Especializados</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Soporte técnico y consultoría con colaboración directa para lograr soluciones personalizadas
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {/* Assessment de Líneas */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">🔍</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Assessment de Líneas</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Auditoría completa de tu proceso de manufactura sin costo.
                                Identificamos problemas y oportunidades de mejora.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Auditoría del proceso actual de manufactura
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Replicación de variables de manufactura
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Identificación de puntos críticos
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Reporte detallado con recomendaciones
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Plan de acción específico
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Seguimiento post-implementación
                                </li>
                            </ul>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Solicitar Assessment Gratuito
                            </button>
                        </div>
                        {/* Consultoría de Procesos */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">⚡</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Consultoría de Procesos</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Optimización de procesos con recomendaciones específicas para
                                aumentar producción, reducir costos y mejorar yield.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Recomendaciones de mejores productos por proceso
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Estrategias para reducir costos de manufactura
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Planes para aumentar el yield de producción
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Reducción de desperdicios y retrabajo
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Optimización de tiempos de línea
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Implementación de mejores prácticas
                                </li>
                            </ul>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Solicitar Consultoría
                            </button>
                        </div>
                        {/* Soporte Técnico Especializado */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">🛠️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Soporte Técnico Especializado</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Soporte técnico con ingenieros expertos que conocen los equipos
                                desde adentro y pueden solucionar problemas complejos.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Soporte técnico 24/7
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Troubleshooting especializado
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Mantenimiento preventivo programado
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Reparación de equipos en sitio
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Calibración y actualización de software
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Training y capacitación técnica
                                </li>
                            </ul>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Contactar Soporte
                            </button>
                        </div>
                        {/* Fichas Técnicas y Documentación */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">📋</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Fichas Técnicas y Documentación</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Acceso a fichas técnicas detalladas, especificaciones y
                                documentación especializada bajo solicitud.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Fichas técnicas detalladas
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Hojas de seguridad (MSDS)
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Especificaciones de productos
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Guías de aplicación
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Documentación de procesos
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Cartas de presentación técnicas
                                </li>
                            </ul>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Solicitar Documentación
                            </button>
                        </div>
                        {/* Servicios de Campo */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">🏭</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Servicios de Campo</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Servicios especializados directamente en tu planta con expertos
                                que se involucran en tu proceso hasta lograr resultados.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Implementación en sitio
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Supervisión de procesos críticos
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Resolución de problemas urgentes
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Optimización en tiempo real
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Training hands-on
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Validación de procesos
                                </li>
                            </ul>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Agendar Visita
                            </button>
                        </div>
                        {/* Análisis y Reportes */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Análisis y Reportes</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Análisis detallado de tu línea de producción con reportes
                                técnicos y recomendaciones basadas en datos reales.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Análisis estadístico de defectos
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Reportes de eficiencia de línea
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Benchmarking vs industria
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Análisis de costo-beneficio
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    KPIs de producción
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Planes de mejora continua
                                </li>
                            </ul>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Solicitar Análisis
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Process Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">Nuestro Proceso de Trabajo</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Un enfoque sistemático para garantizar resultados reales en tu línea de producción
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8">
                        <div className="text-center relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold relative z-10">
                                1
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Contacto Inicial</h3>
                            <p className="text-gray-600 text-sm">
                                Nos contactas con tu problema específico.
                                Entendemos tu situación y programamos visita.
                            </p>
                            <div className="hidden md:block absolute top-10 left-full w-8 h-0.5 bg-gray-200 z-0"></div>
                        </div>

                        <div className="text-center relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold relative z-10">
                                2
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Assessment Gratuito</h3>
                            <p className="text-gray-600 text-sm">
                                Revisamos tu línea sin costo. Identificamos
                                problemas y oportunidades de mejora.
                            </p>
                            <div className="hidden md:block absolute top-10 left-full w-8 h-0.5 bg-gray-200 z-0"></div>
                        </div>

                        <div className="text-center relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold relative z-10">
                                3
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Reporte y Recomendaciones</h3>
                            <p className="text-gray-600 text-sm">
                                Entregamos reporte detallado con recomendaciones
                                específicas y plan de acción.
                            </p>
                            <div className="hidden md:block absolute top-10 left-full w-8 h-0.5 bg-gray-200 z-0"></div>
                        </div>

                        <div className="text-center relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold relative z-10">
                                4
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Implementación</h3>
                            <p className="text-gray-600 text-sm">
                                Implementamos las soluciones trabajando
                                directamente en tu línea de producción.
                            </p>
                            <div className="hidden md:block absolute top-10 left-full w-8 h-0.5 bg-gray-200 z-0"></div>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold">
                                5
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Seguimiento</h3>
                            <p className="text-gray-600 text-sm">
                                Damos seguimiento para asegurar que las
                                mejoras se mantengan y optimizar continuamente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Industries Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">Industrias que Atendemos</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experiencia especializada en diferentes sectores de la industria electrónica
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mx-auto mb-5 text-white">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Electrónica de Consumo</h3>
                            <p className="text-gray-600 text-sm">
                                Dispositivos móviles, tablets, wearables y productos de consumo masivo.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mx-auto mb-5 text-white">
                                <span className="text-2xl">🚗</span>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Automotriz</h3>
                            <p className="text-gray-600 text-sm">
                                Componentes electrónicos para la industria automotriz y vehículos eléctricos.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mx-auto mb-5 text-white">
                                <span className="text-2xl">🏭</span>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Maquiladoras</h3>
                            <p className="text-gray-600 text-sm">
                                Plantas de manufactura por contrato con altos volúmenes de producción.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mx-auto mb-5 text-white">
                                <span className="text-2xl">📡</span>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Comunicaciones</h3>
                            <p className="text-gray-600 text-sm">
                                Equipos de telecomunicaciones, networking y infraestructura de comunicaciones.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mx-auto mb-5 text-white">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Fabricantes Originales (OEM)</h3>
                            <p className="text-gray-600 text-sm">
                                Empresas que diseñan y fabrican sus propios productos electrónicos.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mx-auto mb-5 text-white">
                                <span className="text-2xl">🔬</span>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Equipos Médicos</h3>
                            <p className="text-gray-600 text-sm">
                                Dispositivos médicos y equipos de diagnóstico con estándares críticos.
                            </p>
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
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            ¿Listo para mejorar tu producción?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                            Contacta a nuestros expertos para un assessment gratuito de tu línea.
                            Te ayudamos a identificar oportunidades de mejora y reducir defectos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => handleCTA('contact')}
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <span>Solicitar Assessment Gratuito</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                            <button
                                onClick={() => handleCTA('contact')}
                                className="bg-transparent border-2 border-blue-300 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                            >
                                Hablar con un Experto
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;