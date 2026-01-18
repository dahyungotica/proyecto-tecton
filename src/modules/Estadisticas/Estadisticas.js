// src/modules/Estadisticas/Estadisticas.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './Estadisticas.css';

const Estadisticas = () => {
  const [datos, setDatos] = useState({
    empresa: {},
    usuarios: [],
    listas: [],
    progresoHoy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const hoy = new Date().toISOString().split('T')[0];

    const { data: empresa } = await supabase.from('empresa').select('*').single();
    const { data: usuarios } = await supabase.from('perfiles').select('nombre, correo').eq('es_admin_raiz', false);
    const { data: listas } = await supabase.from('listas').select('*, tareas(*)');

    const listasHoy = listas?.filter(l => l.fecha === hoy) || [];
    const todasLasTareasHoy = listasHoy.flatMap(l => l.tareas);
    const terminadasHoy = todasLasTareasHoy.filter(t => t.estado === 'terminado').length;
    const totalHoy = todasLasTareasHoy.length;
    const porcentaje = totalHoy > 0 ? Math.round((terminadasHoy / totalHoy) * 100) : 0;

    setDatos({
      empresa: empresa || {},
      usuarios: usuarios || [],
      listas: listas || [],
      progresoHoy: porcentaje
    });
    setLoading(false);
  };

  const getEstadoLista = (tareas) => {
    if (!tareas || tareas.length === 0) return 'Sin tareas';
    const todosTerminados = tareas.every(t => t.estado === 'terminado');
    const algunoEnProgreso = tareas.some(t => t.estado === 'en desarrollo' || t.estado === 'terminado');
    if (todosTerminados) return 'Completada';
    if (algunoEnProgreso) return 'En Curso';
    return 'Pendiente';
  };

  if (loading) return <div className="stats-loader">Analizando datos...</div>;

  return (
    <div className="stats-view">
      <header className="stats-header">
        <div>
          <h1>Análisis de Rendimiento</h1>
          <p>Visión general de la empresa y cumplimiento de objetivos.</p>
        </div>
        <button onClick={fetchStats} className="btn-refresh">🔄 Actualizar Datos</button>
      </header>

      <div className="stats-grid">
        {/* KPI: PROGRESO DIARIO */}
        <section className="stats-card kpi-card">
          <div className="kpi-info">
            <h3>Cumplimiento Diario</h3>
            <span className="kpi-value">{datos.progresoHoy}%</span>
          </div>
          <div className="progress-container-large">
            <div className="progress-track">
              <div className="progress-thumb" style={{ width: `${datos.progresoHoy}%` }}></div>
            </div>
          </div>
          <p className="kpi-subtitle">Tareas finalizadas hoy vs total programado.</p>
        </section>

        {/* INFO EMPRESA */}
        <section className="stats-card company-card">
          <div className="card-badge">Empresa</div>
          <h2>{datos.empresa.nombre}</h2>
          <p className="company-desc">{datos.empresa.descripcion}</p>
          <div className="company-meta">
            <span><strong>Servicios:</strong> {datos.empresa.servicios}</span>
          </div>
        </section>

        {/* USUARIOS ACTIVOS */}
        <section className="stats-card users-card">
          <h3>Equipo de Trabajo</h3>
          <div className="user-avatars">
            {datos.usuarios.map((u, i) => (
              <div key={i} className="user-item" title={u.correo}>
                <div className="avatar-circle">{u.nombre.charAt(0)}</div>
                <div className="user-details">
                  <span className="u-name">{u.nombre}</span>
                  <span className="u-mail">{u.correo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TABLA DE PROYECTOS/LISTAS */}
        <section className="stats-card full-width">
          <h3>Estado de Listas Operativas</h3>
          <div className="table-wrapper">
            <table className="modern-stats-table">
              <thead>
                <tr>
                  <th>Nombre de Lista</th>
                  <th>Fecha de Ejecución</th>
                  <th>Estado Actual</th>
                  <th>Tareas</th>
                </tr>
              </thead>
              <tbody>
                {datos.listas.map(lista => {
                  const estado = getEstadoLista(lista.tareas);
                  return (
                    <tr key={lista.id}>
                      <td className="font-bold">{lista.nombre}</td>
                      <td>{lista.fecha}</td>
                      <td>
                        <span className={`pill ${estado.toLowerCase().replace(' ', '-')}`}>
                          {estado}
                        </span>
                      </td>
                      <td>
                        <div className="mini-progress">
                          <span>{lista.tareas.filter(t => t.estado === 'terminado').length} de {lista.tareas.length}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Estadisticas;