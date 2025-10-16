import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HiArrowRight as ArrowRight,
  HiCheckCircle as CheckCircle
} from 'react-icons/hi';
import '../styles/video-hero.css';

const Home = ({ currentLanguage = 'es' }) => {
  const { t, ready, i18n } = useTranslation();
  const navigate = useNavigate();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Detectar preferencia de movimiento reducido para accesibilidad
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Debug: Verificar si las traducciones están listas
  console.log('🔍 Home Debug:', {
    ready,
    currentLanguage,
    prefersReducedMotion,
    videoLoaded,
    videoError,
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

    switch (action) {
      case 'hero-primary':
        // "¿Cómo podemos ayudarte a mejorar?" -> Contacto
        navigate('/contacto');
        window.scrollTo(0, 0);
        break;
      case 'hero-secondary':
        // "Ver Productos" -> Productos
        navigate('/productos');
        window.scrollTo(0, 0);
        break;
      case 'cta-primary':
        // "Solicitar Assessment Gratuito" -> Contacto con pre-llenado
        {
          const contactUrl = i18n.language === 'es' ? '/contacto' : '/contact';
          const subject = i18n.language === 'es' 
            ? 'Solicito un assessment gratuito de mi línea de producción'
            : 'I request a free assessment of my production line';
          navigate(`${contactUrl}?service=assessment&subject=${encodeURIComponent(subject)}&lang=${i18n.language}`);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
        break;
      case 'cta-secondary':
        // "Ver Fichas Técnicas" -> Contacto con pre-llenado
        {
          const contactUrl = i18n.language === 'es' ? '/contacto' : '/contact';
          const subject = i18n.language === 'es' 
            ? 'Me interesa información de fichas técnicas'
            : 'I\'m interested in technical sheets information';
          navigate(`${contactUrl}?service=fichas-tecnicas&subject=${encodeURIComponent(subject)}&lang=${i18n.language}`);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
        break;
      default:
        console.log(`Acción no definida: ${action}`);
    }
  };

  return (
    <div className="bg-white min-h-screen">


      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden min-h-screen flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          {!prefersReducedMotion ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="/videos/hero-background-poster.jpg"
              onLoadStart={() => console.log('🎥 Video loading started')}
              onLoadedData={() => console.log('🎥 Video loaded data')}
              onCanPlay={() => {
                console.log('🎥 Video can play');
                setVideoLoaded(true);
              }}
              onPlay={() => console.log('🎥 Video started playing')}
              onError={(e) => {
                console.log('🎥 Video error:', e);
                setVideoError(true);
              }}
            >
              <source src="/videos/hero-background.webm" type="video/webm" />
              <source src="/videos/hero-background.mp4" type="video/mp4" />
            </video>
          ) : (
            // Imagen estática para usuarios que prefieren movimiento reducido
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/videos/hero-background-poster.jpg)' }}
            />
          )}
        </div>

        {/* Fallback background for browsers that don't support video or video error */}
        <div className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 transition-opacity duration-1000 z-5 ${videoError || (!videoLoaded && !prefersReducedMotion) ? 'opacity-100' : 'opacity-20'
          }`}></div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white hero-text-shadow">
            {t('home.hero.title')}
          </h1>
          <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4 hero-text-shadow">
            {t('home.hero.subtitle')}
          </div>
          <p className="text-lg lg:text-xl text-gray-100 mb-10 max-w-4xl mx-auto leading-relaxed hero-text-shadow">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleCTA('hero-primary')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 group shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 backdrop-blur-sm"
            >
              <span>{t('home.hero.primaryCta')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => handleCTA('hero-secondary')}
              className="glass-button text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl"
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
              <div
                key={key}
                className="group cursor-pointer"
                onClick={() => {
                  // Navegar a productos con filtro específico
                  navigate('/productos');
                  // Guardar el filtro deseado en localStorage para que ProductsIndex lo use
                  localStorage.setItem('selectedProductCategory', key);
                  window.scrollTo(0, 0);
                }}
              >
                <div 
                  className="relative rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:-translate-y-2 overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(/images/categories/${key}.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '320px'
                  }}
                >
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-200 transition-colors text-shadow">
                        {t(`home.products.categories.${key}.title`)}
                      </h3>
                      <p className="text-blue-100 mb-5 leading-relaxed text-shadow">
                        {t(`home.products.categories.${key}.description`)}
                      </p>
                    </div>

                    <div className="flex items-center text-white font-medium group-hover:text-blue-200 transition-colors">
                      <span className="mr-2">{t('home.products.viewMore')}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
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