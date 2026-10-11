import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCut, 
  FaSignOutAlt, 
  FaPlus, 
  FaTrash,
  FaUser
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import haircutService from '../services/haircutService';
import './BarberDashboard.css';

const BarberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [haircuts, setHaircuts] = useState([]);
  const [stats, setStats] = useState({
    count: 0,
    total: 0,
    barberEarnings: 0,
    barberPercentage: 50
  });
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTodayHaircuts();
  }, []);

  const loadTodayHaircuts = async () => {
    try {
      const data = await haircutService.getTodayHaircuts();
      setHaircuts(data.haircuts);
      setStats({
        count: data.count,
        total: data.total,
        barberEarnings: data.barberEarnings,
        barberPercentage: data.barberPercentage
      });
    } catch (err) {
      setError('Error al cargar cortes');
    }
  };

  const handleAddCut = async (e) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) {
      setError('Ingresa un precio válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await haircutService.createHaircut(parseFloat(price), description.trim());
      setPrice('');
      setDescription('');
      await loadTodayHaircuts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar corte');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCut = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este corte?')) return;

    try {
      await haircutService.deleteHaircut(id);
      await loadTodayHaircuts();
    } catch (err) {
      setError('Error al eliminar corte');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="barber-dashboard">
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="header-content">
          <div className="header-left">
            <FaCut className="header-icon" />
            <div>
              <h1>Barbería Dashboard</h1>
              <p>Bienvenido, {user?.fullName}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </motion.header>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon scissors">
              <FaCut />
            </div>
            <div className="stat-info">
              <h3>{stats.count}</h3>
              <p>Cortes Hoy</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card earnings"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon user">
              <FaUser />
            </div>
            <div className="stat-info">
              <h3>Q {stats.barberEarnings.toFixed(2)}</h3>
              <p>Tus Ganancias</p>
              {(stats.totalTips > 0 || stats.totalDiscounts > 0) && (
                <div className="earnings-detail">
                  <small>Base: Q {(stats.baseEarnings || stats.barberEarnings).toFixed(2)}</small>
                  {stats.totalTips > 0 && (
                    <small className="tip-amount">+ Propinas: Q {stats.totalTips.toFixed(2)}</small>
                  )}
                  {stats.totalDiscounts > 0 && (
                    <small className="discount-amount">- Descuentos: Q {stats.totalDiscounts.toFixed(2)}</small>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Add Haircut Form */}
        <motion.div 
          className="add-cut-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2><FaPlus /> Registrar Nuevo Corte</h2>
          
          {error && (
            <motion.div 
              className="alert alert-danger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleAddCut} className="add-cut-form">
            <div className="form-group">
              <label>Precio del Corte (Q)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 50.00"
                className="form-control"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Descripción del Servicio</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Sombreado, Barba, Corte clásico..."
                className="form-control"
                disabled={loading}
                maxLength={100}
              />
            </div>
            <motion.button 
              type="submit" 
              className="btn-add-cut"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Registrando...' : '+ Agregar Corte'}
            </motion.button>
          </form>
        </motion.div>

        {/* Haircuts List */}
        <motion.div 
          className="haircuts-list-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2><FaCut /> Cortes del Día</h2>
          
          {haircuts.length === 0 ? (
            <div className="empty-state">
              <FaCut size={60} />
              <p>No hay cortes registrados hoy</p>
              <small>Agrega tu primer corte del día</small>
            </div>
          ) : (
            <div className="haircuts-list">
              <AnimatePresence>
                {haircuts.map((haircut, index) => (
                  <motion.div
                    key={haircut.id}
                    className="haircut-item"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="haircut-number">#{haircut.cutNumber}</div>
                    <div className="haircut-details">
                      <span className="haircut-price">Q {parseFloat(haircut.price).toFixed(2)}</span>
                      {haircut.description && (
                        <span className="haircut-description">{haircut.description}</span>
                      )}
                      <span className="haircut-time">
                        {new Date(haircut.createdAt).toLocaleTimeString('es-GT', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <motion.button
                      className="btn-delete"
                      onClick={() => handleDeleteCut(haircut.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BarberDashboard;
