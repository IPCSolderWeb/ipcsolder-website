import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

const Navigation = ({ 
  variant = 'desktop', // 'desktop' | 'mobile'
  currentLanguage = 'es',
  onNavigate,
  onClose // Para cerrar el menú móvil
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dropdownRef = useRef(null);

  // Hardcoded content para i18n (después se conectará con react-i18next)
  const content = {
    es: {
      nav: {
        home: 'Inicio',
        about: 'Nosotros',
        products: 'Productos',
        contact: 'Contacto',
        technical: 'Fichas Técnicas',
        blog: 'Blog'
      },
      products: {
        title: 'Nuestros Productos',
        mro: {
          name: 'MRO',
          description: 'Mantenimiento, Reparación y Operación'
        },
        esd: {
          name: 'ESD',
          description: 'Protección Electrostática'
        },
        solder: {
          name: 'Solder',
          description: 'Materiales de Soldadura'
        },
        machines: {
          name: 'Máquinas',
          description: 'Equipos de Soldadura Automática'
        },
        laser: {
          name: 'Láser',
          description: 'Sistemas de Soldadura Láser'
        },
        tooling: {
          name: 'Tooling',
          description: 'Herramientas y Accesorios'
        }
      },
      about: {
        title: 'Sobre IPCSolder',
        mission: 'Misión y Valores',
        history: 'Historia',
        team: 'Equipo de Expertos',
        certifications: 'Certificaciones'
      },
      cta: {
        viewAll: 'Ver Todos los Productos',
        requestInfo: 'Solicitar Información',
        getQuote: 'Solicitar Cotización'
      }
    },
    en: {
      nav: {
        home: 'Home',
        about: 'About Us',
        products: 'Products',
        contact: 'Contact',
        technical: 'Technical Sheets',
        blog: 'Blog'
      },
      products: {
        title: 'Our Products',
        mro: {
          name: 'MRO',
          description: 'Maintenance, Repair & Operation'
        },
        esd: {
          name: 'ESD',
          description: 'Electrostatic Protection'
        },
        solder: {
          name: 'Solder',
          description: 'Soldering Materials'
        },
        machines: {
          name: 'Machines',
          description: 'Automatic Soldering Equipment'
        },
        laser: {
          name: 'Laser',
          description: 'Laser Soldering Systems'
        },
        tooling: {
          name: 'Tooling',
          description: 'Tools & Accessories'
        }
      },
      about: {
        title: 'About IPCSolder',
        mission: 'Mission & Values',
        history: 'History',
        team: 'Expert Team',
        certifications: 'Certifications'
      },
      cta: {
        viewAll: 'View All Products',
        requestInfo: 'Request Information',
        getQuote: 'Request Quote'
      }
    }
  };

  const t = content[currentLanguage];

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        console.log('🎯 Navigation: Dropdown cerrado por click fuera');
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      console.log('🎯 Navigation: Event listener agregado para dropdown');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      console.log('🧹 Navigation: Event listener removido');
    };
  }, [activeDropdown]);

  const handleNavClick = (path, section) => {
    console.log(`🧭 Navigation: Navegando a ${path} (${section})`);
    
    if (onNavigate) {
      onNavigate(path, section);
    }
    
    // Cerrar dropdown y menú móvil
    setActiveDropdown(null);
    if (onClose && variant === 'mobile') {
      onClose();
    }
  };

  const handleDropdownToggle = (dropdown) => {
    const newState = activeDropdown === dropdown ? null : dropdown;
    setActiveDropdown(newState);
    console.log(`📋 Navigation: Toggle dropdown ${dropdown} - Nuevo estado: ${newState}`);
  };

  const handleProductClick = (productKey) => {
    const path = `/products/${productKey}`;
    handleNavClick(path, `products-${productKey}`);
  };

  const handleAboutSubClick = (aboutKey) => {
    const path = `/about/${aboutKey}`;
    handleNavClick(path, `about-${aboutKey}`);
  };

  console.log('🔄 Navigation: Renderizando componente', {
    variant,
    currentLanguage,
    activeDropdown,
    hoveredItem
  });

  // Estructura de navegación principal
  const navigationItems = [
    {
      key: 'home',
      label: t.nav.home,
      path: '/',
      action: () => handleNavClick('/', 'home')
    },
    {
      key: 'about',
      label: t.nav.about,
      hasDropdown: true,
      submenu: [
        {
          key: 'mission',
          label: t.about.mission,
          path: '/about/mission',
          action: () => handleAboutSubClick('mission')
        },
        {
          key: 'history', 
          label: t.about.history,
          path: '/about/history',
          action: () => handleAboutSubClick('history')
        },
        {
          key: 'team',
          label: t.about.team,
          path: '/about/team',
          action: () => handleAboutSubClick('team')
        },
        {
          key: 'certifications',
          label: t.about.certifications,
          path: '/about/certifications',
          action: () => handleAboutSubClick('certifications')
        }
      ]
    },
    {
      key: 'products',
      label: t.nav.products,
      hasDropdown: true,
      megaMenu: true
    },
    {
      key: 'technical',
      label: t.nav.technical,
      path: '/technical-sheets',
      action: () => handleNavClick('/technical-sheets', 'technical')
    },
    {
      key: 'blog',
      label: t.nav.blog,
      path: '/blog',
      action: () => handleNavClick('/blog', 'blog')
    },
    {
      key: 'contact',
      label: t.nav.contact,
      path: '/contact',
      isButton: true,
      action: () => handleNavClick('/contact', 'contact')
    }
  ];

  if (variant === 'mobile') {
    return (
      <div className="lg:hidden">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div key={item.key}>
              {/* Item principal */}
              {item.hasDropdown ? (
                <button
                  onClick={() => handleDropdownToggle(item.key)}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 font-medium rounded-lg"
                >
                  <span>{item.label}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      activeDropdown === item.key ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <button
                  onClick={item.action}
                  className={`w-full text-left py-3 px-4 transition-colors duration-200 font-medium rounded-lg ${
                    item.isButton
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              )}

              {/* Submenu para About */}
              {item.key === 'about' && activeDropdown === 'about' && item.submenu && (
                <div className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-4">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.key}
                      onClick={subItem.action}
                      className="block w-full text-left py-2 px-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Mega menu para Products */}
              {item.key === 'products' && activeDropdown === 'products' && (
                <div className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-4">
                  {Object.entries(t.products).filter(([key]) => key !== 'title').map(([key, product]) => (
                    <button
                      key={key}
                      onClick={() => handleProductClick(key)}
                      className="block w-full text-left py-2 px-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{product.description}</div>
                      </div>
                    </button>
                  ))}
                  
                  {/* CTA en mobile */}
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleNavClick('/products', 'all-products')}
                      className="w-full bg-primary-100 text-primary-700 py-2 px-3 rounded-lg hover:bg-primary-200 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <span>{t.cta.viewAll}</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    );
  }

  // Desktop Navigation
  return (
    <div className="hidden lg:flex items-center space-x-8" ref={dropdownRef}>
      {navigationItems.map((item) => (
        <div key={item.key} className="relative">
          {item.hasDropdown ? (
            <button
              onClick={() => handleDropdownToggle(item.key)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
            >
              <span>{item.label}</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${
                  activeDropdown === item.key ? 'rotate-180' : ''
                }`}
              />
            </button>
          ) : (
            <button
              onClick={item.action}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`transition-colors duration-200 font-medium py-2 px-4 rounded-lg ${
                item.isButton
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {item.label}
            </button>
          )}

          {/* Dropdown About */}
          {item.key === 'about' && activeDropdown === 'about' && item.submenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{t.about.title}</h3>
              </div>
              {item.submenu.map((subItem) => (
                <button
                  key={subItem.key}
                  onClick={subItem.action}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}

          {/* Mega Menu Products */}
          {item.key === 'products' && activeDropdown === 'products' && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 py-4 z-50">
              <div className="px-6 pb-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-lg">{t.products.title}</h3>
              </div>
              
              <div className="p-4 space-y-2">
                {Object.entries(t.products).filter(([key]) => key !== 'title').map(([key, product]) => (
                  <button
                    key={key}
                    onClick={() => handleProductClick(key)}
                    className="block w-full text-left p-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-primary-600">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {product.description}
                        </div>
                      </div>
                      <ExternalLink 
                        size={16} 
                        className="text-gray-400 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-200" 
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* CTA Footer */}
              <div className="px-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleNavClick('/products', 'all-products')}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <span>{t.cta.viewAll}</span>
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Navigation;