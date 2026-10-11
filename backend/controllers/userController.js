import { Op } from 'sequelize';
import { User } from '../models/index.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private (Administrador)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// @desc    Obtener barberos activos
// @route   GET /api/users/barbers
// @access  Private
export const getBarbers = async (req, res) => {
  try {
    const barbers = await User.findAll({
      where: { 
        role: 'barbero',
        isActive: true
      },
      attributes: { exclude: ['password'] },
      order: [['fullName', 'ASC']]
    });
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener barberos', error: error.message });
  }
};

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private (Administrador)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// @desc    Crear usuario
// @route   POST /api/users
// @access  Private (Administrador)
export const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, role, percentage } = req.body;

    const userExists = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario o email ya existe' });
    }

    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role,
      percentage: percentage || 50.0
    });

    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private (Administrador)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { username, email, password, fullName, role, percentage, isActive } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (fullName) user.fullName = fullName;
    if (role) user.role = role;
    if (percentage !== undefined) user.percentage = percentage;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private (Administrador)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir eliminar el último administrador
    if (user.role === 'administrador') {
      const adminCount = await User.count({ where: { role: 'administrador' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'No se puede eliminar el último administrador' });
      }
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

// @desc    Actualizar porcentaje de barbero
// @route   PATCH /api/users/:id/percentage
// @access  Private (Administrador)
export const updatePercentage = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.role !== 'barbero') {
      return res.status(400).json({ message: 'Solo se puede actualizar el porcentaje de barberos' });
    }

    const { percentage } = req.body;

    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: 'El porcentaje debe estar entre 0 y 100' });
    }

    user.percentage = percentage;
    await user.save();

    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar porcentaje', error: error.message });
  }
};
