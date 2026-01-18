// src/modules/Login/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/estadisticas');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert('Error de acceso: ' + error.message);
    }
  };

  if (user) return null;

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Lado Izquierdo: Visual/Empresarial */}
        <div className="login-visual">
          <div className="visual-content">
            <h2>Gestión Tecton</h2>
            <p>Panel de control administrativo y operativo de alto rendimiento.</p>
          </div>
          <div className="visual-overlay"></div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="login-form-section">
          <form className="login-modern-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1>Iniciar Sesión</h1>
              <p>Introduce tus credenciales corporativas</p>
            </div>

            <div className="input-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="nombre@empresa.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="login-button">
              Entrar al Sistema
            </button>

            <footer className="form-footer">
              <p>&copy; 2026 Tecton Proyectos. Todos los derechos reservados.</p>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;