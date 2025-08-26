import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import MaintenanceChecker from './components/MaintenanceChecker';

// Importar estilos (si no están en main.jsx)
import './index.css';

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  // Inicialización de la aplicación
  useEffect(() => {
    console.log('🚀 App: Inicializando aplicación IPCSolder');
    
    const initializeApp = async () => {
      try {
        // Detectar idioma inicial
        const savedLanguage = localStorage.getItem('ipcsolder-language');
        if (savedLanguage && ['es', 'en'].includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage);
          console.log(`🌐 App: Idioma cargado desde localStorage: ${savedLanguage}`);
        } else {
          // Detectar idioma del navegador
          const browserLang = navigator.language.split('-')[0];
          const detectedLang = ['es', 'en'].includes(browserLang) ? browserLang : 'es';
          setCurrentLanguage(detectedLang);
          console.log(`🌍 App: Idioma detectado del navegador: ${detectedLang}`);
          
          // Guardar idioma detectado
          try {
            localStorage.setItem('ipcsolder-language', detectedLang);
          } catch (error) {
            console.warn('⚠️ App: Error guardando idioma en localStorage:', error);
          }
        }

        // Simular carga inicial (para futuras integraciones)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsLoading(false);
        console.log('✅ App: Aplicación inicializada correctamente');
        
      } catch (error) {
        console.error('❌ App: Error inicializando aplicación:', error);
        setAppError(error.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Manejar cambio de idioma global
  const handleGlobalLanguageChange = (newLanguage) => {
    console.log(`🌐 App: Cambio global de idioma de ${currentLanguage} a ${newLanguage}`);
    
    setCurrentLanguage(newLanguage);
    
    // Guardar en localStorage
    try {
      localStorage.setItem('ipcsolder-language', newLanguage);
      console.log(`💾 App: Idioma ${newLanguage} guardado globalmente`);
    } catch (error) {
      console.warn('⚠️ App: Error guardando idioma globalmente:', error);
    }

    // Aquí después se integrará con react-i18next
    // i18n.changeLanguage(newLanguage);
  };

  // Error Boundary Component
  const ErrorFallback = ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {currentLanguage === 'es' ? 'Error de Aplicación' : 'Application Error'}
        </h2>
        <p className="text-gray-600 mb-6">
          {currentLanguage === 'es' 
            ? 'Ha ocurrido un error inesperado. Por favor, recarga la página.' 
            : 'An unexpected error has occurred. Please reload the page.'
          }
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          {currentLanguage === 'es' ? 'Recargar Página' : 'Reload Page'}
        </button>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">
            {currentLanguage === 'es' ? 'Detalles técnicos' : 'Technical details'}
          </summary>
          <pre className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-auto">
            {error}
          </pre>
        </details>
      </div>
    </div>
  );

  // Loading Component
  const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="text-center">
        {/* Logo animado */}
        <div className="mb-8">
          <div className="text-4xl lg:text-6xl font-bold text-white mb-2 animate-pulse">
            IPC<span className="text-primary-200">Solder</span>
          </div>
          <div className="text-primary-200 font-medium">
            {currentLanguage === 'es' ? 'Nosotros Somos Los Expertos' : 'We Are The Experts'}
          </div>
        </div>
        
        {/* Loading spinner */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <div className="mt-4 text-primary-200">
          {currentLanguage === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      </div>
    </div>
  );

  // NotFound Component
  const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {currentLanguage === 'es' ? 'Página no encontrada' : 'Page not found'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {currentLanguage === 'es' 
            ? 'La página que buscas no existe o ha sido movida.' 
            : 'The page you are looking for does not exist or has been moved.'
          }
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
        >
          {currentLanguage === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </button>
      </div>
    </div>
  );

  // Placeholder components para rutas que aún no existen
  const ProductsPlaceholder = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {currentLanguage === 'es' ? 'Productos' : 'Products'}
        </h1>
        <p className="text-gray-600">
          {currentLanguage === 'es' ? 'Página en desarrollo' : 'Page under development'}
        </p>
      </div>
    </div>
  );

  const BlogPlaceholder = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600">
          {currentLanguage === 'es' ? 'Blog técnico en desarrollo' : 'Technical blog under development'}
        </p>
      </div>
    </div>
  );

  console.log('🔄 App: Renderizando aplicación principal', {
    currentLanguage,
    isLoading,
    appError: !!appError,
    location: window.location.pathname
  });

  // Mostrar error si existe
  if (appError) {
    return <ErrorFallback error={appError} />;
  }

  // Mostrar loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Aplicación principal
  return (
    <MaintenanceChecker>
      <Router>
        <div className="App">
        {/* Layout wrapper para todas las páginas */}
        <Layout 
          currentLanguage={currentLanguage}
          onLanguageChange={handleGlobalLanguageChange}
        >
          {/* Rutas de la aplicación */}
          <Routes>
            {/* Ruta principal */}
            <Route 
              path="/" 
              element={
                <Home 
                  currentLanguage={currentLanguage} 
                />
              } 
            />
            
            {/* Rutas de páginas existentes */}
            <Route 
              path="/about" 
              element={
                <About 
                  currentLanguage={currentLanguage} 
                />
              } 
            />
            
            <Route 
              path="/nosotros" 
              element={
                <About 
                  currentLanguage={currentLanguage} 
                />
              } 
            />
            
            <Route 
              path="/contact" 
              element={
                <Contact 
                  currentLanguage={currentLanguage} 
                />
              } 
            />
            
            <Route 
              path="/contacto" 
              element={
                <Contact 
                  currentLanguage={currentLanguage} 
                />
              } 
            />

            {/* Rutas placeholder para desarrollo */}
            <Route 
              path="/products" 
              element={<ProductsPlaceholder />} 
            />
            
            <Route 
              path="/productos" 
              element={<ProductsPlaceholder />} 
            />
            
            <Route 
              path="/products/:category" 
              element={<ProductsPlaceholder />} 
            />
            
            <Route 
              path="/productos/:category" 
              element={<ProductsPlaceholder />} 
            />
            
            <Route 
              path="/blog" 
              element={<BlogPlaceholder />} 
            />

            {/* Redirecciones útiles */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/inicio" element={<Navigate to="/" replace />} />

            {/* 404 - Debe estar al final */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>

        {/* Analytics placeholder (para futuras integraciones) */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Google Analytics o similar se integrará aquí
                console.log('📊 Analytics: Tracking initialized');
              `,
            }}
          />
        )}
        </div>
      </Router>
    </MaintenanceChecker>
  );
};

export default App;