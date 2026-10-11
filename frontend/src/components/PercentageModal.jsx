import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaSave, FaPercent } from 'react-icons/fa';
import userService from '../services/userService';
import './PercentageModal.css';

const PercentageModal = ({ user, onClose }) => {
  const [percentage, setPercentage] = useState(user?.percentage || 50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (percentage < 0 || percentage > 100) {
      setError('El porcentaje debe estar entre 0 y 100');
      setLoading(false);
      return;
    }

    try {
      await userService.updatePercentage(user.id, parseFloat(percentage));
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar porcentaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <motion.div 
        className="modal-content percentage-modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2><FaPercent /> Editar Porcentaje</h2>
          <button className="btn-close-modal" onClick={() => onClose(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="percentage-info">
          <div className="barber-name">{user?.fullName}</div>
          <p>Ajusta el porcentaje de ganancia para este barbero</p>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="percentage-input-group">
            <label>Porcentaje de Ganancia</label>
            <div className="percentage-input-wrapper">
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                required
                className="percentage-input"
              />
              <span className="percentage-symbol">%</span>
            </div>
            <div className="percentage-range">
              <input
                type="range"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="range-slider"
              />
            </div>
            <div className="percentage-examples">
              <button 
                type="button" 
                onClick={() => setPercentage(30)}
                className="percentage-preset"
              >
                30%
              </button>
              <button 
                type="button" 
                onClick={() => setPercentage(40)}
                className="percentage-preset"
              >
                40%
              </button>
              <button 
                type="button" 
                onClick={() => setPercentage(50)}
                className="percentage-preset"
              >
                50%
              </button>
              <button 
                type="button" 
                onClick={() => setPercentage(60)}
                className="percentage-preset"
              >
                60%
              </button>
            </div>
          </div>

          <div className="calculation-preview">
            <h4>Vista Previa del Cálculo</h4>
            <div className="preview-example">
              <div className="preview-row">
                <span>Si el total generado es:</span>
                <strong>Q 1000.00</strong>
              </div>
              <div className="preview-row highlight">
                <span>Pago al barbero ({percentage}%):</span>
                <strong>Q {(1000 * percentage / 100).toFixed(2)}</strong>
              </div>
              <div className="preview-row">
                <span>Para la barbería ({100 - percentage}%):</span>
                <strong>Q {(1000 * (100 - percentage) / 100).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? (
                'Guardando...'
              ) : (
                <>
                  <FaSave /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PercentageModal;
