import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones directamente desde JSON
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

console.log('🌐 i18n: Inicializando sistema de internacionalización');

// Configuración de i18next
i18n
  // Detectar idioma del usuario
  .use(LanguageDetector)
  
  // Pasar la instancia i18n a react-i18next
  .use(initReactI18next)
  
  // Inicializar i18next
  .init({
    // Configuración de idiomas
    lng: 'es', // idioma por defecto
    fallbackLng: 'es', // idioma de respaldo
    supportedLngs: ['es', 'en'], // idiomas soportados
    
    // Configuración de debug
    debug: process.env.NODE_ENV === 'development',
    
    // Configuración de recursos (traducciones importadas directamente)
    resources: {
      es: {
        translation: esTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    
    // Configuración del detector de idioma
    detection: {
      // Orden de detección de idioma
      order: [
        'localStorage',     // Primero desde localStorage
        'navigator',        // Luego desde configuración del navegador
        'htmlTag',         // Luego desde html lang attribute
        'path',            // Luego desde URL path
        'subdomain'        // Finalmente desde subdomain
      ],
      
      // Cache del idioma seleccionado
      caches: ['localStorage'],
      
      // Key para localStorage
      lookupLocalStorage: 'ipcsolder-language',
      
      // Configuración adicional
      excludeCacheFor: ['cimode'], // idiomas a excluir del cache
      checkWhitelist: true,         // solo usar idiomas soportados
      
      // Configuraciones específicas
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0
    },
    
    // Configuración de interpolación
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
      formatSeparator: ',',
      format: function(value, format) {
        // Formateo personalizado si es necesario
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      }
    },
    

    
    // Configuración de namespace
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Configuración de claves faltantes
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: function(lng, ns, key, fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🚨 i18n: Clave faltante [${lng}][${ns}] ${key}:`, fallbackValue);
      }
    },
    
    // Configuración de parsers
    parseMissingKeyHandler: function(key) {
      // Manejo de claves faltantes
      return key;
    },
    
    // Configuración de react-i18next
    react: {
      // Bind i18n instance to component
      bindI18n: 'languageChanged',
      
      // Bind store to component
      bindI18nStore: '',
      
      // You can use Trans component inside a React component
      transEmptyNodeValue: '',
      
      // Componente de suspense
      useSuspense: false, // Para evitar problemas de hidratación
      
      // Configuración de interpolación en React
      interpolation: {
        escapeValue: false
      }
    },
    
    // Configuración de loadPath personalizada
    load: 'languageOnly', // es en lugar de es-ES
    
    // Configuración de limpieza de código
    cleanCode: true,
    
    // Configuración de postProcessors
    postProcess: false,
    
    // Configuración de retries
    retryOnFailure: true,
    
    // Configuración adicional para desarrollo
    ...(process.env.NODE_ENV === 'development' && {
      debug: true,
      saveMissing: true,
      updateMissing: true
    })
  })
  .then((t) => {
    console.log('✅ i18n: Sistema de internacionalización inicializado correctamente');
    console.log(`🌐 i18n: Idioma actual: ${i18n.language}`);
    console.log(`📚 i18n: Idiomas disponibles:`, i18n.options.supportedLngs);
    
    // 🔍 DEBUG: Verificar que las traducciones se cargaron
    console.log('🔍 i18n: Verificando traducciones cargadas...');
    console.log('🔍 i18n: Recursos cargados:', i18n.store.data);
    console.log('🔍 i18n: header.nav.home =', i18n.t('header.nav.home'));
    console.log('🔍 i18n: header.contact.email =', i18n.t('header.contact.email'));
    console.log('🔍 i18n: home.hero.title =', i18n.t('home.hero.title'));
  })
  .catch((error) => {
    console.error('❌ i18n: Error inicializando sistema de internacionalización:', error);
  });

// Event listeners para debugging
if (process.env.NODE_ENV === 'development') {
  i18n.on('languageChanged', (lng) => {
    console.log(`🔄 i18n: Idioma cambiado a: ${lng}`);
  });
  
  i18n.on('loaded', (loaded) => {
    console.log('📚 i18n: Traducciones cargadas:', loaded);
    Object.keys(loaded).forEach(lang => {
      console.log(`📚 i18n: Contenido de ${lang}:`, loaded[lang]);
    });
  });
  
  i18n.on('failedLoading', (lng, ns, msg) => {
    console.error(`❌ i18n: Error cargando [${lng}][${ns}]:`, msg);
    console.error(`❌ i18n: URL intentada: /locales/${lng}/translation.json`);
  });
  
  i18n.on('missingKey', (lng, namespace, key, res) => {
    console.warn(`🔑 i18n: Clave faltante [${lng}][${namespace}] ${key}:`, res);
  });
}

// Función helper para cambiar idioma
export const changeLanguage = (lng) => {
  console.log(`🌐 i18n: Cambiando idioma a: ${lng}`);
  
  return i18n.changeLanguage(lng).then((t) => {
    console.log(`✅ i18n: Idioma cambiado exitosamente a: ${lng}`);
    
    // Actualizar localStorage
    try {
      localStorage.setItem('ipcsolder-language', lng);
      console.log(`💾 i18n: Idioma ${lng} guardado en localStorage`);
    } catch (error) {
      console.warn('⚠️ i18n: Error guardando idioma en localStorage:', error);
    }
    
    // Actualizar document lang attribute para SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lng;
      console.log(`📄 i18n: Atributo lang del documento actualizado a: ${lng}`);
    }
    
    return t;
  }).catch((error) => {
    console.error(`❌ i18n: Error cambiando idioma a ${lng}:`, error);
    throw error;
  });
};

// Función helper para obtener idioma actual
export const getCurrentLanguage = () => {
  return i18n.language || i18n.options.fallbackLng;
};

// Función helper para verificar si un idioma está disponible
export const isLanguageSupported = (lng) => {
  return i18n.options.supportedLngs.includes(lng);
};

// Función helper para obtener idiomas disponibles
export const getAvailableLanguages = () => {
  return i18n.options.supportedLngs.filter(lng => lng !== 'cimode');
};

// Función helper para formatear traducciones con parámetros
export const formatTranslation = (key, options = {}) => {
  return i18n.t(key, options);
};

// Función helper para detectar idioma del navegador
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages[0];
  const langCode = browserLang.split('-')[0];
  
  console.log(`🌍 i18n: Idioma del navegador detectado: ${browserLang} (código: ${langCode})`);
  
  return isLanguageSupported(langCode) ? langCode : 'es';
};

// Función helper para manejo de errores de traducción
export const handleTranslationError = (error, key, fallback = '') => {
  console.error(`❌ i18n: Error en traducción para clave "${key}":`, error);
  return fallback || key;
};

// Exportar instancia de i18n por defecto
export default i18n;