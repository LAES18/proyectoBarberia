import api from './api';

const userService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obtener barberos
  getBarbers: async () => {
    const response = await api.get('/users/barbers');
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Crear usuario
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Actualizar porcentaje
  updatePercentage: async (id, percentage) => {
    const response = await api.patch(`/users/${id}/percentage`, { percentage });
    return response.data;
  }
};

export default userService;
