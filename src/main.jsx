import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// DEBUG: Log inicial
console.log('🔍 DEBUG: main.jsx cargado');
console.log('🔍 DEBUG: React version:', React.version);
console.log('🔍 DEBUG: Root element:', document.getElementById('root'));

// Error boundary global
window.addEventListener('error', (event) => {
  console.error('❌ DEBUG: Error global capturado:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ DEBUG: Promise rechazada no manejada:', event.reason);
});

// Función para mostrar error en pantalla
const showError = (error) => {
  console.error('❌ DEBUG: Error en el render principal:', error);
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f6; font-family: system-ui, -apple-system, sans-serif;">
        <div style="max-width: 600px; background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #dc2626; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Error de Inicialización</h1>
          <p style="color: #4b5563; margin-bottom: 1rem;">La aplicación no pudo inicializarse correctamente.</p>
          <details style="background: #f9fafb; padding: 1rem; border-radius: 0.25rem; font-size: 0.875rem;">
            <summary style="cursor: pointer; font-weight: 600; color: #374151;">Ver detalles técnicos</summary>
            <pre style="margin-top: 0.5rem; overflow-x: auto; color: #1f2937;">${error.stack || error.message}</pre>
          </details>
          <button onclick="window.location.reload()" style="margin-top: 1rem; background: #2563eb; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer; font-weight: 500;">
            Recargar Página
          </button>
        </div>
      </div>
    `;
  }
};

// Inicializar aplicación de forma asíncrona
(async () => {
  try {
    // Importar la configuración de i18n
    console.log('🔍 DEBUG: Importando i18n...');
    await import('./lib/i18n.js');
    console.log('✅ DEBUG: i18n importado correctamente');
    
    // Crear root y renderizar
    console.log('🔍 DEBUG: Creando root de React...');
    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log('✅ DEBUG: Root creado correctamente');
    
    console.log('🔍 DEBUG: Renderizando App...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('✅ DEBUG: App renderizada correctamente');
    
  } catch (error) {
    showError(error);
  }
})();