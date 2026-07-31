// Dashboard.jsx - VERSIÓN SIN BD (CON SIMULACIÓN)
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import axios from 'axios';

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
const DATOS_SIMULADOS = {
  stats: {
    clientes: 156,
    citasHoy: 8,
    servicios: 12,
    pendientes: 3,
    productos: 45,
    empleados: 6,
    ventasHoy: 5,
    montoVentasHoy: 1250
  },
  citasHoy: [
    { id_cita: 1, hora: '09:00', cliente: 'Juan Pérez', empleado: 'Carlos López', servicio: 'Corte de cabello', estado: 'Confirmada' },
    { id_cita: 2, hora: '10:30', cliente: 'María García', empleado: 'Ana Martínez', servicio: 'Tinte', estado: 'Pendiente' },
    { id_cita: 3, hora: '11:45', cliente: 'Pedro Rodríguez', empleado: 'Carlos López', servicio: 'Barba', estado: 'Confirmada' },
    { id_cita: 4, hora: '13:00', cliente: 'Laura Sánchez', empleado: 'Ana Martínez', servicio: 'Corte y peinado', estado: 'Pendiente' },
    { id_cita: 5, hora: '15:30', cliente: 'Diego Ramírez', empleado: 'Carlos López', servicio: 'Corte de cabello', estado: 'Confirmada' },
    { id_cita: 6, hora: '17:00', cliente: 'Sofía Torres', empleado: 'Ana Martínez', servicio: 'Tinte y corte', estado: 'Finalizada' }
  ]
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    clientes: 0,
    citasHoy: 0,
    servicios: 0,
    pendientes: 0,
    productos: 0,
    empleados: 0,
    ventasHoy: 0,
    montoVentasHoy: 0
  });
  const [citasHoy, setCitasHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Usar datos simulados
      setStats(DATOS_SIMULADOS.stats);
      setCitasHoy(DATOS_SIMULADOS.citasHoy);
      setUsandoSimulacion(true);
      
      console.log('📊 Usando datos simulados (sin BD)');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      // Cargar estadísticas desde BD
      const statsResponse = await axios.get(`${API_URL}/stats`);
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Cargar citas de hoy desde BD
      const citasResponse = await axios.get(`${API_URL}/citas-hoy`);
      if (citasResponse.data.success) {
        setCitasHoy(citasResponse.data.data);
      }
      */
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      
      // Si falla la BD, usar datos simulados como respaldo
      console.log('⚠️ Usando datos simulados como respaldo');
      setStats(DATOS_SIMULADOS.stats);
      setCitasHoy(DATOS_SIMULADOS.citasHoy);
      setUsandoSimulacion(true);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch(estado) {
      case "Pendiente": return "pending";
      case "Confirmada": return "confirmed";
      case "Finalizada": return "completed";
      case "Cancelada": return "cancelled";
      default: return "";
    }
  };

  // Función para formatear el estado en español
  const getEstadoTexto = (estado) => {
    switch(estado) {
      case "Pendiente": return "Pendiente";
      case "Confirmada": return "Confirmada";
      case "Finalizada": return "Atendido";
      case "Cancelada": return "Cancelado";
      default: return estado || "Pendiente";
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <h1>SHELBY</h1>
          <span className="barrier">BARBER</span>
        </div>

        <nav className="nav-menu">
          <ul>
            <li className="active">Inicio</li>
            <Link to="/clientes"><li>Clientes</li></Link>
            <Link to="/citas"><li>Citas</li></Link>
            <Link to="/servicio"><li>Servicios</li></Link>
            <Link to="/producto"><li>Productos</li></Link>
            <Link to="/ventas"><li>Ventas</li></Link>
            <Link to="/empleados"><li>Empleados</li></Link>
          </ul>
        </nav>

        <div className="session-info">
          <p className="session-title">Sesión activa</p>
          <p className="user">Administrador admin</p>
          <Link to="/">
            <button className="logout-btn">Cerrar sesión</button>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-header">
          <h2>
            PANEL DE CONTROL 
            {loading && <span> ⏳</span>}
            {!loading && usandoSimulacion && (
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                ⚡ Demo
              </span>
            )}
          </h2>
        </header>

        <section className="welcome-section">
          <h3>BIENVENIDO</h3>
          <p>Panel de control - Administrador</p>
          {usandoSimulacion && (
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              🔄 Modo demostración (datos de prueba)
            </p>
          )}
        </section>

        {/* STATS CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.clientes}</span>
            <span className="stat-label">Clientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.citasHoy}</span>
            <span className="stat-label">Citas hoy</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.servicios}</span>
            <span className="stat-label">Servicios</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.pendientes}</span>
            <span className="stat-label">Pendientes</span>
          </div>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className="appointments-section">
          <div className="section-header">
            <h3>CITAS DE HOY {citasHoy.length > 0 && `(${citasHoy.length})`}</h3>
            <Link to="/citas">
              <button className="new-appointment-btn">+ Nueva cita</button>
            </Link>
          </div>

          {loading ? (
            <div className="loading-message">Cargando citas...</div>
          ) : citasHoy.length === 0 ? (
            <div className="empty-message">No hay citas programadas para hoy</div>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>HORA</th>
                  <th>CLIENTE</th>
                  <th>BARBERO</th>
                  <th>SERVICIO</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {citasHoy.map((cita) => (
                  <tr key={cita.id_cita}>
                    <td>{cita.hora || '--:--'}</td>
                    <td>{cita.cliente || 'Sin cliente'}</td>
                    <td>{cita.empleado || 'Sin barbero'}</td>
                    <td>{cita.servicio || 'Sin servicio'}</td>
                    <td>
                      <span className={`status ${getEstadoColor(cita.estado)}`}>
                        {getEstadoTexto(cita.estado)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <Link to="/clientes">
            <button className="action-btn">REGISTRAR CLIENTE</button>
          </Link>
          <Link to="/citas">
            <button className="action-btn">NUEVA CITA</button>
          </Link>
        </div>

        {/* INDICADOR DE MODO */}
        {usandoSimulacion && (
          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
            fontSize: '11px',
            color: '#666',
            textAlign: 'center',
            border: '1px solid #e0e0e0'
          }}>
            ⚡ Dashboard en modo <strong>DEMO</strong> - Los datos son de prueba
            <br />
            <span style={{ fontSize: '10px', color: '#999' }}>
              Para conectar con BD, descomenta la Parte 2 en cargarDashboard()
            </span>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;