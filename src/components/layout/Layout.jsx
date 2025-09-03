import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';

const Layout = ({ children, className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar idioma inicial
  useEffect(() => {
    console.log('🏗️ Layout: Inicializando layout principal');
    
    // Intentar obtener idioma del localStorage
    try {
      const savedLanguage = localStorage.getItem('ipcsolder-language');
      if (savedLanguage && ['es', 'en'].includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
        console.log(`🌐 Layout: Idioma cargado desde localStorage: ${savedLanguage}`);
      } else {
        // Detectar idioma del navegador como fallback
        const browserLang = navigator.language.split('-')[0];
        const detectedLang = ['es', 'en'].includes(browserLang) ? browserLang : 'es';
        setCurrentLanguage(detectedLang);
        console.log(`🌍 Layout: Idioma detectado del navegador: ${detectedLang}`);
      }
    } catch (error) {
      console.warn('⚠️ Layout: Error accediendo localStorage, usando español por defecto');
      setCurrentLanguage('es');
    }
  }, []);

  // Detectar scroll para efectos
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newScrolled = scrollTop > 100;
      
      if (newScrolled !== isScrolled) {
        setIsScrolled(newScrolled);
        console.log(`📜 Layout: Scroll detectado - isScrolled: ${newScrolled}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    console.log('👂 Layout: Event listener de scroll agregado');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      console.log('🧹 Layout: Event listener de scroll removido');
    };
  }, [isScrolled]);

  // Manejar cambio de idioma
  const handleLanguageChange = (newLanguage) => {
    console.log(`🌐 Layout: Cambiando idioma de ${currentLanguage} a ${newLanguage}`);
    
    setCurrentLanguage(newLanguage);
    
    // Guardar en localStorage
    try {
      localStorage.setItem('ipcsolder-language', newLanguage);
      console.log(`💾 Layout: Idioma ${newLanguage} guardado en localStorage`);
    } catch (error) {
      console.warn('⚠️ Layout: Error guardando idioma en localStorage:', error);
    }

    // NO cerramos el menú móvil por cambio de idioma
    // El usuario debe poder cambiar idioma y seguir navegando

    // Aquí después se integrará con react-i18next
    console.log(`🔄 Layout: Idioma actualizado globalmente a ${newLanguage}`);
  };

  // Manejar navegación
  const handleNavigation = (path, section) => {
    console.log(`🧭 Layout: Navegando a ${path} (sección: ${section})`);
    
    // Cerrar menú móvil
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      console.log('📱 Layout: Menú móvil cerrado por navegación');
    }

    // Aquí después se integrará con React Router
    // router.push(path);
    
    // Scroll suave al top para nuevas páginas
    if (section !== 'scroll-section') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('⬆️ Layout: Scroll al top por navegación a nueva página');
    }
  };

  // Manejar toggle del menú móvil
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    console.log(`📱 Layout: Toggle menú móvil - Estado: ${newState}`);
    
    // Bloquear scroll del body cuando el menú está abierto
    if (newState) {
      document.body.style.overflow = 'hidden';
      console.log('🔒 Layout: Scroll del body bloqueado');
    } else {
      document.body.style.overflow = 'unset';
      console.log('🔓 Layout: Scroll del body desbloqueado');
    }
  };

  // Cerrar menú móvil
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
    console.log('❌ Layout: Menú móvil cerrado explícitamente');
  };

  // Cleanup del scroll cuando se desmonta el componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
      console.log('🧹 Layout: Cleanup - Scroll del body restaurado');
    };
  }, []);

  // Detectar cambios de tamaño de ventana para cerrar menú móvil en desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = 'unset';
        console.log('🖥️ Layout: Menú móvil cerrado por resize a desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  console.log('🔄 Layout: Renderizando layout principal', {
    currentLanguage,
    isMobileMenuOpen,
    isScrolled,
    childrenType: children?.type?.name || 'unknown'
  });

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Header Principal */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
        isScrolled={isScrolled}
      />

      {/* Contenido Principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onNavigate={handleNavigation}
      />

      {/* Menú Móvil */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Scroll to Top Button (opcional) */}
      {isScrolled && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('⬆️ Layout: Scroll to top button clicked');
          }}
          className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 z-40 hover:scale-110"
          title={currentLanguage === 'es' ? 'Ir arriba' : 'Go to top'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Loading Overlay (para futuras integraciones) */}
      {/* {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-primary-600 font-medium">
              {currentLanguage === 'es' ? 'Cargando...' : 'Loading...'}
            </span>
          </div>
        </div>
      )} */}

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50 font-mono">
          <div>Lang: {currentLanguage}</div>
          <div>Mobile: {isMobileMenuOpen ? 'Open' : 'Closed'}</div>
          <div>Scrolled: {isScrolled ? 'Yes' : 'No'}</div>
          <div>Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'SSR'}</div>
        </div>
      )}
    </div>
  );
};

export default Layout;