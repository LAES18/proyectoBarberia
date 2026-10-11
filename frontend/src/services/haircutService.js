import api from './api';

const haircutService = {
  // Crear corte
  createHaircut: async (price, description = '') => {
    const response = await api.post('/haircuts', { price, description });
    return response.data;
  },

  // Obtener cortes del día actual
  getTodayHaircuts: async () => {
    const response = await api.get('/haircuts/today');
    return response.data;
  },

  // Obtener cortes de todos los barberos del día
  getTodayAllBarbers: async () => {
    const response = await api.get('/haircuts/today/all');
    return response.data;
  },

  // Obtener reportes
  getReports: async (startDate, endDate, barberId) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (barberId) params.barberId = barberId;
    
    const response = await api.get('/haircuts/reports', { params });
    return response.data;
  },

  // Actualizar propina y descuento
  updateAdjustments: async (id, adjustments) => {
    const response = await api.patch(`/haircuts/${id}/adjustments`, adjustments);
    return response.data;
  },

  // Crear corte (el cobrador lo hace para un barbero)
  createHaircutForBarber: async (barberId, price, description = '') => {
    const response = await api.post('/haircuts/for-barber', { barberId, price, description });
    return response.data;
  },

  // Eliminar corte
  deleteHaircut: async (id) => {
    const response = await api.delete(`/haircuts/${id}`);
    return response.data;
  }
};

export default haircutService;
