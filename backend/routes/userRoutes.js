import express from 'express';
import {
  getUsers,
  getBarbers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePercentage
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas para obtener barberos (usado por cobrador)
router.get('/barbers', protect, getBarbers);

// Rutas solo para administrador
router.use(protect, authorize('administrador'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/percentage', updatePercentage);

export default router;
