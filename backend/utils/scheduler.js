import cron from 'node-cron';

/**
 * Nota: Los cortes NO se eliminan para mantener el historial de reportes
 * El filtrado por fecha se hace en las consultas de cada endpoint
 */

/**
 * Inicializa las tareas programadas
 */
export const initScheduler = () => {
  console.log('✅ Sistema de gestión diaria inicializado');
  console.log('   - Los cortes del día actual se muestran en dashboards');
  console.log('   - El historial completo se mantiene para reportes');
  
  // Aquí se pueden agregar otras tareas programadas en el futuro
  // Por ejemplo: envío de reportes por email, respaldar BD, etc.
};

export default initScheduler;
