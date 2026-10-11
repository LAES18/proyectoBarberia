import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Haircut = sequelize.define('Haircut', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  barberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Precio en Quetzales'
  },
  tip: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Propina para el barbero'
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Descuento por consumos'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  cutNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número de corte del día'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
    comment: 'Descripción del servicio (ej: sombreado, barba, etc.)'
  }
}, {
  tableName: 'haircuts',
  indexes: [
    {
      fields: ['barberId', 'date']
    }
  ]
});

// Relaciones
User.hasMany(Haircut, { foreignKey: 'barberId', as: 'haircuts' });
Haircut.belongsTo(User, { foreignKey: 'barberId', as: 'barber' });

export default Haircut;
