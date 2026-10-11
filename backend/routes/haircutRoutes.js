import express from 'express';
import {
  createHaircut,
  createHaircutForBarber,
  getTodayHaircuts,
  getTodayAllBarbers,
  getReports,
  updateHaircutAdjustments,
  deleteHaircut
} from '../controllers/haircutController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rutas para barberos
router.post('/', protect, authorize('barbero'), createHaircut);
router.get('/today', protect, authorize('barbero'), getTodayHaircuts);

// Cobrador/Admin puede agregar cortes a nombre de un barbero
router.post('/for-barber', protect, authorize('cobrador', 'administrador'), createHaircutForBarber);

// Rutas para cobrador y administrador
router.get('/today/all', protect, authorize('cobrador', 'administrador'), getTodayAllBarbers);

// Rutas para administrador
router.get('/reports', protect, authorize('administrador'), getReports);

// Actualizar propina y descuento
router.patch('/:id/adjustments', protect, authorize('cobrador', 'administrador'), updateHaircutAdjustments);

// Eliminar corte (barbero sus propios, cobrador y admin cualquiera)
router.delete('/:id', protect, authorize('barbero', 'cobrador', 'administrador'), deleteHaircut);

export default router;
