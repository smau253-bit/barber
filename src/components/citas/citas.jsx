// Citas.jsx - VERSIÓN SIN BD (CON SIMULACIÓN)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./citas.css";

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
let DATOS_SIMULADOS = {
  citas: [
    { id_cita: 1, fecha: '2026-07-30', hora: '09:00', id_cliente: 1, cliente: 'Juan Pérez', id_empleado: 1, empleado: 'Carlos López', id_servicio: 1, servicio: 'Corte de cabello', estado: 'Confirmada' },
    { id_cita: 2, fecha: '2026-07-30', hora: '10:30', id_cliente: 2, cliente: 'María García', id_empleado: 2, empleado: 'Ana Martínez', id_servicio: 2, servicio: 'Tinte', estado: 'Pendiente' },
    { id_cita: 3, fecha: '2026-07-30', hora: '11:45', id_cliente: 3, cliente: 'Pedro Rodríguez', id_empleado: 1, empleado: 'Carlos López', id_servicio: 3, servicio: 'Barba', estado: 'Confirmada' },
    { id_cita: 4, fecha: '2026-07-31', hora: '13:00', id_cliente: 4, cliente: 'Laura Sánchez', id_empleado: 2, empleado: 'Ana Martínez', id_servicio: 4, servicio: 'Corte y peinado', estado: 'Pendiente' },
    { id_cita: 5, fecha: '2026-07-31', hora: '15:30', id_cliente: 5, cliente: 'Diego Ramírez', id_empleado: 1, empleado: 'Carlos López', id_servicio: 1, servicio: 'Corte de cabello', estado: 'Finalizada' },
  ],
  clientes: [
    { id_cliente: 1, nombre: 'Juan Pérez' },
    { id_cliente: 2, nombre: 'María García' },
    { id_cliente: 3, nombre: 'Pedro Rodríguez' },
    { id_cliente: 4, nombre: 'Laura Sánchez' },
    { id_cliente: 5, nombre: 'Diego Ramírez' },
    { id_cliente: 6, nombre: 'Sofía Torres' },
  ],
  empleados: [
    { id_empleado: 1, nombre: 'Carlos López' },
    { id_empleado: 2, nombre: 'Ana Martínez' },
    { id_empleado: 3, nombre: 'Roberto Gómez' },
  ],
  servicios: [
    { id_servicio: 1, nombre_servicio: 'Corte de cabello' },
    { id_servicio: 2, nombre_servicio: 'Tinte' },
    { id_servicio: 3, nombre_servicio: 'Barba' },
    { id_servicio: 4, nombre_servicio: 'Corte y peinado' },
    { id_servicio: 5, nombre_servicio: 'Tratamiento capilar' },
  ]
};

let contadorId = 6; // Para generar IDs automáticos

