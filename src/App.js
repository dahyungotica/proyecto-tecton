import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './modules/Login/Login';
import Admin from './modules/Admin/Admin';
import Supervisar from './modules/Supervisar/Supervisar';
import Tareas from './modules/Tareas/Tareas';
import Estadisticas from './modules/Estadisticas/Estadisticas';

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Si añades un estado 'loading' es mejor
  
  if (loading) return <div>Cargando...</div>;
  return user ? children : <Navigate replace to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/supervisar" 
            element={
              <PrivateRoute>
                <Supervisar />
              </PrivateRoute>
            } 
          />
          <Route 
          path="/tareas" element={
            <PrivateRoute>
              <Tareas />
            </PrivateRoute>
          } />
          <Route 
          path="/estadisticas" element={
            <PrivateRoute>
              <Estadisticas />
            </PrivateRoute>
          } />
          {/* Redirigir por defecto al login si no está logueado */}
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; // ESTA LÍNEA ES VITAL