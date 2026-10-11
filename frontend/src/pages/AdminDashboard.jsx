import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserShield, 
  FaSignOutAlt, 
  FaUsers,
  FaChartBar,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaPercent
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import haircutService from '../services/haircutService';
import UserModal from '../components/UserModal';
import PercentageModal from '../components/PercentageModal';
import ReportsSection from '../components/ReportsSection';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPercentageModal, setShowPercentageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar usuarios');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await userService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleEditPercentage = (user) => {
    setSelectedUser(user);
    setShowPercentageModal(true);
  };

  const handleUserModalClose = async (reload) => {
    setShowUserModal(false);
    setSelectedUser(null);
    if (reload) await loadUsers();
  };

  const handlePercentageModalClose = async (reload) => {
    setShowPercentageModal(false);
    setSelectedUser(null);
    if (reload) await loadUsers();
  };

  const getRoleBadge = (role) => {
    const badges = {
      administrador: { class: 'badge-admin', text: 'Administrador' },
      barbero: { class: 'badge-barber', text: 'Barbero' },
      cobrador: { class: 'badge-cashier', text: 'Cobrador' }
    };
    return badges[role] || badges.barbero;
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
    <div className="admin-dashboard">
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="header-content">
          <div className="header-left">
            <FaUserShield className="header-icon" />
            <div>
              <h1>Panel de Administración</h1>
              <p>Bienvenido, {user?.fullName}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </motion.header>

      <div className="dashboard-content">
        {/* Tabs */}
        <div className="tabs-container">
          <motion.button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUsers /> Usuarios
          </motion.button>
          <motion.button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChartBar /> Reportes
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="users-section">
                <div className="section-header">
                  <h2><FaUsers /> Gestión de Usuarios</h2>
                  <motion.button 
                    className="btn-add-user"
                    onClick={handleCreateUser}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUserPlus /> Nuevo Usuario
                  </motion.button>
                </div>

                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                <div className="users-grid">
                  {users.map((userItem, index) => (
                    <motion.div
                      key={userItem.id}
                      className="user-card"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="user-card-header">
                        <div className="user-avatar">
                          {userItem.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <h3>{userItem.fullName}</h3>
                          <p>{userItem.email}</p>
                          <span className={`role-badge ${getRoleBadge(userItem.role).class}`}>
                            {getRoleBadge(userItem.role).text}
                          </span>
                        </div>
                      </div>

                      {userItem.role === 'barbero' && (
                        <div className="user-percentage">
                          <FaPercent />
                          <span>Porcentaje: {userItem.percentage}%</span>
                        </div>
                      )}

                      <div className="user-actions">
                        <motion.button 
                          className="btn-action btn-edit"
                          onClick={() => handleEditUser(userItem)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Editar usuario"
                        >
                          <FaEdit />
                        </motion.button>
                        
                        {userItem.role === 'barbero' && (
                          <motion.button 
                            className="btn-action btn-percentage"
                            onClick={() => handleEditPercentage(userItem)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Editar porcentaje"
                          >
                            <FaPercent />
                          </motion.button>
                        )}
                        
                        <motion.button 
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteUser(userItem.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Eliminar usuario"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>

                      <div className={`user-status ${userItem.isActive ? 'active' : 'inactive'}`}>
                        {userItem.isActive ? 'Activo' : 'Inactivo'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReportsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserModal 
          user={selectedUser}
          onClose={handleUserModalClose}
        />
      )}

      {showPercentageModal && (
        <PercentageModal 
          user={selectedUser}
          onClose={handlePercentageModalClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
