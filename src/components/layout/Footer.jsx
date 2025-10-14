import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiPhone as Phone,
  FiMail as Mail,
  FiMapPin as MapPin,
  FiClock as Clock,
  FiChevronRight as ChevronRight,
  FiExternalLink as ExternalLink
} from 'react-icons/fi';
import {
  FaFacebook as Facebook,
  FaLinkedin as Linkedin,
  FaTwitter as Twitter,
  FaYoutube as Youtube
} from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();




  const handleFooterNavigation = (url) => {
    console.log(`🦶 Footer: Navegando a: ${url}`);
    // Aquí se implementará la navegación con React Router
  };



  const handleSocialClick = (platform) => {
    console.log(`📱 Footer: Click en red social: ${platform}`);
    // Aquí se implementarán los enlaces reales a redes sociales
  };

  console.log('🔄 Footer: Renderizando componente');

  return (
    <footer className="bg-gray-900 text-white">



      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-2">
                IPCSolder{/*<span className="text-primary-400">Solder</span>*/}
              </div>
              <p className="text-primary-400 font-medium mb-4">
                {t('footer.company.tagline')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('footer.company.description')}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white mb-4">{t('footer.contact.title')}</h4>

              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t('footer.contact.phone')}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t('footer.contact.email')}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t('footer.contact.address')}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Clock size={16} className="text-primary-400 flex-shrink-0" />
                <span>{t('footer.contact.hours')}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.navigation.company.title')}</h4>
            <ul className="space-y-2">
              {t('footer.navigation.company.links', { returnObjects: true }).map((link, index) => (
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
            <h4 className="font-semibold text-white mb-4">{t('footer.navigation.products.title')}</h4>
            <ul className="space-y-2">
              {t('footer.navigation.products.links', { returnObjects: true }).map((link, index) => (
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
            <h4 className="font-semibold text-white mb-4">{t('footer.navigation.services.title')}</h4>
            <ul className="space-y-2 mb-6">
              {t('footer.navigation.services.links', { returnObjects: true }).map((link, index) => (
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
              <h4 className="font-semibold text-white mb-4">{t('footer.industries.title')}</h4>
              <ul className="space-y-1">
                {t('footer.industries.list', { returnObjects: true }).map((industry, index) => (
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
              <span className="text-gray-400 text-sm font-medium">{t('footer.social.title')}:</span>

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
                {t('footer.legal.privacy')}
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              {t('footer.legal.copyright')}
            </p>
            <p className="text-gray-500 text-xs">
              {t('footer.legal.developer')}
              <a
                href="https://www.shinerdev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors duration-200 ml-1"
              >
                ShinerDev
                <ExternalLink size={12} className="inline ml-1" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;