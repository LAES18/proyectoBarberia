import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMoneyCheckAlt, 
  FaSignOutAlt, 
  FaCut,
  FaUser,
  FaChartLine,
  FaMoneyBillWave,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import haircutService from '../services/haircutService';
import './CashierDashboard.css';

const CashierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [barbersData, setBarbersData] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCut, setEditingCut] = useState(null);
  const [adjustments, setAdjustments] = useState({ tip: '', discount: '' });
  const [addingCutFor, setAddingCutFor] = useState(null); // barberId
  const [newCut, setNewCut] = useState({ price: '', description: '' });
  const [addingCutLoading, setAddingCutLoading] = useState(false);

  useEffect(() => {
    loadBarbersData();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadBarbersData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadBarbersData = async () => {
    try {
      const data = await haircutService.getTodayAllBarbers();
      setBarbersData(data);
      // Mantener el panel del barbero seleccionado actualizado
      setSelectedBarber(prev => 
        prev ? (data.find(b => b.barberId === prev.barberId) || null) : null
      );
      setLoading(false);
    } catch (err) {
      setError('Error al cargar datos');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBarberClick = (barber) => {
    setSelectedBarber(selectedBarber?.barberId === barber.barberId ? null : barber);
  };

  const handleEditCut = (haircut) => {
    setEditingCut(haircut.id);
    setAdjustments({
      tip: haircut.tip || '',
      discount: haircut.discount || ''
    });
  };

  const handleSaveAdjustments = async (haircutId) => {
    try {
      const tip = parseFloat(adjustments.tip) || 0;
      const discount = parseFloat(adjustments.discount) || 0;

      await haircutService.updateAdjustments(haircutId, { tip, discount });
      
      setEditingCut(null);
      setAdjustments({ tip: '', discount: '' });
      await loadBarbersData();
    } catch (err) {
      setError('Error al actualizar ajustes');
    }
  };

  const handleCancelEdit = () => {
    setEditingCut(null);
    setAdjustments({ tip: '', discount: '' });
  };

  const handleToggleAddCut = (barberId) => {
    if (addingCutFor === barberId) {
      setAddingCutFor(null);
      setNewCut({ price: '', description: '' });
    } else {
      setAddingCutFor(barberId);
      setNewCut({ price: '', description: '' });
      // Expandir el panel del barbero al agregar corte
      const barber = barbersData.find(b => b.barberId === barberId);
      if (barber) setSelectedBarber(barber);
    }
  };

  const handleAddCutForBarber = async (barberId) => {
    const price = parseFloat(newCut.price);
    if (!price || price <= 0) {
      setError('Ingresa un precio válido');
      return;
    }
    setAddingCutLoading(true);
    setError('');
    try {
      await haircutService.createHaircutForBarber(barberId, price, newCut.description.trim());
      setAddingCutFor(null);
      setNewCut({ price: '', description: '' });
      await loadBarbersData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar corte');
    } finally {
      setAddingCutLoading(false);
    }
  };

  const handleDeleteCashierCut = async (haircutId) => {
    if (!window.confirm('¿Eliminar este corte?')) return;
    try {
      await haircutService.deleteHaircut(haircutId);
      await loadBarbersData();
    } catch (err) {
      setError('Error al eliminar corte');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cashier-dashboard">
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="header-content">
          <div className="header-left">
            <FaMoneyCheckAlt className="header-icon" />
            <div>
              <h1>Panel de Cobrador</h1>
              <p>Bienvenido, {user?.fullName}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </motion.header>

      <div className="dashboard-content">
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Summary Card */}
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2><FaChartLine /> Resumen del Día</h2>
          <div className="summary-stats">
            <div className="summary-stat">
              <div className="stat-label">Total Cortes</div>
              <div className="stat-value">
                {barbersData.reduce((sum, b) => sum + b.count, 0)}
              </div>
            </div>
            <div className="summary-stat">
              <div className="stat-label">Total Generado</div>
              <div className="stat-value">
                Q {barbersData.reduce((sum, b) => sum + b.total, 0).toFixed(2)}
              </div>
            </div>
            <div className="summary-stat">
              <div className="stat-label">Barberos Activos</div>
              <div className="stat-value">{barbersData.length}</div>
            </div>
          </div>
        </motion.div>

        {/* Barbers Grid */}
        <div className="barbers-section">
          <h2><FaUser /> Barberos del Día</h2>
          
          {barbersData.length === 0 ? (
            <div className="empty-state">
              <FaCut size={60} />
              <p>No hay cortes registrados hoy</p>
              <small>Los barberos aún no han registrado cortes</small>
            </div>
          ) : (
            <div className="barbers-grid">
              {barbersData.map((barber, index) => (
                <motion.div
                  key={barber.barberId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className={`barber-card ${selectedBarber?.barberId === barber.barberId ? 'active' : ''}`}
                    onClick={() => handleBarberClick(barber)}
                  >
                    <div className="barber-header">
                      <div className="barber-icon">
                        <FaUser />
                      </div>
                      <h3>{barber.barberName}</h3>
                    </div>
                    
                    <div className="barber-stats">
                      <div className="barber-stat">
                        <FaCut />
                        <div>
                          <small>Cortes</small>
                          <strong>{barber.count}</strong>
                        </div>
                      </div>
                      
                      <div className="barber-stat">
                        <FaMoneyBillWave />
                        <div>
                          <small>Total</small>
                          <strong>Q {barber.total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="earnings-section">
                      <div className="earnings-breakdown">
                        <div className="earnings-row">
                          <small>Base ({barber.percentage}%)</small>
                          <span>Q {(barber.baseEarnings || barber.earnings).toFixed(2)}</span>
                        </div>
                        {barber.totalTips > 0 && (
                          <div className="earnings-row positive">
                            <small>+ Propinas</small>
                            <span>Q {barber.totalTips.toFixed(2)}</span>
                          </div>
                        )}
                        {barber.totalDiscounts > 0 && (
                          <div className="earnings-row negative">
                            <small>- Descuentos</small>
                            <span>Q {barber.totalDiscounts.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <div className="earnings-label">
                        Pago Total al Barbero
                      </div>
                      <div className="earnings-amount">
                        Q {barber.earnings.toFixed(2)}
                      </div>
                    </div>

                    <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); handleBarberClick(barber); }}>
                      {selectedBarber?.barberId === barber.barberId ? 'Ocultar Detalles' : 'Ver Detalles'}
                    </button>
                    <button
                      className="btn-add-cut-cashier"
                      onClick={(e) => { e.stopPropagation(); handleToggleAddCut(barber.barberId); }}
                    >
                      <FaPlus /> Agregar Corte
                    </button>
                  </div>

                  {/* Detalles expandibles */}
                  <AnimatePresence>
                    {selectedBarber?.barberId === barber.barberId && (
                      <motion.div
                        className="barber-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4>Cortes Detallados</h4>

                        {/* Formulario agregar corte */}
                        {addingCutFor === barber.barberId && (
                          <div className="add-cut-cashier-form">
                            <h5><FaPlus /> Registrar Corte para {barber.barberName}</h5>
                            <div className="add-cut-cashier-fields">
                              <div className="cashier-input-group">
                                <label>Precio (Q)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={newCut.price}
                                  onChange={(e) => setNewCut({ ...newCut, price: e.target.value })}
                                  placeholder="Ej: 50.00"
                                  disabled={addingCutLoading}
                                />
                              </div>
                              <div className="cashier-input-group">
                                <label>Descripción</label>
                                <input
                                  type="text"
                                  value={newCut.description}
                                  onChange={(e) => setNewCut({ ...newCut, description: e.target.value })}
                                  placeholder="Ej: Sombreado, Barba..."
                                  disabled={addingCutLoading}
                                  maxLength={100}
                                />
                              </div>
                            </div>
                            <div className="add-cut-cashier-actions">
                              <button
                                className="btn-save"
                                onClick={() => handleAddCutForBarber(barber.barberId)}
                                disabled={addingCutLoading}
                              >
                                {addingCutLoading ? 'Guardando...' : 'Guardar Corte'}
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={() => handleToggleAddCut(barber.barberId)}
                                disabled={addingCutLoading}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="haircuts-detail-list">
                          {selectedBarber.haircuts.map((haircut) => (
                            <motion.div
                              key={haircut.id}
                              className="haircut-detail-item"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                            >
                              <div className="haircut-basic-info">
                                <span className="cut-number">Corte #{haircut.cutNumber}</span>
                                <span className="cut-price">Q {parseFloat(haircut.price).toFixed(2)}</span>
                                {haircut.description && (
                                  <span className="cut-description">{haircut.description}</span>
                                )}
                                <span className="cut-time">
                                  {new Date(haircut.createdAt).toLocaleTimeString('es-GT', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <button
                                  className="btn-delete-cut-small"
                                  onClick={() => handleDeleteCashierCut(haircut.id)}
                                  title="Eliminar corte"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                              
                              {editingCut === haircut.id ? (
                                <div className="haircut-adjustments-form">
                                  <div className="adjustment-input">
                                    <label>Propina (Q)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={adjustments.tip}
                                      onChange={(e) => setAdjustments({ ...adjustments, tip: e.target.value })}
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div className="adjustment-input">
                                    <label>Descuento (Q)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={adjustments.discount}
                                      onChange={(e) => setAdjustments({ ...adjustments, discount: e.target.value })}
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div className="adjustment-actions">
                                    <button 
                                      className="btn-save"
                                      onClick={() => handleSaveAdjustments(haircut.id)}
                                    >
                                      Guardar
                                    </button>
                                    <button 
                                      className="btn-cancel"
                                      onClick={handleCancelEdit}
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="haircut-adjustments-display">
                                  <div className="adjustment-display">
                                    <span className="adjustment-label">Propina:</span>
                                    <span className="adjustment-value positive">
                                      +Q {parseFloat(haircut.tip || 0).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="adjustment-display">
                                    <span className="adjustment-label">Descuento:</span>
                                    <span className="adjustment-value negative">
                                      -Q {parseFloat(haircut.discount || 0).toFixed(2)}
                                    </span>
                                  </div>
                                  <button 
                                    className="btn-edit-small"
                                    onClick={() => handleEditCut(haircut)}
                                  >
                                    Editar
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="details-summary">
                          <div className="summary-row">
                            <span>Total en Cortes:</span>
                            <strong>Q {selectedBarber.total.toFixed(2)}</strong>
                          </div>
                          <div className="summary-row">
                            <span>Base ({selectedBarber.percentage}%):</span>
                            <strong>Q {(selectedBarber.baseEarnings || selectedBarber.earnings).toFixed(2)}</strong>
                          </div>
                          {selectedBarber.totalTips > 0 && (
                            <div className="summary-row positive">
                              <span>+ Propinas Totales:</span>
                              <strong>Q {selectedBarber.totalTips.toFixed(2)}</strong>
                            </div>
                          )}
                          {selectedBarber.totalDiscounts > 0 && (
                            <div className="summary-row negative">
                              <span>- Descuentos Totales:</span>
                              <strong>Q {selectedBarber.totalDiscounts.toFixed(2)}</strong>
                            </div>
                          )}
                          <div className="summary-row highlight">
                            <span>Pago Total al Barbero:</span>
                            <strong>Q {selectedBarber.earnings.toFixed(2)}</strong>
                          </div>
                          <div className="summary-row">
                            <span>Para la Barbería ({100 - selectedBarber.percentage}%):</span>
                            <strong>Q {(selectedBarber.total - selectedBarber.earnings).toFixed(2)}</strong>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
