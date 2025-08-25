import React, { useState, useEffect } from 'react';
import { HiMenu as Menu, HiX as X } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const Header = ({
  currentLanguage = 'es',
  onLanguageChange,
  onNavigate,
  onMobileMenuToggle,
  isMobileMenuOpen = false
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { t, i18n } = useTranslation();

  // Sincronizar el idioma con i18n si es diferente
  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const handleNavClick = (path, section) => {
    console.log(`🧭 Header: Navegando a ${path} (${section})`);

    if (onNavigate) {
      onNavigate(path, section);
    }

    setActiveDropdown(null);
  };

  const handleDropdownToggle = (dropdown, event) => {
    event.preventDefault();
    event.stopPropagation();
    const newState = activeDropdown === dropdown ? null : dropdown;
    setActiveDropdown(newState);
    console.log(`📋 Header: Toggle dropdown ${dropdown} - Estado: ${newState}`);
  };

  const handleLanguageSwitch = (lang) => {
    console.log(`🌐 Header: Cambiando idioma a ${lang}`);
    i18n.changeLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const handleMobileMenuClick = () => {
    console.log(`📱 Header: Toggle menú móvil`);
    if (onMobileMenuToggle) {
      onMobileMenuToggle();
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Solo cerrar si el click no es en un dropdown o botón de dropdown
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  console.log('🔄 Header: Renderizando header exacto al mockup', {
    currentLanguage: i18n.language,
    activeDropdown,
    isMobileMenuOpen
  });

  return (
    <header className="relative" style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      padding: 0,
      boxShadow: '0 2px 10px rgba(30, 58, 138, 0.1)'
    }}>

      {/* Top Bar */}
      <div
        className="hidden lg:block"
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          padding: '6px 0',
          fontSize: '14px'
        }}
      >
        <div
          className="mx-auto px-5"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px'
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-8">
              <span>{t('header.contact.email')}</span>
              <span>{t('header.contact.phone')}</span>
              <span>{t('header.contact.location')}</span>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleLanguageSwitch('es')}
                className={`px-3 py-1 border rounded transition-all duration-300 ${i18n.language === 'es'
                  ? 'bg-white bg-opacity-20 border-white'
                  : 'bg-transparent border-white border-opacity-30 hover:bg-white hover:bg-opacity-10'
                  }`}
                style={{
                  padding: '4px 12px',
                  background: i18n.language === 'es' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: i18n.language === 'es' ? '1px solid white' : '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ES
              </button>
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`px-3 py-1 border rounded transition-all duration-300 ${i18n.language === 'en'
                  ? 'bg-white bg-opacity-20 border-white'
                  : 'bg-transparent border-white border-opacity-30 hover:bg-white hover:bg-opacity-10'
                  }`}
                style={{
                  padding: '4px 12px',
                  background: i18n.language === 'en' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: i18n.language === 'en' ? '1px solid white' : '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Container */}
      <div style={{ padding: '15px 0' }}>
        <div
          className="mx-auto px-5"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px'
          }}
        >
          <nav className="flex justify-between items-center">

            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/', 'home');
              }}
              className="text-white no-underline hover:text-blue-200 transition-colors duration-300"
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'white',
                textDecoration: 'none',
                letterSpacing: '-1px'
              }}
            >
              IPCSolder
            </a>

            {/* Desktop Navigation */}
            <ul
              className="hidden lg:flex list-none m-0"
              style={{
                listStyle: 'none',
                gap: '40px',
                margin: 0
              }}
            >
              <li className="relative">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('/', 'home');
                  }}
                  className="text-white no-underline hover:text-blue-200 transition-colors duration-300 flex items-center py-2"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {t('header.nav.home')}
                </a>
              </li>

              {/* Nosotros */}
              <li className="relative dropdown-container">
                <a
                  href="#"
                  onClick={(e) => handleDropdownToggle('about', e)}
                  className="text-white no-underline hover:text-blue-200 transition-colors duration-300 flex items-center py-2"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {t('header.nav.about')}
                  <span
                    className="transition-transform duration-300"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: activeDropdown === 'about' ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    ▼
                  </span>
                </a>
                {activeDropdown === 'about' && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-lg rounded-lg z-50"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'white',
                      minWidth: '280px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                      zIndex: 1000,
                      marginTop: '10px'
                    }}
                  >
                    <div style={{ padding: '20px 0' }}>
                      <div style={{ marginBottom: '15px' }}>
                        <div
                          style={{
                            color: '#1e3a8a',
                            fontWeight: '600',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '0 20px 8px',
                            borderBottom: '1px solid #e5e7eb',
                            marginBottom: '8px'
                          }}
                        >
                          {t('header.dropdowns.about.title')}
                        </div>
                        {t('header.dropdowns.about.items', { returnObjects: true }).map((item) => (
                          <a
                            key={item.key}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(`/about/${item.key}`, `about-${item.key}`);
                            }}
                            className="block text-gray-600 no-underline hover:bg-gray-100 hover:text-blue-800 transition-all duration-300"
                            style={{
                              display: 'block',
                              color: '#4b5563',
                              textDecoration: 'none',
                              padding: '8px 20px',
                              fontSize: '14px'
                            }}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Productos */}
              <li className="relative dropdown-container">
                <a
                  href="#"
                  onClick={(e) => handleDropdownToggle('products', e)}
                  className="text-white no-underline hover:text-blue-200 transition-colors duration-300 flex items-center py-2"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {t('header.nav.products')}
                  <span
                    className="transition-transform duration-300"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: activeDropdown === 'products' ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    ▼
                  </span>
                </a>
                {activeDropdown === 'products' && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-lg rounded-lg z-50"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'white',
                      minWidth: '280px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                      zIndex: 1000,
                      marginTop: '10px'
                    }}
                  >
                    <div style={{ padding: '20px 0' }}>
                      {t('header.dropdowns.products.sections', { returnObjects: true }).map((section, sectionIndex) => (
                        <div key={sectionIndex} style={{ marginBottom: sectionIndex < t('header.dropdowns.products.sections', { returnObjects: true }).length - 1 ? '15px' : 0 }}>
                          <div
                            style={{
                              color: '#1e3a8a',
                              fontWeight: '600',
                              fontSize: '14px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              padding: '0 20px 8px',
                              borderBottom: '1px solid #e5e7eb',
                              marginBottom: '8px'
                            }}
                          >
                            {section.title}
                          </div>
                          {section.items.map((item) => (
                            <a
                              key={item.key}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(`/products/${item.key}`, `products-${item.key}`);
                              }}
                              className="block text-gray-600 no-underline hover:bg-gray-100 hover:text-blue-800 transition-all duration-300"
                              style={{
                                display: 'block',
                                color: '#4b5563',
                                textDecoration: 'none',
                                padding: '8px 20px',
                                fontSize: '14px'
                              }}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              {/* Servicios */}
              <li className="relative dropdown-container">
                <a
                  href="#"
                  onClick={(e) => handleDropdownToggle('services', e)}
                  className="text-white no-underline hover:text-blue-200 transition-colors duration-300 flex items-center py-2"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {t('header.nav.services')}
                  <span
                    className="transition-transform duration-300"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    ▼
                  </span>
                </a>
                {activeDropdown === 'services' && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-lg rounded-lg z-50"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'white',
                      minWidth: '280px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                      zIndex: 1000,
                      marginTop: '10px'
                    }}
                  >
                    <div style={{ padding: '20px 0' }}>
                      {t('header.dropdowns.services.sections', { returnObjects: true }).map((section, sectionIndex) => (
                        <div key={sectionIndex} style={{ marginBottom: sectionIndex < t('header.dropdowns.services.sections', { returnObjects: true }).length - 1 ? '15px' : 0 }}>
                          <div
                            style={{
                              color: '#1e3a8a',
                              fontWeight: '600',
                              fontSize: '14px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              padding: '0 20px 8px',
                              borderBottom: '1px solid #e5e7eb',
                              marginBottom: '8px'
                            }}
                          >
                            {section.title}
                          </div>
                          {section.items.map((item) => (
                            <a
                              key={item.key}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(`/services/${item.key}`, `services-${item.key}`);
                              }}
                              className="block text-gray-600 no-underline hover:bg-gray-100 hover:text-blue-800 transition-all duration-300"
                              style={{
                                display: 'block',
                                color: '#4b5563',
                                textDecoration: 'none',
                                padding: '8px 20px',
                                fontSize: '14px'
                              }}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              <li className="relative">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('/blog', 'blog');
                  }}
                  className="text-white no-underline hover:text-blue-200 transition-colors duration-300 flex items-center py-2"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {t('header.nav.blog')}
                </a>
              </li>

              <li className="relative">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('/contact', 'contact');
                  }}
                  className="text-white no-underline hover:text-blue-200 transition-colors duration-300 flex items-center py-2"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {t('header.nav.contact')}
                </a>
              </li>
            </ul>

            {/* Mobile Menu Button - SIEMPRE VISIBLE EN MÓVIL */}
            <div className="lg:hidden">
              <button
                onClick={handleMobileMenuClick}
                className="p-2 rounded-lg text-white hover:text-blue-200 hover:bg-blue-600 hover:bg-opacity-20 transition-colors duration-200"
                aria-label="Toggle mobile menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  color: 'white'
                }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </div>


    </header>
  );
};

export default Header;