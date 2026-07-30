// Citas.jsx - VERSIÓN CON IDs
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./citas.css";

const API_URL = 'http://localhost:5000/api/citas';

const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
  const [buscarId, setBuscarId] = useState("");
  
  const [nuevaCita, setNuevaCita] = useState({
    fecha: "",
    hora: "",
    id_cliente: "",
    id_empleado: "",
    id_servicio: "",
    estado: "Pendiente"
  });

  // Cargar citas al iniciar
  useEffect(() => {
    cargarCitas();
    cargarSelectores();
  }, []);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setCitas(response.data.data);
      } else {
        alert('❌ ' + response.data.message);
      }
    } catch (error) {
      console.error('Error cargando citas:', error);
      alert('❌ Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const cargarSelectores = async () => {
    try {
      // Cargar clientes
      const clientesRes = await axios.get(`${API_URL}/clientes`);
      if (clientesRes.data.success) {
        setClientes(clientesRes.data.data);
      }

      // Cargar empleados
      const empleadosRes = await axios.get(`${API_URL}/empleados`);
      if (empleadosRes.data.success) {
        setEmpleados(empleadosRes.data.data);
      }

      // Cargar servicios
      const serviciosRes = await axios.get(`${API_URL}/servicios`);
      if (serviciosRes.data.success) {
        setServicios(serviciosRes.data.data);
      }
    } catch (error) {
      console.error('Error cargando selectores:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCita({
      ...nuevaCita,
      [name]: value
    });
  };

  const handleGuardar = async () => {
    try {
      // Validaciones
      if (!nuevaCita.fecha) {
        alert('⚠️ La fecha es obligatoria');
        return;
      }

      if (!nuevaCita.hora) {
        alert('⚠️ La hora es obligatoria');
        return;
      }

      if (!nuevaCita.id_cliente) {
        alert('⚠️ Selecciona un cliente');
        return;
      }

      if (!nuevaCita.id_empleado) {
        alert('⚠️ Selecciona un empleado');
        return;
      }

      if (!nuevaCita.id_servicio) {
        alert('⚠️ Selecciona un servicio');
        return;
      }

      setLoading(true);

      let response;
      if (citaEditando) {
        // Actualizar
        response = await axios.put(`${API_URL}/${citaEditando.id_cita}`, nuevaCita);
        if (response.data.success) {
          alert('✅ Cita actualizada');
        }
      } else {
        // Crear
        response = await axios.post(API_URL, nuevaCita);
        if (response.data.success) {
          alert('✅ Cita creada');
        }
      }
      
      await cargarCitas();
      setNuevaCita({ fecha: "", hora: "", id_cliente: "", id_empleado: "", id_servicio: "", estado: "Pendiente" });
      setCitaEditando(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error guardando:', error);
      alert(error.response?.data?.message || '❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (cita) => {
    setCitaEditando(cita);
    setNuevaCita({
      fecha: cita.fecha || "",
      hora: cita.hora || "",
      id_cliente: cita.id_cliente || "",
      id_empleado: cita.id_empleado || "",
      id_servicio: cita.id_servicio || "",
      estado: cita.estado || "Pendiente"
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta cita?")) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Cita eliminada');
        await cargarCitas();
      }
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('❌ Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!buscarId || buscarId.trim() === "") {
      alert("Ingresa un ID de cita para buscar");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/search?id=${buscarId}`);
      if (response.data.success) {
        if (response.data.data.length > 0) {
          const cita = response.data.data[0];
          alert(`📋 Cita encontrada:\nCliente: ${cita.cliente}\nFecha: ${cita.fecha}\nHora: ${cita.hora}\nServicio: ${cita.servicio}\nEstado: ${cita.estado}`);
        } else {
          alert("No se encontró la cita con ese ID");
        }
      }
    } catch (error) {
      console.error('Error buscando:', error);
      alert('❌ Error al buscar');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async () => {
    setBuscarId("");
    await cargarCitas();
    alert("✅ Lista actualizada");
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case "Pendiente": return "pending";
      case "Confirmada": return "confirmed";
      case "Finalizada": return "completed";
      case "Cancelada": return "cancelled";
      default: return "";
    }
  };

  return (
    <div className="citas-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <h1>SHELBY</h1>
          <span className="barrier">BARBER</span>
        </div>

        <nav className="nav-menu">
          <ul>
            <Link to="/dashboard"><li>Inicio</li></Link>
            <Link to="/clientes"><li>Clientes</li></Link>
            <li className="active">Citas</li>
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
          <h2>CITAS {loading && <span>⏳</span>}</h2>
          <button 
            className="btn-nuevo"
            onClick={() => {
              setMostrarFormulario(true);
              setCitaEditando(null);
              setNuevaCita({ fecha: "", hora: "", id_cliente: "", id_empleado: "", id_servicio: "", estado: "Pendiente" });
            }}
          >
            + Nueva Cita
          </button>
        </header>

        {/* FORMULARIO */}
        {mostrarFormulario && (
          <div className="formulario-card">
            <h3>{citaEditando ? "EDITAR CITA" : "NUEVA CITA"}</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>ID CITA</label>
                <input 
                  type="text" 
                  value={citaEditando ? citaEditando.id_cita : "(auto)"} 
                  disabled 
                  className="id-disabled"
                />
              </div>

              <div className="form-group">
                <label>FECHA *</label>
                <input 
                  type="date" 
                  name="fecha"
                  value={nuevaCita.fecha}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>HORA *</label>
                <input 
                  type="time" 
                  name="hora"
                  value={nuevaCita.hora}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>CLIENTE *</label>
                <select 
                  name="id_cliente"
                  value={nuevaCita.id_cliente}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>EMPLEADO *</label>
                <select 
                  name="id_empleado"
                  value={nuevaCita.id_empleado}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar empleado...</option>
                  {empleados.map(empleado => (
                    <option key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>SERVICIO *</label>
                <select 
                  name="id_servicio"
                  value={nuevaCita.id_servicio}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar servicio...</option>
                  {servicios.map(servicio => (
                    <option key={servicio.id_servicio} value={servicio.id_servicio}>
                      {servicio.nombre_servicio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>ESTADO</label>
                <select 
                  name="estado"
                  value={nuevaCita.estado}
                  onChange={handleInputChange}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-guardar" onClick={handleGuardar} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              {citaEditando && (
                <button className="btn-eliminar" onClick={() => handleEliminar(citaEditando.id_cita)} disabled={loading}>
                  Eliminar
                </button>
              )}
              <button className="btn-cancelar" onClick={() => {
                setMostrarFormulario(false);
                setCitaEditando(null);
                setNuevaCita({ fecha: "", hora: "", id_cliente: "", id_empleado: "", id_servicio: "", estado: "Pendiente" });
              }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* BUSCADOR */}
        <div className="buscador-card">
          <div className="buscador-group">
            <label>Buscar por ID...</label>
            <div className="buscador-inputs">
              <input 
                type="number" 
                value={buscarId}
                onChange={(e) => setBuscarId(e.target.value)}
                placeholder="ID de cita"
              />
              <button className="btn-buscar" onClick={handleBuscar} disabled={loading}>
                Buscar
              </button>
              <button className="btn-actualizar" onClick={handleActualizar} disabled={loading}>
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* LISTA DE CITAS */}
        <div className="lista-section">
          <h3>LISTA DE CITAS {citas.length > 0 && `(${citas.length})`}</h3>
          
          <div className="table-responsive">
            <table className="citas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>FECHA</th>
                  <th>HORA</th>
                  <th>CLIENTE</th>
                  <th>EMPLEADO</th>
                  <th>SERVICIO</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {loading && citas.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Cargando citas...
                    </td>
                  </tr>
                ) : citas.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No hay citas registradas
                    </td>
                  </tr>
                ) : (
                  citas.map((cita) => (
                    <tr key={cita.id_cita}>
                      <td>{cita.id_cita}</td>
                      <td>{cita.fecha}</td>
                      <td>{cita.hora}</td>
                      <td>{cita.cliente}</td>
                      <td>{cita.empleado}</td>
                      <td>{cita.servicio}</td>
                      <td>
                        <span className={`status ${getEstadoColor(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td className="acciones">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditar(cita)}
                          disabled={loading}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleEliminar(cita.id_cita)}
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Citas;