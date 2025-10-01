import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    HiMail as Mail,
    HiPhone as Phone,
    HiLocationMarker as Location,
    HiChat as Chat,
    HiCheckCircle as CheckCircle
} from 'react-icons/hi';

const Contact = ({ currentLanguage = 'es' }) => {
    const { t, ready, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        municipality: '',
        company: '',
        position: '',
        industry: '',
        message: '',
        acceptTerms: false
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [emailSuggestion, setEmailSuggestion] = useState('');
    const [isVisible, setIsVisible] = useState({});

    // Animation on scroll
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const timer = setTimeout(() => {
            const sections = document.querySelectorAll('[data-animate]');
            sections.forEach((section) => observer.observe(section));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    // Función para calcular distancia entre strings (similitud)
    const levenshteinDistance = (str1, str2) => {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    };

    // Función inteligente para detectar errores en emails
    const checkEmailTypos = (email) => {
        const popularDomains = [
            'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com',
            'live.com', 'icloud.com', 'aol.com', 'protonmail.com',
            'zoho.com', 'yandex.com'
        ];

        const emailParts = email.split('@');
        if (emailParts.length !== 2) return null;

        const [username, domain] = emailParts;
        const domainLower = domain.toLowerCase();

        // Buscar el dominio más similar
        let bestMatch = null;
        let minDistance = Infinity;
        const maxDistance = 2; // Máximo 2 caracteres de diferencia

        for (const popularDomain of popularDomains) {
            const distance = levenshteinDistance(domainLower, popularDomain);
            
            // Solo sugerir si hay diferencia pero es similar
            if (distance > 0 && distance <= maxDistance && distance < minDistance) {
                minDistance = distance;
                bestMatch = popularDomain;
            }
        }

        return bestMatch ? `${username}@${bestMatch}` : null;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Verificar errores de email en tiempo real
        if (name === 'email' && value) {
            const suggestion = checkEmailTypos(value);
            console.log('📧 Email check:', value, '→ Suggestion:', suggestion);
            setEmailSuggestion(suggestion || '');
        }

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const acceptEmailSuggestion = () => {
        setFormData(prev => ({
            ...prev,
            email: emailSuggestion
        }));
        setEmailSuggestion('');
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = t('contact.form.validation.name');
        }

        if (!formData.email.trim()) {
            errors.email = t('contact.form.validation.required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = t('contact.form.validation.email');
        }

        if (!formData.phone.trim()) {
            errors.phone = t('contact.form.validation.required');
        }

        if (!formData.company.trim()) {
            errors.company = t('contact.form.validation.company');
        }

        if (!formData.message.trim()) {
            errors.message = t('contact.form.validation.message');
        } else if (formData.message.trim().length < 10) {
            errors.message = t('contact.form.validation.minLength');
        }

        if (!formData.acceptTerms) {
            errors.acceptTerms = t('contact.form.terms.required');
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(false);
        setSubmitSuccess(false);

        console.log('🌐 Enviando formulario con idioma:', i18n.language);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    state: formData.state,
                    municipality: formData.municipality,
                    company: formData.company,
                    position: formData.position,
                    industry: formData.industry,
                    message: formData.message,
                    language: i18n.language
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('📧 Contact Form Submitted:', data);
                setSubmitSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    state: '',
                    municipality: '',
                    company: '',
                    position: '',
                    industry: '',
                    message: '',
                    acceptTerms: false
                });

                // Hide success message after 5 seconds
                setTimeout(() => setSubmitSuccess(false), 5000);
            } else {
                throw new Error(data.error || 'Error al enviar el mensaje');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError(true);

            // Hide error message after 5 seconds
            setTimeout(() => setSubmitError(false), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContactMethod = (method) => {
        console.log(`📞 Contact method clicked: ${method}`);

        switch (method) {
            case 'email':
                window.location.href = 'mailto:ventas@ipcsolder.com';
                break;
            case 'phone':
                window.location.href = 'tel:+523312345678';
                break;
            case 'whatsapp':
                window.open('https://wa.me/523312345678', '_blank');
                break;
            default:
                break;
        }
    };

    // Si las traducciones no están listas, mostrar loading
    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-4">{t('common.loading')}</div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                            {t('contact.breadcrumb.home')}
                        </a>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{t('contact.breadcrumb.contact')}</span>
                    </nav>
                </div>
            </div>

            {/* Page Hero */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' fill='%23ffffff'%3E%3Cpath d='M0,20 Q250,80 500,20 T1000,20 L1000,100 L0,100 Z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: '100% 100px'
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        id="hero-content"
                        data-animate
                        className={`transition-all duration-1000 ${isVisible['hero-content']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {t('contact.hero.title')}
                        </h1>
                        <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4">
                            {t('contact.hero.subtitle')}
                        </div>
                        <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {t('contact.hero.description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* Contact Information */}
                        <div
                            id="contact-info"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 transition-all duration-1000 ${isVisible['contact-info']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-3xl font-bold text-blue-900 mb-6">{t('contact.info.title')}</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {t('contact.info.description')}
                            </p>

                            {/* Contact Methods */}
                            <div className="space-y-4 mb-8">
                                <div
                                    onClick={() => handleContactMethod('email')}
                                    className="flex items-center p-5 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-1">{t('contact.info.methods.email.title')}</h3>
                                        <p className="text-blue-600 font-medium">{t('contact.info.methods.email.value')}</p>
                                        <p className="text-gray-500 text-sm">{t('contact.info.methods.email.description')}</p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => handleContactMethod('phone')}
                                    className="flex items-center p-5 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-1">{t('contact.info.methods.phone.title')}</h3>
                                        <p className="text-blue-600 font-medium">{t('contact.info.methods.phone.value')}</p>
                                        <p className="text-gray-500 text-sm">{t('contact.info.methods.phone.description')}</p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => handleContactMethod('whatsapp')}
                                    className="flex items-center p-5 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Chat size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-1">{t('contact.info.methods.whatsapp.title')}</h3>
                                        <p className="text-blue-600 font-medium">{t('contact.info.methods.whatsapp.value')}</p>
                                        <p className="text-gray-500 text-sm">{t('contact.info.methods.whatsapp.description')}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-5 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center text-white mr-4">
                                        <Location size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-1">{t('contact.info.methods.location.title')}</h3>
                                        <p className="text-gray-600">{t('contact.info.methods.location.value')}</p>
                                        <p className="text-gray-500 text-sm">{t('contact.info.methods.location.description')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-blue-900 mb-4">{t('contact.info.map.title')}</h3>
                                <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.54289823879!2d-103.43422074335936!3d20.659698988642324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b19efc1ae64b%3A0x20c69352378f9fd4!2sGuadalajara%2C%20Jal.!5e0!3m2!1ses!2smx!4v1647883234567!5m2!1ses!2smx"
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                                <div className="text-center text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                    {t('contact.info.map.description')}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div
                            id="contact-form"
                            data-animate
                            className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 transition-all duration-1000 ${isVisible['contact-form']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '200ms' }}
                        >
                            <h2 className="text-3xl font-bold text-blue-900 mb-4">{t('contact.form.title')}</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {t('contact.form.subtitle')}
                            </p>

                            {submitSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                                    <CheckCircle size={20} className="mr-2" />
                                    <span>{t('contact.form.success.message')}</span>
                                </div>
                            )}

                            {submitError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{t('contact.form.error.message')}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('contact.form.fields.name.label')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder={t('contact.form.fields.name.placeholder')}
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                    )}
                                </div>

                                {/* Email and Phone Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('contact.form.fields.email.label')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder={t('contact.form.fields.email.placeholder')}
                                        />
                                        {formErrors.email && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                        )}
                                        {emailSuggestion && (
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-blue-800 text-sm">
                                                    {t('contact.form.emailSuggestion.text')}{' '}
                                                    <button
                                                        type="button"
                                                        onClick={acceptEmailSuggestion}
                                                        className="font-semibold text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        {emailSuggestion}
                                                    </button>
                                                    ?
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('contact.form.fields.phone.label')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder={t('contact.form.fields.phone.placeholder')}
                                        />
                                        {formErrors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* State and Municipality Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('contact.form.fields.state.label')}
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder={t('contact.form.fields.state.placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="municipality" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('contact.form.fields.municipality.label')}
                                        </label>
                                        <input
                                            type="text"
                                            id="municipality"
                                            name="municipality"
                                            value={formData.municipality}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder={t('contact.form.fields.municipality.placeholder')}
                                        />
                                    </div>
                                </div>

                                {/* Company and Position Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('contact.form.fields.company.label')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${formErrors.company ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder={t('contact.form.fields.company.placeholder')}
                                        />
                                        {formErrors.company && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('contact.form.fields.position.label')}
                                        </label>
                                        <input
                                            type="text"
                                            id="position"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder={t('contact.form.fields.position.placeholder')}
                                        />
                                    </div>
                                </div>

                                {/* Industry */}
                                <div>
                                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('contact.form.fields.industry.label')}
                                    </label>
                                    <select
                                        id="industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        {t('contact.form.fields.industry.options', { returnObjects: true }).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('contact.form.fields.message.label')} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${formErrors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder={t('contact.form.fields.message.placeholder')}
                                    />
                                    {formErrors.message && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                                    )}
                                </div>

                                {/* Terms Checkbox */}
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                                        {t('contact.form.terms.label')} <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                {formErrors.acceptTerms && (
                                    <p className="text-red-500 text-sm">{formErrors.acceptTerms}</p>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-1'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t('contact.form.sending')}
                                        </span>
                                    ) : (
                                        t('contact.form.buttons.submit')
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternative Contact Methods */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        id="alt-contact-header"
                        data-animate
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible['alt-contact-header']
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                            {t('contact.alternative.title')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('contact.alternative.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Email Card */}
                        <div
                            id="email-card"
                            data-animate
                            className={`bg-gray-50 rounded-xl p-8 text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 ${isVisible['email-card']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl">
                                📧
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">{t('contact.alternative.methods.email.title')}</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                {t('contact.alternative.methods.email.description')}
                            </p>
                            <button
                                onClick={() => handleContactMethod('email')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                {t('contact.alternative.methods.email.button')}
                            </button>
                        </div>

                        {/* Phone Card */}
                        <div
                            id="phone-card"
                            data-animate
                            className={`bg-gray-50 rounded-xl p-8 text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 ${isVisible['phone-card']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '150ms' }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl">
                                📞
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">{t('contact.alternative.methods.phone.title')}</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                {t('contact.alternative.methods.phone.description')}
                            </p>
                            <button
                                onClick={() => handleContactMethod('phone')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                {t('contact.alternative.methods.phone.button')}
                            </button>
                        </div>

                        {/* WhatsApp Card */}
                        <div
                            id="whatsapp-card"
                            data-animate
                            className={`bg-gray-50 rounded-xl p-8 text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 ${isVisible['whatsapp-card']
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: '300ms' }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl">
                                💬
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">{t('contact.alternative.methods.whatsapp.title')}</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                {t('contact.alternative.methods.whatsapp.description')}
                            </p>
                            <button
                                onClick={() => handleContactMethod('whatsapp')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                {t('contact.alternative.methods.whatsapp.button')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;