const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
  const [buscarId, setBuscarId] = useState("");
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);
  
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

  // ============================================
  // 🟢 FUNCIONES SIMULADAS (SIN BD)
  // ============================================
  
  const cargarCitasSimuladas = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            data: DATOS_SIMULADOS.citas
          }
        });
      }, 500);
    });
  };

  const cargarSelectoresSimulados = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          clientes: { data: { success: true, data: DATOS_SIMULADOS.clientes } },
          empleados: { data: { success: true, data: DATOS_SIMULADOS.empleados } },
          servicios: { data: { success: true, data: DATOS_SIMULADOS.servicios } }
        });
      }, 300);
    });
  };

  const guardarCitaSimulada = (cita, editando) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (editando) {
          // Actualizar
          const index = DATOS_SIMULADOS.citas.findIndex(c => c.id_cita === cita.id_cita);
          if (index !== -1) {
            DATOS_SIMULADOS.citas[index] = { ...DATOS_SIMULADOS.citas[index], ...cita };
            resolve({ data: { success: true, message: 'Cita actualizada' } });
          } else {
            reject({ response: { data: { message: 'Cita no encontrada' } } });
          }
        } else {
          // Crear nueva
          const nueva = {
            id_cita: contadorId++,
            ...cita,
            cliente: DATOS_SIMULADOS.clientes.find(c => c.id_cliente === parseInt(cita.id_cliente))?.nombre || 'Cliente',
            empleado: DATOS_SIMULADOS.empleados.find(e => e.id_empleado === parseInt(cita.id_empleado))?.nombre || 'Empleado',
            servicio: DATOS_SIMULADOS.servicios.find(s => s.id_servicio === parseInt(cita.id_servicio))?.nombre_servicio || 'Servicio'
          };
          DATOS_SIMULADOS.citas.push(nueva);
          resolve({ data: { success: true, message: 'Cita creada' } });
        }
      }, 500);
    });
  };

  const eliminarCitaSimulada = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = DATOS_SIMULADOS.citas.findIndex(c => c.id_cita === parseInt(id));
        if (index !== -1) {
          DATOS_SIMULADOS.citas.splice(index, 1);
          resolve({ data: { success: true, message: 'Cita eliminada' } });
        } else {
          reject({ response: { data: { message: 'Cita no encontrada' } } });
        }
      }, 500);
    });
  };

  const buscarCitaSimulada = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cita = DATOS_SIMULADOS.citas.find(c => c.id_cita === parseInt(id));
        resolve({
          data: {
            success: true,
            data: cita ? [cita] : []
          }
        });
      }, 300);
    });
  };

  // ============================================
  // 🟡 FUNCIONES PRINCIPALES (CON SOPORTE BD)
  // ============================================

  const cargarCitas = async () => {
    setLoading(true);
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const response = await cargarCitasSimuladas();
      if (response.data.success) {
        setCitas(response.data.data);
        setUsandoSimulacion(true);
      }
      
      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setCitas(response.data.data);
        setUsandoSimulacion(false);
      } else {
        alert('❌ ' + response.data.message);
      }
      */
      
    } catch (error) {
      console.error('Error cargando citas:', error);
      // Si falla, usar datos simulados como respaldo
      const response = await cargarCitasSimuladas();
      if (response.data.success) {
        setCitas(response.data.data);
        setUsandoSimulacion(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const cargarSelectores = async () => {
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const data = await cargarSelectoresSimulados();
      setClientes(data.clientes.data.data);
      setEmpleados(data.empleados.data.data);
      setServicios(data.servicios.data.data);

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const clientesRes = await axios.get(`${API_URL}/clientes`);
      if (clientesRes.data.success) {
        setClientes(clientesRes.data.data);
      }

      const empleadosRes = await axios.get(`${API_URL}/empleados`);
      if (empleadosRes.data.success) {
        setEmpleados(empleadosRes.data.data);
      }

      const serviciosRes = await axios.get(`${API_URL}/servicios`);
      if (serviciosRes.data.success) {
        setServicios(serviciosRes.data.data);
      }
      */
      
    } catch (error) {
      console.error('Error cargando selectores:', error);
      // Usar datos simulados como respaldo
      const data = await cargarSelectoresSimulados();
      setClientes(data.clientes.data.data);
      setEmpleados(data.empleados.data.data);
      setServicios(data.servicios.data.data);
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

      // ============================================
      // 🟢 PARTE 1: GUARDAR SIMULADO (SIN BD)
      // ============================================
      const citaData = {
        ...nuevaCita,
        id_cita: citaEditando ? citaEditando.id_cita : null
      };
      
      const response = await guardarCitaSimulada(citaData, !!citaEditando);
      alert(response.data.success ? '✅ Cita guardada' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      let response;
      if (citaEditando) {
        response = await axios.put(`${API_URL}/${citaEditando.id_cita}`, nuevaCita);
        if (response.data.success) {
          alert('✅ Cita actualizada');
        }
      } else {
        response = await axios.post(API_URL, nuevaCita);
        if (response.data.success) {
          alert('✅ Cita creada');
        }
      }
      */
      
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
      id_cliente: cita.id_cliente ? String(cita.id_cliente) : "",
      id_empleado: cita.id_empleado ? String(cita.id_empleado) : "",
      id_servicio: cita.id_servicio ? String(cita.id_servicio) : "",
      estado: cita.estado || "Pendiente"
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta cita?")) return;
    
    try {
      setLoading(true);
      
      // ============================================
      // 🟢 PARTE 1: ELIMINAR SIMULADO (SIN BD)
      // ============================================
      const response = await eliminarCitaSimulada(id);
      alert(response.data.success ? '✅ Cita eliminada' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Cita eliminada');
      }
      */
      
      await cargarCitas();
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
      
      // ============================================
      // 🟢 PARTE 1: BUSCAR SIMULADO (SIN BD)
      // ============================================
      const response = await buscarCitaSimulada(buscarId);

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.get(`${API_URL}/search?id=${buscarId}`);
      */
      
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
          <h2>
            CITAS {loading && <span>⏳</span>}
            {!loading && usandoSimulacion && (
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                ⚡ Demo
              </span>
            )}
          </h2>
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
            {usandoSimulacion && (
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                🔄 Modo demostración - Los datos se guardan localmente
              </p>
            )}
            
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