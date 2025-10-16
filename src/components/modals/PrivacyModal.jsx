import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiX as CloseIcon } from 'react-icons/hi';

const PrivacyModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('privacy.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-blue max-w-none">
            
            {/* Última actualización */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 mb-0">
                <strong>{t('privacy.lastUpdated')}:</strong> {new Date().toLocaleDateString(t('privacy.locale'))}
              </p>
            </div>

            {/* Introducción */}
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('privacy.sections.intro.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.sections.intro.content')}
              </p>
            </section>

            {/* Información que recopilamos */}
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('privacy.sections.dataCollection.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                {t('privacy.sections.dataCollection.intro')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {t('privacy.sections.dataCollection.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Cómo usamos la información */}
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('privacy.sections.dataUse.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                {t('privacy.sections.dataUse.intro')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {t('privacy.sections.dataUse.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Protección de datos */}
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('privacy.sections.dataProtection.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.sections.dataProtection.content')}
              </p>
            </section>

            {/* No vendemos información */}
            <section className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-green-900 mb-3">
                  {t('privacy.sections.noSale.title')}
                </h3>
                <p className="text-green-800 leading-relaxed mb-0">
                  {t('privacy.sections.noSale.content')}
                </p>
              </div>
            </section>

            {/* Derechos del usuario */}
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('privacy.sections.userRights.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                {t('privacy.sections.userRights.intro')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {t('privacy.sections.userRights.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Contacto */}
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('privacy.sections.contact.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.sections.contact.content')}
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                <p className="text-gray-800 mb-1">
                  <strong>Email:</strong> ventas@ipcsolder.com
                </p>
                <p className="text-gray-800 mb-0">
                  <strong>{t('privacy.sections.contact.phone')}:</strong> +52 (33) 4514 2400
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('privacy.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;