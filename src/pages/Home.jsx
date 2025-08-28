import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiArrowRight as ArrowRight,
  HiCheckCircle as CheckCircle
} from 'react-icons/hi';

const Home = ({ currentLanguage = 'es' }) => {
  const { t, ready } = useTranslation();

  // Debug: Verificar si las traducciones están listas
  console.log('🔍 Home Debug:', {
    ready,
    currentLanguage,
    heroTitle: ready ? t('home.hero.title') : 'Loading...',
    heroSubtitle: ready ? t('home.hero.subtitle') : 'Loading...'
  });

  // Si las traducciones no están listas, mostrar loading
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Cargando traducciones...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleCTA = (action) => {
    console.log(`📞 Home: CTA clicked - ${action}`);
  };

  return (
    <div className="bg-white min-h-screen">


      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' fill='%23ffffff'%3E%3Cpath d='M0,20 Q250,80 500,20 T1000,20 L1000,100 L0,100 Z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100% 100px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4">
            {t('home.hero.subtitle')}
          </div>
          <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleCTA('hero-primary')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>{t('home.hero.primaryCta')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => handleCTA('hero-secondary')}
              className="bg-transparent border-2 border-slate-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              {t('home.hero.secondaryCta')}
            </button>
          </div>
        </div>
      </section>

      {/* Products Section Simplificado */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            {t('home.products.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            {t('home.products.subtitle')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['mro', 'esd', 'solder', 'machines', 'laser', 'tooling'].map((key, index) => (
              <div key={key} className="group cursor-pointer">
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:-translate-y-2">
                  <div className="w-15 h-15 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center mb-6 text-white">
                    <CheckCircle size={32} />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {t(`home.products.categories.${key}.title`)}
                    </h3>
                    <p className="text-gray-600 mb-5 leading-relaxed">
                      {t(`home.products.categories.${key}.description`)}
                    </p>
                  </div>

                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    <span className="mr-2">{t('home.products.viewMore')}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section Simplificado */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            {t('home.services.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            {t('home.services.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {t('home.services.list', { returnObjects: true }).map((service, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-xl p-10 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-2">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                    <CheckCircle size={32} />
                  </div>

                  <h3 className="text-xl font-bold text-blue-900 mb-4 group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-blue-100 transition-colors">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('home.cta.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleCTA('cta-primary')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>{t('home.cta.primaryCta')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => handleCTA('cta-secondary')}
              className="bg-transparent border-2 border-blue-300 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              {t('home.cta.secondaryCta')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;