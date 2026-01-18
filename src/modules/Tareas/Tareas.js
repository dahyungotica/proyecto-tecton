// src/modules/Tareas/Tareas.js
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import './Tareas.css';

const Tareas = () => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [listas, setListas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [perfilUsuario, setPerfilUsuario] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('perfiles').select('nombre').eq('id', user.id).single();
      setPerfilUsuario(data);
    };
    getProfile();
  }, []);

  const fetchTareasDelDia = useCallback(async () => {
    const { data, error } = await supabase
      .from('listas')
      .select('*, tareas(*)')
      .eq('fecha', fecha);
    
    if (!error) setListas(data || []);
  }, [fecha]);

  useEffect(() => {
    fetchTareasDelDia();
  }, [fetchTareasDelDia]);

  const guardarCambios = async (estadoFinal = null) => {
    if (!tareaSeleccionada) return;

    let nuevosParticipantes = tareaSeleccionada.participantes || [];
    if (perfilUsuario && !nuevosParticipantes.includes(perfilUsuario.nombre)) {
      nuevosParticipantes.push(perfilUsuario.nombre);
    }

    const updates = {
      estado: estadoFinal || tareaSeleccionada.estado,
      comentarios: tareaSeleccionada.comentarios,
      insumos: tareaSeleccionada.insumos,
      participantes: nuevosParticipantes,
      updated_at: new Date()
    };

    const { error } = await supabase.from('tareas').update(updates).eq('id', tareaSeleccionada.id);

    if (!error) {
      alert(estadoFinal === 'terminado' ? "✅ Tarea Finalizada" : "💾 Progreso Guardado");
      setTareaSeleccionada(estadoFinal === 'terminado' ? null : { ...tareaSeleccionada, ...updates });
      fetchTareasDelDia();
    }
  };

  return (
    <div className="tareas-view">
      <header className="tareas-header">
        <div className="header-info">
          <h1>Panel de Trabajo</h1>
          <p>Gestión de ejecución y registro de insumos.</p>
        </div>
        <div className="date-picker-wrapper">
          <label>Jornada:</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
      </header>

      <div className="tareas-workspace">
        {/* COLUMNA IZQUIERDA: SELECTOR */}
        <aside className="tasks-sidebar">
          {listas.map(lista => (
            <div key={lista.id} className="sidebar-group">
              <h5>{lista.nombre}</h5>
              {lista.tareas.map(t => (
                <button 
                  key={t.id} 
                  className={`task-nav-btn ${t.estado} ${tareaSeleccionada?.id === t.id ? 'active' : ''}`}
                  onClick={() => setTareaSeleccionada(t)}
                >
                  <span className="dot"></span>
                  <span className="desc">{t.descripcion}</span>
                </button>
              ))}
            </div>
          ))}
          {listas.length === 0 && <p className="empty-msg">No hay tareas para esta fecha.</p>}
        </aside>

        {/* COLUMNA DERECHA: EDICIÓN */}
        <main className="task-editor">
          {tareaSeleccionada ? (
            <div className="editor-card">
              <div className="editor-header">
                <span className={`status-label ${tareaSeleccionada.estado}`}>
                  {tareaSeleccionada.estado}
                </span>
                <h2>{tareaSeleccionada.descripcion}</h2>
              </div>

              {tareaSeleccionada.estado !== 'terminado' ? (
                <div className="editor-body">
                  <div className="action-row">
                    <button 
                      className="btn-action start"
                      onClick={() => setTareaSeleccionada({...tareaSeleccionada, estado: 'en desarrollo'})}
                    >
                      ▶ Iniciar Desarrollo
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Reporte de Avance / Comentarios</label>
                    <textarea 
                      placeholder="Escribe aquí el detalle de lo realizado..."
                      value={tareaSeleccionada.comentarios || ''} 
                      onChange={(e) => setTareaSeleccionada({...tareaSeleccionada, comentarios: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Insumos y Materiales</label>
                    <input 
                      type="text" 
                      placeholder="Ej: 5mts cable, 2 conectores RJ45..."
                      value={tareaSeleccionada.insumos || ''} 
                      onChange={(e) => setTareaSeleccionada({...tareaSeleccionada, insumos: e.target.value})}
                    />
                  </div>

                  <div className="editor-footer">
                    <button className="btn-secondary" onClick={() => guardarCambios()}>Guardar Avance</button>
                    <button className="btn-success" onClick={() => guardarCambios('terminado')}>Finalizar Tarea</button>
                  </div>
                </div>
              ) : (
                <div className="finished-view">
                  <div className="finished-icon">✔️</div>
                  <h3>Tarea Completada</h3>
                  <div className="finished-details">
                    <p><strong>Operarios:</strong> {tareaSeleccionada.participantes?.join(', ')}</p>
                    <p><strong>Insumos:</strong> {tareaSeleccionada.insumos || 'Ninguno'}</p>
                    <p><strong>Reporte:</strong> {tareaSeleccionada.comentarios || 'Sin comentarios'}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <img src="https://cdn-icons-png.flaticon.com/512/2092/2092215.png" alt="select" />
              <p>Selecciona una tarea del panel izquierdo para comenzar a reportar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Tareas;