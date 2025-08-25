import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ChevronRight,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Hardcoded content para i18n (después se conectará con react-i18next)
  const content = {
    es: {
      company: {
        name: 'IPCSolder',
        tagline: 'Nosotros Somos Los Expertos',
        description: 'Líderes en soldadura electrónica y soluciones industriales para maquiladoras, automotriz y telecomunicaciones. Más de 15 años de experiencia atendiendo la industria electrónica.'
      },
      contact: {
        title: 'Información de Contacto',
        phone: '+52 (33) 1234-5678',
        email: 'info@ipcsolder.com',
        address: 'Guadalajara, Jalisco, México',
        hours: 'Lun - Vie: 8:00 AM - 6:00 PM'
      },
      navigation: {
        company: {
          title: 'Empresa',
          links: [
            { name: 'Nosotros', url: '/nosotros' },
            { name: 'Misión y Valores', url: '/mision-valores' },
            { name: 'Historia', url: '/historia' },
            { name: 'Equipo de Expertos', url: '/equipo' },
            { name: 'Certificaciones', url: '/certificaciones' }
          ]
        },
        products: {
          title: 'Productos',
          links: [
            { name: 'MRO', url: '/productos/mro' },
            { name: 'ESD', url: '/productos/esd' },
            { name: 'Solder', url: '/productos/solder' },
            { name: 'Máquinas', url: '/productos/machines' },
            { name: 'Láser', url: '/productos/laser' },
            { name: 'Tooling', url: '/productos/tooling' }
          ]
        },
        services: {
          title: 'Servicios',
          links: [
            { name: 'Fichas Técnicas', url: '/fichas-tecnicas' },
            { name: 'Soporte Técnico', url: '/soporte' },
            { name: 'Consultoría', url: '/consultoria' },
            { name: 'Capacitación', url: '/capacitacion' },
            { name: 'Blog Técnico', url: '/blog' }
          ]
        }
      },
      industries: {
        title: 'Industrias',
        list: [
          'Electrónica de Consumo',
          'Automotriz',
          'Maquiladoras',
          'Comunicaciones',
          'Fabricantes OEM'
        ]
      },
      newsletter: {
        title: 'Newsletter Técnico',
        description: 'Recibe papers técnicos y actualizaciones de la industria',
        placeholder: 'Tu email corporativo',
        button: 'Suscribirse'
      },
      legal: {
        copyright: '© 2025 IPCSolder. Todos los derechos reservados.',
        privacy: 'Política de Privacidad',
        terms: 'Términos y Condiciones',
        cookies: 'Política de Cookies'
      },
      social: {
        title: 'Síguenos'
      }
    },
    en: {
      company: {
        name: 'IPCSolder',
        tagline: 'We Are The Experts',
        description: 'Leaders in electronic soldering and industrial solutions for maquiladoras, automotive and telecommunications. Over 15 years of experience serving the electronics industry.'
      },
      contact: {
        title: 'Contact Information',
        phone: '+52 (33) 1234-5678',
        email: 'info@ipcsolder.com',
        address: 'Guadalajara, Jalisco, Mexico',
        hours: 'Mon - Fri: 8:00 AM - 6:00 PM'
      },
      navigation: {
        company: {
          title: 'Company',
          links: [
            { name: 'About Us', url: '/about' },
            { name: 'Mission & Values', url: '/mission-values' },
            { name: 'History', url: '/history' },
            { name: 'Expert Team', url: '/team' },
            { name: 'Certifications', url: '/certifications' }
          ]
        },
        products: {
          title: 'Products',
          links: [
            { name: 'MRO', url: '/products/mro' },
            { name: 'ESD', url: '/products/esd' },
            { name: 'Solder', url: '/products/solder' },
            { name: 'Machines', url: '/products/machines' },
            { name: 'Laser', url: '/products/laser' },
            { name: 'Tooling', url: '/products/tooling' }
          ]
        },
        services: {
          title: 'Services',
          links: [
            { name: 'Technical Sheets', url: '/technical-sheets' },
            { name: 'Technical Support', url: '/support' },
            { name: 'Consulting', url: '/consulting' },
            { name: 'Training', url: '/training' },
            { name: 'Technical Blog', url: '/blog' }
          ]
        }
      },
      industries: {
        title: 'Industries',
        list: [
          'Consumer Electronics',
          'Automotive',
          'Maquiladoras',
          'Communications',
          'OEM Manufacturers'
        ]
      },
      newsletter: {
        title: 'Technical Newsletter',
        description: 'Receive technical papers and industry updates',
        placeholder: 'Your corporate email',
        button: 'Subscribe'
      },
      legal: {
        copyright: '© 2025 IPCSolder. All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        cookies: 'Cookie Policy'
      },
      social: {
        title: 'Follow Us'
      }
    }
  };

  const t = content[currentLanguage];

  const handleFooterNavigation = (url) => {
    console.log(`🦶 Footer: Navegando a: ${url}`);
    // Aquí se implementará la navegación con React Router
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log(`📧 Footer: Suscripción newsletter con email: ${newsletterEmail}`);
    // Aquí se implementará la integración con el sistema de email
    setNewsletterEmail('');
  };

  const handleSocialClick = (platform) => {
    console.log(`📱 Footer: Click en red social: ${platform}`);
    // Aquí se implementarán los enlaces reales a redes sociales
  };

  console.log('🔄 Footer: Renderizando componente', {
    currentLanguage,
    newsletterEmail
  });

  return (
    <footer className="bg-gray-900 text-white">
      
      {/* Newsletter Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {t.newsletter.title}
              </h3>
              <p className="text-primary-100 mb-4 lg:mb-0">
                {t.newsletter.description}
              </p>
            </div>
            
            <div className="lg:flex-shrink-0 lg:ml-8">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 sm:w-80"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>{t.newsletter.button}</span>
                  <ChevronRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-2">
                IPC<span className="text-primary-400">Solder</span>
              </div>
              <p className="text-primary-400 font-medium mb-4">
                {t.company.tagline}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t.company.description}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white mb-4">{t.contact.title}</h4>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t.contact.phone}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t.contact.email}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t.contact.address}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Clock size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t.contact.hours}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.navigation.company.title}</h4>
            <ul className="space-y-2">
              {t.navigation.company.links.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleFooterNavigation(link.url)}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-1 group"
                  >
                    <span>{link.name}</span>
                    <ChevronRight 
                      size={12} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.navigation.products.title}</h4>
            <ul className="space-y-2">
              {t.navigation.products.links.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleFooterNavigation(link.url)}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-1 group"
                  >
                    <span>{link.name}</span>
                    <ChevronRight 
                      size={12} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Industries */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.navigation.services.title}</h4>
            <ul className="space-y-2 mb-6">
              {t.navigation.services.links.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleFooterNavigation(link.url)}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-1 group"
                  >
                    <span>{link.name}</span>
                    <ChevronRight 
                      size={12} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                    />
                  </button>
                </li>
              ))}
            </ul>

            {/* Industries */}
            <div>
              <h4 className="font-semibold text-white mb-4">{t.industries.title}</h4>
              <ul className="space-y-1">
                {t.industries.list.map((industry, index) => (
                  <li key={index} className="text-gray-300 text-sm">
                    • {industry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm font-medium">{t.social.title}:</span>
              
              <button
                onClick={() => handleSocialClick('linkedin')}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
              >
                <Linkedin size={20} />
              </button>
              
              <button
                onClick={() => handleSocialClick('facebook')}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
              >
                <Facebook size={20} />
              </button>
              
              <button
                onClick={() => handleSocialClick('twitter')}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
              >
                <Twitter size={20} />
              </button>
              
              <button
                onClick={() => handleSocialClick('youtube')}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
              >
                <Youtube size={20} />
              </button>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center space-x-6 text-sm">
              <button
                onClick={() => handleFooterNavigation('/privacy')}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                {t.legal.privacy}
              </button>
              
              <button
                onClick={() => handleFooterNavigation('/terms')}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                {t.legal.terms}
              </button>
              
              <button
                onClick={() => handleFooterNavigation('/cookies')}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                {t.legal.cookies}
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              {t.legal.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;