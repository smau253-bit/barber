// Dashboard.jsx - VERSIÓN CON BACKEND
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

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

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      // Cargar estadísticas
      const statsResponse = await axios.get(`${API_URL}/stats`);
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Cargar citas de hoy
      const citasResponse = await axios.get(`${API_URL}/citas-hoy`);
      if (citasResponse.data.success) {
        setCitasHoy(citasResponse.data.data);
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error);
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
          <h2>PANEL DE CONTROL {loading && <span>⏳</span>}</h2>
        </header>

        <section className="welcome-section">
          <h3>BIENVENIDO</h3>
          <p>Panel de control - Administrador</p>
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
      </main>
    </div>
  );
};

export default Dashboard;