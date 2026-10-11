import { Haircut, User } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Obtener la fecha actual en zona horaria de Guatemala (UTC-6)
const getGuatemalaDate = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' });
};

// @desc    Crear nuevo corte
// @route   POST /api/haircuts
// @access  Private (Barbero)
export const createHaircut = async (req, res) => {
  try {
    const { price, description } = req.body;
    const barberId = req.user.id;
    const today = getGuatemalaDate();

    // Obtener el número de cortes del día
    const todayCount = await Haircut.count({
      where: {
        barberId,
        date: today
      }
    });

    // Crear el corte
    const haircut = await Haircut.create({
      barberId,
      price,
      description: description || '',
      date: today,
      cutNumber: todayCount + 1
    });

    // Obtener información del barbero
    const haircutWithBarber = await Haircut.findByPk(haircut.id, {
      include: [{
        model: User,
        as: 'barber',
        attributes: ['id', 'fullName', 'percentage']
      }]
    });

    res.status(201).json(haircutWithBarber);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear corte', error: error.message });
  }
};

// @desc    Obtener cortes del día actual del barbero
// @route   GET /api/haircuts/today
// @access  Private (Barbero)
export const getTodayHaircuts = async (req, res) => {
  try {
    const barberId = req.user.id;
    const today = getGuatemalaDate();

    const haircuts = await Haircut.findAll({
      where: {
        barberId,
        date: today
      },
      order: [['cutNumber', 'ASC']]
    });

    const total = haircuts.reduce((sum, cut) => sum + parseFloat(cut.price), 0);
    const totalTips = haircuts.reduce((sum, cut) => sum + parseFloat(cut.tip || 0), 0);
    const totalDiscounts = haircuts.reduce((sum, cut) => sum + parseFloat(cut.discount || 0), 0);
    const count = haircuts.length;
    const baseEarnings = (total * req.user.percentage) / 100;
    const finalEarnings = baseEarnings + totalTips - totalDiscounts;

    res.json({
      haircuts,
      count,
      total,
      totalTips,
      totalDiscounts,
      barberPercentage: req.user.percentage,
      baseEarnings,
      barberEarnings: finalEarnings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cortes', error: error.message });
  }
};

// @desc    Crear corte para un barbero específico (lo hace el cobrador)
// @route   POST /api/haircuts/for-barber
// @access  Private (Cobrador, Administrador)
export const createHaircutForBarber = async (req, res) => {
  try {
    const { barberId, price, description } = req.body;

    if (!barberId || !price || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Barbero y precio son requeridos' });
    }

    // Verificar que el barbero existe y está activo
    const barber = await User.findOne({
      where: { id: barberId, role: 'barbero', isActive: true }
    });
    if (!barber) {
      return res.status(404).json({ message: 'Barbero no encontrado' });
    }

    const today = getGuatemalaDate();

    const todayCount = await Haircut.count({
      where: { barberId, date: today }
    });

    const haircut = await Haircut.create({
      barberId,
      price: parseFloat(price),
      description: description || '',
      date: today,
      cutNumber: todayCount + 1
    });

    const haircutWithBarber = await Haircut.findByPk(haircut.id, {
      include: [{ model: User, as: 'barber', attributes: ['id', 'fullName', 'percentage'] }]
    });

    res.status(201).json(haircutWithBarber);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear corte', error: error.message });
  }
};

// @desc    Obtener cortes del día de todos los barberos
// @route   GET /api/haircuts/today/all
// @access  Private (Cobrador, Administrador)
export const getTodayAllBarbers = async (req, res) => {
  try {
    const today = getGuatemalaDate();

    // Obtener TODOS los barberos activos
    const allBarbers = await User.findAll({
      where: { role: 'barbero', isActive: true },
      attributes: ['id', 'fullName', 'percentage'],
      order: [['fullName', 'ASC']]
    });

    // Obtener cortes del día
    const haircuts = await Haircut.findAll({
      where: { date: today },
      include: [{
        model: User,
        as: 'barber',
        attributes: ['id', 'fullName', 'percentage'],
        where: { role: 'barbero' }
      }],
      order: [['barberId', 'ASC'], ['cutNumber', 'ASC']]
    });

    // Inicializar todos los barberos (incluso con 0 cortes)
    const barberData = {};
    allBarbers.forEach(b => {
      barberData[b.id] = {
        barberId: b.id,
        barberName: b.fullName,
        percentage: b.percentage,
        haircuts: [],
        count: 0,
        total: 0,
        totalTips: 0,
        totalDiscounts: 0,
        baseEarnings: 0,
        earnings: 0
      };
    });

    // Agregar los cortes del día
    haircuts.forEach(cut => {
      const bid = cut.barberId;
      if (barberData[bid]) {
        barberData[bid].haircuts.push(cut);
        barberData[bid].count++;
        barberData[bid].total += parseFloat(cut.price);
        barberData[bid].totalTips += parseFloat(cut.tip || 0);
        barberData[bid].totalDiscounts += parseFloat(cut.discount || 0);
      }
    });

    // Calcular ganancias
    Object.values(barberData).forEach(data => {
      data.baseEarnings = (data.total * data.percentage) / 100;
      data.earnings = data.baseEarnings + data.totalTips - data.totalDiscounts;
    });

    res.json(Object.values(barberData));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cortes', error: error.message });
  }
};

// @desc    Obtener reportes por fecha
// @route   GET /api/haircuts/reports
// @access  Private (Administrador)
export const getReports = async (req, res) => {
  try {
    const { startDate, endDate, barberId } = req.query;

    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: startDate
      };
    }

    if (barberId) {
      whereClause.barberId = barberId;
    }

    const haircuts = await Haircut.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'barber',
        attributes: ['id', 'fullName', 'percentage'],
        where: { role: 'barbero' }
      }],
      order: [['date', 'DESC'], ['cutNumber', 'ASC']]
    });

    // Agrupar por fecha y barbero
    const reportData = {};
    
    haircuts.forEach(cut => {
      const date = cut.date;
      const barberId = cut.barberId;
      
      if (!reportData[date]) {
        reportData[date] = {
          date,
          barbers: {},
          totalCuts: 0,
          totalRevenue: 0
        };
      }
      
      if (!reportData[date].barbers[barberId]) {
        reportData[date].barbers[barberId] = {
          barberId: cut.barber.id,
          barberName: cut.barber.fullName,
          percentage: cut.barber.percentage,
          cuts: 0,
          revenue: 0,
          totalTips: 0,
          totalDiscounts: 0,
          baseEarnings: 0,
          earnings: 0
        };
      }
      
      reportData[date].barbers[barberId].cuts++;
      reportData[date].barbers[barberId].revenue += parseFloat(cut.price);
      reportData[date].barbers[barberId].totalTips += parseFloat(cut.tip || 0);
      reportData[date].barbers[barberId].totalDiscounts += parseFloat(cut.discount || 0);
      reportData[date].totalCuts++;
      reportData[date].totalRevenue += parseFloat(cut.price);
    });

    // Calcular ganancias
    Object.values(reportData).forEach(dayData => {
      Object.values(dayData.barbers).forEach(barberData => {
        barberData.baseEarnings = (barberData.revenue * barberData.percentage) / 100;
        barberData.earnings = barberData.baseEarnings + barberData.totalTips - barberData.totalDiscounts;
      });
      dayData.barbers = Object.values(dayData.barbers);
    });

    const report = Object.values(reportData);

    // Calcular totales generales
    const totalCuts = report.reduce((sum, day) => sum + day.totalCuts, 0);
    const totalRevenue = report.reduce((sum, day) => sum + day.totalRevenue, 0);

    res.json({
      report,
      summary: {
        totalCuts,
        totalRevenue,
        startDate: startDate || 'Inicio',
        endDate: endDate || 'Hoy'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte', error: error.message });
  }
};

// @desc    Actualizar propina y descuento de un corte
// @route   PATCH /api/haircuts/:id/adjustments
// @access  Private (Cobrador, Administrador)
export const updateHaircutAdjustments = async (req, res) => {
  try {
    const { tip, discount } = req.body;
    const haircut = await Haircut.findByPk(req.params.id);

    if (!haircut) {
      return res.status(404).json({ message: 'Corte no encontrado' });
    }

    // Validar que sean números válidos
    if (tip !== undefined && (isNaN(tip) || tip < 0)) {
      return res.status(400).json({ message: 'Propina inválida' });
    }
    if (discount !== undefined && (isNaN(discount) || discount < 0)) {
      return res.status(400).json({ message: 'Descuento inválido' });
    }

    // Actualizar solo los campos proporcionados
    if (tip !== undefined) haircut.tip = parseFloat(tip);
    if (discount !== undefined) haircut.discount = parseFloat(discount);
    
    await haircut.save();

    // Obtener el corte actualizado con información del barbero
    const updatedHaircut = await Haircut.findByPk(haircut.id, {
      include: [{
        model: User,
        as: 'barber',
        attributes: ['id', 'fullName', 'percentage']
      }]
    });

    res.json(updatedHaircut);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ajustes', error: error.message });
  }
};

// @desc    Eliminar corte
// @route   DELETE /api/haircuts/:id
// @access  Private (Barbero - solo sus cortes, Administrador - todos)
export const deleteHaircut = async (req, res) => {
  try {
    const haircut = await Haircut.findByPk(req.params.id);

    if (!haircut) {
      return res.status(404).json({ message: 'Corte no encontrado' });
    }

    // Verificar permisos: barbero solo sus cortes, cobrador y admin todos
    if (req.user.role === 'barbero' && haircut.barberId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este corte' });
    }

    await haircut.destroy();
    res.json({ message: 'Corte eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar corte', error: error.message });
  }
};
