import React from 'react';
import Maintenance from '../pages/Maintenance';

const MaintenanceWrapper = ({ children }) => {
  // Verificar si el modo mantenimiento está activado
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';
  
  // También puedes verificar por fecha/hora específica
  const maintenanceStart = process.env.REACT_APP_MAINTENANCE_START;
  const maintenanceEnd = process.env.REACT_APP_MAINTENANCE_END;
  
  let isScheduledMaintenance = false;
  
  if (maintenanceStart && maintenanceEnd) {
    const now = new Date();
    const start = new Date(maintenanceStart);
    const end = new Date(maintenanceEnd);
    isScheduledMaintenance = now >= start && now <= end;
  }

  // Mostrar página de mantenimiento si está activada
  if (isMaintenanceMode || isScheduledMaintenance) {
    return <Maintenance />;
  }

  // Mostrar la aplicación normal
  return children;
};

export default MaintenanceWrapper;