import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaCalendarAlt, 
  FaCut, 
  FaMoneyBillWave,
  FaDownload 
} from 'react-icons/fa';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import haircutService from '../services/haircutService';
import userService from '../services/userService';
import './ReportsSection.css';

const ReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    barberId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBarbers();
    loadReports();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await userService.getBarbers();
      setBarbers(data);
    } catch (err) {
      console.error('Error al cargar barberos:', err);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await haircutService.getReports(
        filters.startDate,
        filters.endDate,
        filters.barberId || null
      );
      setReports(data.report);
      setSummary(data.summary);
    } catch (err) {
      setError('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickFilter = (type) => {
    const today = new Date();
    let startDate, endDate;

    switch (type) {
      case 'today':
        startDate = endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'yesterday':
        startDate = endDate = format(subDays(today, 1), 'yyyy-MM-dd');
        break;
      case 'week':
        startDate = format(startOfWeek(today, { locale: es }), 'yyyy-MM-dd');
        endDate = format(endOfWeek(today, { locale: es }), 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      default:
        return;
    }

    setFilters({ ...filters, startDate, endDate });
  };

  const exportToCSV = () => {
    if (reports.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    let csv = 'Fecha,Barbero,Cortes,Ingresos,Porcentaje,Ganancias\n';
    
    reports.forEach(day => {
      day.barbers.forEach(barber => {
        csv += `${day.date},${barber.barberName},${barber.cuts},${barber.revenue.toFixed(2)},${barber.percentage}%,${barber.earnings.toFixed(2)}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${filters.startDate}_${filters.endDate}.csv`;
    a.click();
  };

  return (
    <div className="reports-section">
      {/* Filters */}
      <motion.div 
        className="filters-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2><FaChartBar /> Reportes y Estadísticas</h2>
        
        <div className="quick-filters">
          <button onClick={() => handleQuickFilter('today')} className="quick-filter-btn">
            Hoy
          </button>
          <button onClick={() => handleQuickFilter('yesterday')} className="quick-filter-btn">
            Ayer
          </button>
          <button onClick={() => handleQuickFilter('week')} className="quick-filter-btn">
            Esta Semana
          </button>
          <button onClick={() => handleQuickFilter('month')} className="quick-filter-btn">
            Este Mes
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label><FaCalendarAlt /> Fecha Inicio</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label><FaCalendarAlt /> Fecha Fin</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Barbero</label>
            <select
              name="barberId"
              value={filters.barberId}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">Todos los barberos</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>
                  {barber.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={loadReports} className="btn-generate" disabled={loading}>
            {loading ? 'Cargando...' : 'Generar Reporte'}
          </button>
          <button onClick={exportToCSV} className="btn-export" disabled={reports.length === 0}>
            <FaDownload /> Exportar CSV
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Summary Cards */}
      {summary && (
        <motion.div 
          className="summary-cards"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="summary-card-item">
            <div className="summary-icon scissors">
              <FaCut />
            </div>
            <div className="summary-info">
              <h3>{summary.totalCuts}</h3>
              <p>Total de Cortes</p>
            </div>
          </div>

          <div className="summary-card-item">
            <div className="summary-icon money">
              <FaMoneyBillWave />
            </div>
            <div className="summary-info">
              <h3>Q {summary.totalRevenue.toFixed(2)}</h3>
              <p>Ingresos Totales</p>
            </div>
          </div>

          <div className="summary-card-item">
            <div className="summary-icon calendar">
              <FaCalendarAlt />
            </div>
            <div className="summary-info">
              <h3>{reports.length}</h3>
              <p>Días Activos</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reports Table */}
      <motion.div 
        className="reports-table-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {reports.length === 0 ? (
          <div className="empty-state">
            <FaChartBar size={60} />
            <p>No hay datos para mostrar</p>
            <small>Ajusta los filtros y genera un reporte</small>
          </div>
        ) : (
          <div className="reports-list">
            {reports.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                className="report-day"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIndex * 0.05 }}
              >
                <div className="day-header">
                  <h3>
                    <FaCalendarAlt /> {format(new Date(day.date), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                  </h3>
                  <div className="day-summary">
                    <span>{day.totalCuts} cortes</span>
                    <span className="separator">•</span>
                    <span>Q {day.totalRevenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="barbers-report-grid">
                  {day.barbers.map((barber, barberIndex) => (
                    <motion.div
                      key={`${day.date}-${barber.barberId}`}
                      className="barber-report-card"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (dayIndex * 0.05) + (barberIndex * 0.02) }}
                    >
                      <div className="barber-report-header">
                        <h4>{barber.barberName}</h4>
                        <span className="percentage-badge">{barber.percentage}%</span>
                      </div>

                      <div className="barber-report-stats">
                        <div className="stat-item">
                          <FaCut />
                          <div>
                            <small>Cortes</small>
                            <strong>{barber.cuts}</strong>
                          </div>
                        </div>

                        <div className="stat-item">
                          <FaMoneyBillWave />
                          <div>
                            <small>Ingresos</small>
                            <strong>Q {barber.revenue.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="earnings-display">
                        <span>Ganancia del Barbero</span>
                        <strong>Q {barber.earnings.toFixed(2)}</strong>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReportsSection;
