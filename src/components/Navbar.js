// src/components/Navbar.js
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { profile, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Para saber qué link está activo

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user || !profile) return null;

  return (
    <nav className="glass-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-logo">T</div>
          <span className="brand-name">Tecton Pro</span>
        </div>

        <ul className="nav-menu">
          {profile.permiso_admin && (
            <li className={location.pathname === '/admin' ? 'active' : ''}>
              <Link to="/admin">Administración</Link>
            </li>
          )}
          {profile.permiso_supervisar && (
            <li className={location.pathname === '/supervisar' ? 'active' : ''}>
              <Link to="/supervisar">Supervisión</Link>
            </li>
          )}
          {profile.permiso_tareas && (
            <li className={location.pathname === '/tareas' ? 'active' : ''}>
              <Link to="/tareas">Mis Tareas</Link>
            </li>
          )}
          {profile.permiso_estadisticas && (
            <li className={location.pathname === '/stats' ? 'active' : ''}>
              <Link to="/estadisticas">Estadísticas</Link>
            </li>
          )}
        </ul>

        <div className="nav-user">
          <div className="user-badge">
            <span className="user-name">{profile.nombre}</span>
            <span className="user-role">{profile.es_admin_raiz ? 'Admin Raíz' : 'Personal'}</span>
          </div>
          <button className="logout-icon-btn" onClick={handleLogout} title="Cerrar Sesión">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;