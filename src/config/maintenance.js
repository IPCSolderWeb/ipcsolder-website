// Configuración del modo mantenimiento
export const isMaintenanceMode = () => {
  // En desarrollo, usar variable de entorno local
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  }
  
  // En producción, usar variable de entorno de Vercel
  return import.meta.env.VITE_MAINTENANCE_MODE === 'true';
};

export const maintenanceConfig = {
  enabled: isMaintenanceMode(),
  redirectPath: '/maintenance.html'
};