import { useEffect } from 'react';
import { maintenanceConfig } from '../config/maintenance';

const MaintenanceChecker = ({ children }) => {
  useEffect(() => {
    // Solo verificar en el cliente (no en SSR)
    if (typeof window !== 'undefined' && maintenanceConfig.enabled) {
      // Redirigir a la página de mantenimiento
      window.location.href = maintenanceConfig.redirectPath;
    }
  }, []);

  // Si está en modo mantenimiento, mostrar loading mientras redirige
  if (maintenanceConfig.enabled) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si no está en mantenimiento, mostrar la app normal
  return children;
};

export default MaintenanceChecker;