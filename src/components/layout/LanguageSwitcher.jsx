import React from 'react';

const LanguageSwitcher = ({ 
  currentLanguage = 'es',
  onLanguageChange,
  className = ''
}) => {

  const handleLanguageSwitch = (langCode) => {
    console.log(`🌐 LanguageSwitcher: Cambiando idioma de ${currentLanguage} a ${langCode}`);
    
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    
    // Guardar en localStorage
    try {
      localStorage.setItem('ipcsolder-language', langCode);
      console.log(`💾 LanguageSwitcher: Idioma ${langCode} guardado en localStorage`);
    } catch (error) {
      console.warn('⚠️ LanguageSwitcher: Error guardando idioma en localStorage:', error);
    }
  };

  console.log('🔄 LanguageSwitcher: Renderizando componente simple', {
    currentLanguage
  });

  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => handleLanguageSwitch('es')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
          currentLanguage === 'es'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:text-primary-600'
        }`}
        title="Español"
      >
        ES
      </button>
      <button
        onClick={() => handleLanguageSwitch('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
          currentLanguage === 'en'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:text-primary-600'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;