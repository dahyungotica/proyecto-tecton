// src/modules/Supervisar/Supervisar.js
import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import { supabase } from '../../supabaseClient';
import 'react-calendar/dist/Calendar.css';
import './Supervisar.css';

const Supervisar = () => {
  const [date, setDate] = useState(new Date());
  const [listas, setListas] = useState([]);
  const [nombreNuevaLista, setNombreNuevaLista] = useState('');

  const fetchListas = useCallback(async () => {
    const fechaFormateada = date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('listas')
      .select('*, tareas (*)')
      .eq('fecha', fechaFormateada);

    if (!error) setListas(data || []);
  }, [date]);

  useEffect(() => {
    fetchListas();
  }, [fetchListas]);

  const handleCrearLista = async (e) => {
    e.preventDefault();
    if (!nombreNuevaLista.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('listas').insert([
      { nombre: nombreNuevaLista, fecha: date.toISOString().split('T')[0], creado_por: user.id }
    ]);
    if (!error) { setNombreNuevaLista(''); fetchListas(); }
  };

  const handleAgregarTarea = async (listaId, descripcion) => {
    if (!descripcion.trim()) return;
    const { error } = await supabase.from('tareas').insert([
      { lista_id: listaId, descripcion: descripcion, estado: 'pendiente' }
    ]);
    if (!error) fetchListas();
  };

  return (
    <div className="supervisar-view">
      <div className="supervisar-layout">
        
        {/* COLUMNA IZQUIERDA: CALENDARIO */}
        <aside className="calendar-card">
          <div className="card-header">
            <h3>Planificador</h3>
            <span className="date-badge">{date.toLocaleDateString()}</span>
          </div>
          <Calendar 
            onChange={setDate} 
            value={date} 
            className="modern-calendar"
          />
        </aside>

        {/* COLUMNA DERECHA: LISTAS */}
        <main className="content-section">
          <header className="content-header">
            <h2>Listas de Trabajo</h2>
            <form onSubmit={handleCrearLista} className="quick-add-list">
              <input 
                type="text" 
                placeholder="Nombre de la nueva lista..." 
                value={nombreNuevaLista}
                onChange={(e) => setNombreNuevaLista(e.target.value)}
              />
              <button type="submit">Crear Lista</button>
            </form>
          </header>

          <div className="lists-container">
            {listas.map((lista) => (
              <div key={lista.id} className="modern-list-card">
                <div className="list-card-header">
                  <h4>{lista.nombre}</h4>
                  <span className={`list-status ${lista.estado.replace(' ', '-')}`}>
                    {lista.estado}
                  </span>
                </div>

                <div className="tasks-scroll-area">
                  {lista.tareas?.map((tarea) => (
                    <div key={tarea.id} className={`task-row ${tarea.estado}`}>
                      <div className="status-dot"></div>
                      <span className="task-desc">{tarea.descripcion}</span>
                    </div>
                  ))}
                  {lista.tareas?.length === 0 && <p className="no-tasks">Sin tareas asignadas</p>}
                </div>
                
                <div className="add-task-box">
                  <input 
                    type="text" 
                    placeholder="+ Añadir tarea y pulsa Enter" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAgregarTarea(lista.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            ))}
            {listas.length === 0 && (
              <div className="empty-state">
                <p>No hay listas programadas para este día.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Supervisar;