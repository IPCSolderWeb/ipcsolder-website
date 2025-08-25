import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Maintenance = () => {
  const { t, i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState('');

  // Calcular tiempo restante (ejemplo: 4 horas desde ahora)
  useEffect(() => {
    const targetTime = new Date().getTime() + (4 * 60 * 60 * 1000); // 4 horas
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;
      
      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(t('maintenance.soon'));
        // Auto-refresh cuando termine el tiempo
        setTimeout(() => window.location.reload(), 5000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 flex gap-2">
        <button
          onClick={() => handleLanguageChange('es')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            i18n.language === 'es'
              ? 'bg-white bg-opacity-30 border border-white'
              : 'bg-white bg-opacity-10 border border-white border-opacity-30 hover:bg-opacity-20'
          } text-white font-medium`}
        >
          ES
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            i18n.language === 'en'
              ? 'bg-white bg-opacity-30 border border-white'
              : 'bg-white bg-opacity-10 border border-white border-opacity-30 hover:bg-opacity-20'
          } text-white font-medium`}
        >
          EN
        </button>
      </div>

      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <h1 className="text-6xl font-bold text-white mb-8 tracking-tight">
          IPCSolder
        </h1>

        {/* Maintenance Icon */}
        <div className="text-8xl mb-8 opacity-80">
          🔧
        </div>

        {/* Main Content */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('maintenance.title')}
          </h2>
          
          <p className="text-xl text-white text-opacity-90 mb-8 leading-relaxed">
            {t('maintenance.description')}
          </p>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-opacity-30 border-t-white"></div>
          </div>

          {/* Countdown */}
          {timeLeft && (
            <div className="mb-8">
              <p className="text-white text-opacity-80 mb-2">
                {t('maintenance.timeRemaining')}
              </p>
              <div className="text-3xl font-bold text-white bg-white bg-opacity-20 rounded-lg py-3 px-6 inline-block">
                {timeLeft}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 mt-8">
            <h3 className="text-2xl font-semibold text-white mb-6">
              {t('maintenance.urgentHelp')}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 text-white">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">📧</span>
                <span>ventas@ipcsolder.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">📞</span>
                <span>+52 (33) 1234-5678</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">📍</span>
                <span>Guadalajara, Jalisco</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: '75%' }}
              ></div>
            </div>
            <p className="text-white text-opacity-70 mt-2 text-sm">
              {t('maintenance.progress')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white text-opacity-60 mt-8 text-sm">
          {t('maintenance.footer')}
        </p>
      </div>
    </div>
  );
};

export default Maintenance;