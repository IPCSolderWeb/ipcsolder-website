import React, { useState, useEffect } from 'react';
import { HiX as X, HiChevronDown as ChevronDown, HiChevronRight as ChevronRight } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const MobileMenu = ({ 
  isOpen = false,
  onClose,
  currentLanguage = 'es',
  onNavigate,
  onLanguageChange
}) => {
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const { t, i18n } = useTranslation();

  // Sincronizar el idioma con i18n si es diferente
  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log('📱 MobileMenu: Scroll bloqueado');
    } else {
      document.body.style.overflow = 'unset';
      console.log('📱 MobileMenu: Scroll desbloqueado');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Resetear submenús al cerrar
  useEffect(() => {
    if (!isOpen) {
      setExpandedSubmenu(null);
    }
  }, [isOpen]);

  const handleNavClick = (path, section) => {
    console.log(`📱 MobileMenu: Navegando a ${path} (${section})`);
    
    if (onNavigate) {
      onNavigate(path, section);
    }
    
    // Cerrar menú
    if (onClose) {
      onClose();
    }
  };

  const handleSubmenuToggle = (submenu) => {
    const newState = expandedSubmenu === submenu ? null : submenu;
    setExpandedSubmenu(newState);
    console.log(`📋 MobileMenu: Toggle submenu ${submenu} - Estado: ${newState}`);
  };

  const handleLanguageSwitch = (lang) => {
    console.log(`🌐 MobileMenu: Cambiando idioma a ${lang} - Menú permanece abierto`);
    i18n.changeLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    // NO cerramos el menú aquí - el usuario debe poder seguir navegando
  };

  const handleClose = () => {
    console.log('❌ MobileMenu: Cerrando menú móvil');
    if (onClose) {
      onClose();
    }
  };

  console.log('🔄 MobileMenu: Renderizando menú móvil', {
    isOpen,
    currentLanguage: i18n.language,
    expandedSubmenu
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Menu Panel */}
      <div 
        className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto"
      >
        {/* Header - Solo logo y cerrar */}
        <div className="bg-primary-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{t('mobileMenu.title')}</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1">
          <nav className="p-4 space-y-2">
            
            <button
              onClick={() => handleNavClick('/', 'home')}
              className="flex items-center w-full p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
            >
              {t('mobileMenu.nav.home')}
            </button>

            {/* About con submenu colapsible */}
            <div>
              <button
                onClick={() => handleSubmenuToggle('about')}
                className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
              >
                <span>{t('mobileMenu.nav.about')}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    expandedSubmenu === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {expandedSubmenu === 'about' && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-primary-100 pl-4">
                  {t('mobileMenu.submenus.about', { returnObjects: true }).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(`/about/${item.key}`, `about-${item.key}`)}
                      className="block w-full text-left py-2 px-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 text-sm"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products con submenu colapsible */}
            <div>
              <button
                onClick={() => handleSubmenuToggle('products')}
                className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
              >
                <span>{t('mobileMenu.nav.products')}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    expandedSubmenu === 'products' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {expandedSubmenu === 'products' && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-primary-100 pl-4">
                  {t('mobileMenu.submenus.products', { returnObjects: true }).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(`/products/${item.key}`, `products-${item.key}`)}
                      className="block w-full text-left py-2 px-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 text-sm"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Services con submenu colapsible */}
            <div>
              <button
                onClick={() => handleSubmenuToggle('services')}
                className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
              >
                <span>{t('mobileMenu.nav.services')}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    expandedSubmenu === 'services' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {expandedSubmenu === 'services' && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-primary-100 pl-4">
                  {t('mobileMenu.submenus.services', { returnObjects: true }).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(`/services/${item.key}`, `services-${item.key}`)}
                      className="block w-full text-left py-2 px-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 text-sm"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('/blog', 'blog')}
              className="flex items-center w-full p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
            >
              {t('mobileMenu.nav.blog')}
            </button>

            <button
              onClick={() => handleNavClick('/contact', 'contact')}
              className="flex items-center w-full p-3 text-left bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all duration-200 font-medium mt-4"
            >
              {t('mobileMenu.nav.contact')}
            </button>
          </nav>

          {/* Language Switcher - En la parte inferior */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('mobileMenu.language')}:</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleLanguageSwitch('es')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  i18n.language === 'es'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-primary-100 hover:text-primary-600 border border-gray-200'
                }`}
              >
                {t('mobileMenu.languageButtons.spanish')}
              </button>
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  i18n.language === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-primary-100 hover:text-primary-600 border border-gray-200'
                }`}
              >
                {t('mobileMenu.languageButtons.english')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;