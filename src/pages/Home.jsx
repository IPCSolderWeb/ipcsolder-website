import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Home = ({ currentLanguage = 'es' }) => {
  const [isVisible, setIsVisible] = useState({});

  // Hardcoded content para i18n siguiendo el mockup exacto
  const content = {
    es: {
      hero: {
        title: 'IPCSolder',
        subtitle: 'Electronics Assembly Solutions!',
        description: 'Líderes en soldadura electrónica y soluciones industriales para maquiladoras, automotriz y telecomunicaciones.',
        cta: 'Solicitar Información'
      },
      valueProposition: {
        title: 'Nosotros Somos Los Expertos',
        subtitle: 'En Soldadura Electrónica y Soluciones Industriales',
        description: 'Con más de 15 años de experiencia, IPCSolder se ha consolidado como el proveedor líder en soluciones técnicas especializadas para la industria electrónica. Desde maquiladoras hasta fabricantes OEM, proporcionamos exactamente lo que cada proceso necesita.',
        features: [
          'Experiencia comprobada en la industria',
          'Soluciones técnicas personalizadas',
          'Soporte especializado 24/7',
          'Productos de calidad certificada'
        ]
      },
      products: {
        title: 'Nuestras Categorías de Productos',
        subtitle: 'Soluciones completas para cada etapa de tu proceso de manufactura',
        categories: [
          {
            key: 'mro',
            title: 'MRO',
            subtitle: 'Maintenance, Repair & Operations',
            items: [
              'Termopares Tipo K',
              'Chip Bonder',
              'Alcohol Isopropílico (IPA)',
              'Limpiador de Boquillas',
              'Router Bits'
            ]
          },
          {
            key: 'esd',
            title: 'ESD',
            subtitle: 'Electrostatic Discharge Protection',
            items: [
              'Bandejas EVA',
              'Bandejas Termoformadas',
              'Contenedores Antiestáticos',
              'Bandejas de Fibra de Vidrio',
              'Alfombrillas EVA'
            ]
          },
          {
            key: 'solder',
            title: 'SOLDER PRODUCTS',
            subtitle: 'Materiales de Soldadura Especializados',
            items: [
              'Barras de Soldadura',
              'Alambres de Soldadura',
              'Flux Líquido',
              'Preformas de Soldadura'
            ]
          },
          {
            key: 'machines',
            title: 'MACHINES',
            subtitle: 'Equipos y Servicios Especializados',
            items: [
              'SMT',
              'BACKEND', 
              'AUTOMATIC INSPECTION',
              'CONFORMAL',
              'THROUGH HOLE',
              'REPAIR'
            ]
          },
          {
            key: 'laser',
            title: 'LASER',
            subtitle: 'Sistemas de Corte y Grabado Láser',
            items: [
              'Corte de Precisión',
              'Grabado Láser Especializado',
              'Plantillas de Inspección',
              'Trabajos Personalizados'
            ]
          },
          {
            key: 'tooling',
            title: 'TOOLING',
            subtitle: 'Herramientas y Fixtures Especializados',
            items: [
              'SMT',
              'BACKEND',
              'ASSEMBLY'
            ]
          }
        ]
      },
      services: {
        title: 'Nuestros Servicios Especializados',
        subtitle: 'Soluciones integrales más allá de los productos',
        list: [
          {
            title: 'Soporte Técnico Especializado',
            description: 'Asesoría técnica personalizada para optimizar tus procesos de manufactura.'
          },
          {
            title: 'Assessment de Líneas de Producción',
            description: 'Evaluación completa de tus líneas para identificar oportunidades de mejora.'
          },
          {
            title: 'Consultoría en Procesos',
            description: 'Optimización de procesos basada en nuestra experiencia de más de 15 años.'
          },
          {
            title: 'Capacitación Técnica',
            description: 'Entrenamiento especializado para tu equipo técnico.'
          }
        ]
      },
      contact: {
        title: 'Contacta a Nuestros Expertos',
        subtitle: 'Estamos listos para ayudarte a encontrar la solución perfecta',
        description: 'Nuestro equipo de especialistas está disponible para analizar tus necesidades específicas y proporcionarte las mejores recomendaciones técnicas.',
        info: {
          phone: '+52 (33) 1234-5678',
          email: 'info@ipcsolder.com',
          address: 'Guadalajara, Jalisco, México',
          hours: 'Lun - Vie: 8:00 AM - 6:00 PM'
        },
        cta: 'Solicitar Cotización'
      }
    },
    en: {
      hero: {
        title: 'IPCSolder',
        subtitle: 'Electronics Assembly Solutions!',
        description: 'Leaders in electronic soldering and industrial solutions for maquiladoras, automotive and telecommunications.',
        cta: 'Request Information'
      },
      valueProposition: {
        title: 'We Are The Experts',
        subtitle: 'In Electronic Soldering and Industrial Solutions',
        description: 'With over 15 years of experience, IPCSolder has established itself as the leading provider of specialized technical solutions for the electronics industry. From maquiladoras to OEM manufacturers, we provide exactly what each process needs.',
        features: [
          'Proven industry experience',
          'Customized technical solutions',
          'Specialized 24/7 support',
          'Certified quality products'
        ]
      },
      products: {
        title: 'Our Product Categories',
        subtitle: 'Complete solutions for every stage of your manufacturing process',
        categories: [
          {
            key: 'mro',
            title: 'MRO',
            subtitle: 'Maintenance, Repair & Operations',
            items: [
              'Type K Thermocouples',
              'Chip Bonder',
              'Isopropyl Alcohol (IPA)',
              'Nozzle Cleaner',
              'Router Bits'
            ]
          },
          {
            key: 'esd',
            title: 'ESD',
            subtitle: 'Electrostatic Discharge Protection',
            items: [
              'EVA Trays',
              'Thermoformed Trays',
              'Antistatic Containers',
              'Fiberglass Trays',
              'EVA Mats'
            ]
          },
          {
            key: 'solder',
            title: 'SOLDER PRODUCTS',
            subtitle: 'Specialized Soldering Materials',
            items: [
              'Solder Bars',
              'Solder Wires',
              'Liquid Flux',
              'Solder Preforms'
            ]
          },
          {
            key: 'machines',
            title: 'MACHINES',
            subtitle: 'Specialized Equipment and Services',
            items: [
              'SMT',
              'BACKEND',
              'AUTOMATIC INSPECTION',
              'CONFORMAL',
              'THROUGH HOLE',
              'REPAIR'
            ]
          },
          {
            key: 'laser',
            title: 'LASER',
            subtitle: 'Laser Cutting and Engraving Systems',
            items: [
              'Precision Cutting',
              'Specialized Laser Engraving',
              'Inspection Templates',
              'Custom Work'
            ]
          },
          {
            key: 'tooling',
            title: 'TOOLING',
            subtitle: 'Specialized Tools and Fixtures',
            items: [
              'SMT',
              'BACKEND',
              'ASSEMBLY'
            ]
          }
        ]
      },
      services: {
        title: 'Our Specialized Services',
        subtitle: 'Comprehensive solutions beyond products',
        list: [
          {
            title: 'Specialized Technical Support',
            description: 'Personalized technical consulting to optimize your manufacturing processes.'
          },
          {
            title: 'Production Line Assessment',
            description: 'Complete evaluation of your lines to identify improvement opportunities.'
          },
          {
            title: 'Process Consulting',
            description: 'Process optimization based on our 15+ years of experience.'
          },
          {
            title: 'Technical Training',
            description: 'Specialized training for your technical team.'
          }
        ]
      },
      contact: {
        title: 'Contact Our Experts',
        subtitle: 'We are ready to help you find the perfect solution',
        description: 'Our team of specialists is available to analyze your specific needs and provide you with the best technical recommendations.',
        info: {
          phone: '+52 (33) 1234-5678',
          email: 'info@ipcsolder.com',
          address: 'Guadalajara, Jalisco, Mexico',
          hours: 'Mon - Fri: 8:00 AM - 6:00 PM'
        },
        cta: 'Request Quote'
      }
    }
  };

  const t = content[currentLanguage];

  // Animation on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigation = (path, section) => {
    console.log(`🏠 Home: Navegando a ${path} (${section})`);
  };

  const handleCTA = (action) => {
    console.log(`📞 Home: CTA clicked - ${action}`);
  };

  console.log('🔄 Home: Renderizando página principal corporativa', {
    currentLanguage,
    visibleSections: Object.keys(isVisible).length
  });

  return (
    <div className="bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-white min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/hero/hero-machines.jpg)',
              filter: 'brightness(0.7)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <div 
              id="hero-content"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible['hero-content'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="mb-8">
                <h1 className="text-6xl lg:text-8xl font-bold text-primary-600 mb-4">
                  {t.hero.title}
                </h1>
                <p className="text-2xl lg:text-3xl text-primary-500 font-medium mb-6">
                  {t.hero.subtitle}
                </p>
              </div>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl">
                {t.hero.description}
              </p>
              
              <button
                onClick={() => handleCTA('hero-cta')}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center space-x-2 group text-lg"
              >
                <span>{t.hero.cta}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Right side - intentionally empty for machine image background */}
            <div></div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div 
              id="value-prop-content"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible['value-prop-content'] 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
              }`}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {t.valueProposition.title}
              </h2>
              <p className="text-xl text-primary-600 font-semibold mb-6">
                {t.valueProposition.subtitle}
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t.valueProposition.description}
              </p>
              
              <div className="space-y-4">
                {t.valueProposition.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div 
              id="value-prop-image"
              data-animate
              className={`transition-all duration-1000 delay-300 ${
                isVisible['value-prop-image'] 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="relative">
                <img 
                  src="/images/about/about-team.jpg" 
                  alt="Equipo de expertos IPCSolder"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-primary-600/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div 
            id="products-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible['products-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.products.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {t.products.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.products.categories.map((category, index) => (
              <div 
                key={category.key}
                id={`product-${index}`}
                data-animate
                className={`group cursor-pointer transition-all duration-500 ${
                  isVisible[`product-${index}`] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => handleNavigation(`/products/${category.key}`, category.key)}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300 h-full">
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {category.subtitle}
                    </p>
                  </div>
                  
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600 flex items-start">
                        <span className="text-primary-600 mr-2 mt-1.5 block w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                    <span className="mr-2 text-sm">Ver más</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div 
            id="services-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible['services-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.services.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {t.services.list.map((service, index) => (
              <div 
                key={index}
                id={`service-${index}`}
                data-animate
                className={`bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-500 ${
                  isVisible[`service-${index}`] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div 
              id="contact-content"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible['contact-content'] 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
              }`}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t.contact.title}
              </h2>
              <p className="text-xl text-primary-100 mb-6">
                {t.contact.subtitle}
              </p>
              <p className="text-lg text-primary-200 mb-8 leading-relaxed">
                {t.contact.description}
              </p>
              
              <button
                onClick={() => handleCTA('contact')}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center space-x-2 group"
              >
                <span>{t.contact.cta}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            <div 
              id="contact-info"
              data-animate
              className={`transition-all duration-1000 delay-300 ${
                isVisible['contact-info'] 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Phone size={20} className="text-primary-200 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t.contact.info.phone}</div>
                      <div className="text-primary-200 text-sm">Llamar ahora</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Mail size={20} className="text-primary-200 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t.contact.info.email}</div>
                      <div className="text-primary-200 text-sm">Enviar email</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <MapPin size={20} className="text-primary-200 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t.contact.info.address}</div>
                      <div className="text-primary-200 text-sm">Nuestra ubicación</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Clock size={20} className="text-primary-200 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t.contact.info.hours}</div>
                      <div className="text-primary-200 text-sm">Horario de atención</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;