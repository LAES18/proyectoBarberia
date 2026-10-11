import sequelize from '../config/database.js';
import User from './User.js';
import Haircut from './Haircut.js';

const models = {
  User,
  Haircut
};

// Sincronizar base de datos y crear tablas automáticamente
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos — solo crea tablas que no existen, nunca modifica las existentes
    await sequelize.sync();
    console.log('✅ Tablas sincronizadas correctamente.');
    
    // Crear el primer administrador con credenciales suministradas fuera del repositorio
    const adminExists = await User.findOne({ where: { role: 'administrador' } });
    if (!adminExists) {
      const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_FULL_NAME, ADMIN_PASSWORD } = process.env;
      if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_FULL_NAME || !ADMIN_PASSWORD) {
        throw new Error('Configura ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_FULL_NAME y ADMIN_PASSWORD para crear el administrador inicial.');
      }

      await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        fullName: ADMIN_FULL_NAME,
        role: 'administrador',
        percentage: 0
      });
      console.log('✅ Usuario administrador inicial creado.');
    }
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    throw error;
  }
};

export { sequelize, User, Haircut };
export default models;
