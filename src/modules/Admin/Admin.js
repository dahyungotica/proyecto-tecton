// src/modules/Admin/Admin.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './Admin.css';

const Admin = () => {
  const [empresa, setEmpresa] = useState({ id: null, nombre: '', descripcion: '', servicios: '' });
  const [newUser, setNewUser] = useState({
    nombre: '', email: '', password: '',
    permiso_admin: false, permiso_supervisar: false,
    permiso_tareas: false, permiso_estadisticas: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase.from('empresa').select('*').single();
    if (data) setEmpresa(data);
    setLoading(false);
  }

  const handleUpdateEmpresa = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('empresa').update(empresa).eq('id', empresa.id);
    if (error) alert('Error: ' + error.message);
    else alert('Datos de la empresa actualizados con éxito');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { data, error: authError } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: { data: { nombre: newUser.nombre } }
    });

    if (authError) return alert('Error: ' + authError.message);

    const { error: profileError } = await supabase
      .from('perfiles')
      .update({
        permiso_admin: newUser.permiso_admin,
        permiso_supervisar: newUser.permiso_supervisar,
        permiso_tareas: newUser.permiso_tareas,
        permiso_estadisticas: newUser.permiso_estadisticas
      })
      .eq('id', data.user.id);

    if (profileError) alert('Error Perfil: ' + profileError.message);
    else {
      alert('Usuario creado correctamente');
      setNewUser({ nombre: '', email: '', password: '', permiso_admin: false, permiso_supervisar: false, permiso_tareas: false, permiso_estadisticas: false });
    }
  };

  if (loading) return <div className="admin-loader">Cargando configuración...</div>;

  return (
    <div className="admin-view">
      <header className="admin-header">
        <h1>Configuración del Sistema</h1>
        <p>Gestiona los activos de la empresa y los accesos del personal.</p>
      </header>

      <div className="admin-grid">
        {/* TARJETA EMPRESA */}
        <section className="admin-card">
          <div className="card-icon">🏢</div>
          <h2>Perfil de la Empresa</h2>
          <form onSubmit={handleUpdateEmpresa} className="modern-form">
            <div className="input-field">
              <label>Nombre Corporativo</label>
              <input 
                type="text" value={empresa.nombre} 
                onChange={(e) => setEmpresa({...empresa, nombre: e.target.value})} 
              />
            </div>
            <div className="input-field">
              <label>Descripción General</label>
              <textarea 
                rows="3" value={empresa.descripcion}
                onChange={(e) => setEmpresa({...empresa, descripcion: e.target.value})}
              />
            </div>
            <div className="input-field">
              <label>Servicios Principales</label>
              <textarea 
                rows="3" value={empresa.servicios}
                onChange={(e) => setEmpresa({...empresa, servicios: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary">Guardar Cambios</button>
          </form>
        </section>

        {/* TARJETA USUARIOS */}
        <section className="admin-card">
          <div className="card-icon">👤</div>
          <h2>Registro de Personal</h2>
          <form onSubmit={handleCreateUser} className="modern-form">
            <div className="input-field">
              <label>Nombre Completo</label>
              <input 
                type="text" required value={newUser.nombre}
                onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
              />
            </div>
            <div className="input-field">
              <label>Correo Electrónico</label>
              <input 
                type="email" required value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="input-field">
              <label>Contraseña Temporal</label>
              <input 
                type="password" required value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>

            <label className="section-label">Permisos de Acceso</label>
            <div className="permissions-container">
              {['admin', 'supervisar', 'tareas', 'estadisticas'].map((perm) => (
                <label key={perm} className="check-label">
                  <input 
                    type="checkbox" 
                    checked={newUser[`permiso_${perm}`]} 
                    onChange={(e) => setNewUser({...newUser, [`permiso_${perm}`]: e.target.checked})} 
                  />
                  <span>Módulo {perm.charAt(0).toUpperCase() + perm.slice(1)}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="btn-success">Crear Cuenta</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Admin;