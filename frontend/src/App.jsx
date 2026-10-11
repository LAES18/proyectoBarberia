import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import BarberDashboard from './pages/BarberDashboard';
import CashierDashboard from './pages/CashierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/barbero" 
            element={
              <PrivateRoute roles={['barbero']}>
                <BarberDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/cobrador" 
            element={
              <PrivateRoute roles={['cobrador']}>
                <CashierDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/administrador" 
            element={
              <PrivateRoute roles={['administrador']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
