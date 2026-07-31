// src/components/Empleados.jsx
import React, { useState, useEffect } from "react";
import "./empleado.css";
import { Link } from "react-router-dom";
import axios from 'axios';

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
let DATOS_SIMULADOS = {
  empleados: [
    { 
      id_empleado: 1, 
      nombre: 'Carlos López', 
      telefono: '722 123 4567', 
      correo: 'carlos@barberia.com', 
      puesto: 'Administrador', 
      rol: 'admin', 
      activo: true,
      password: 'admin123' 
    },
    { 
      id_empleado: 2, 
      nombre: 'Ana Martínez', 
      telefono: '722 234 5678', 
      correo: 'ana@barberia.com', 
      puesto: 'Barbero', 
      rol: 'empleado', 
      activo: true,
      password: 'barbero123' 
    },
    { 
      id_empleado: 3, 
      nombre: 'Roberto Gómez', 
      telefono: '722 345 6789', 
      correo: 'roberto@barberia.com', 
      puesto: 'Barbero', 
      rol: 'empleado', 
      activo: false,
      password: 'barbero456' 
    },
    { 
      id_empleado: 4, 
      nombre: 'Laura Torres', 
      telefono: '722 456 7890', 
      correo: 'laura@barberia.com', 
      puesto: 'Recepcionista', 
      rol: 'empleado', 
      activo: true,
      password: 'recepcion123' 
    }
  ]
};

let contadorId = 5; // Para generar IDs automáticos

// ============================================
// 🟢 FUNCIONES SIMULADAS (SIN BD)
// ============================================

const cargarEmpleadosSimulados = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: DATOS_SIMULADOS.empleados
        }
      });
    }, 500);
  });
};

const guardarEmpleadoSimulado = (empleado, editando) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (editando) {
        // Actualizar
        const index = DATOS_SIMULADOS.empleados.findIndex(e => e.id_empleado === empleado.id_empleado);
        if (index !== -1) {
          // Si no se proporciona nueva contraseña, mantener la anterior
          if (!empleado.password || empleado.password.trim() === '') {
            empleado.password = DATOS_SIMULADOS.empleados[index].password;
          }
          DATOS_SIMULADOS.empleados[index] = { ...DATOS_SIMULADOS.empleados[index], ...empleado };
          resolve({ data: { success: true, message: 'Empleado actualizado' } });
        } else {
          reject({ response: { data: { message: 'Empleado no encontrado' } } });
        }
      } else {
        // Crear nuevo
        const nuevo = {
          id_empleado: contadorId++,
          ...empleado,
          activo: true
        };
        DATOS_SIMULADOS.empleados.push(nuevo);
        resolve({ data: { success: true, message: 'Empleado creado' } });
      }
    }, 500);
  });
};

const eliminarEmpleadoSimulado = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = DATOS_SIMULADOS.empleados.findIndex(e => e.id_empleado === parseInt(id));
      if (index !== -1) {
        DATOS_SIMULADOS.empleados.splice(index, 1);
        resolve({ data: { success: true, message: 'Empleado eliminado' } });
      } else {
        reject({ response: { data: { message: 'Empleado no encontrado' } } });
      }
    }, 500);
  });
};

const buscarEmpleadoSimulado = (termino) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultados = DATOS_SIMULADOS.empleados.filter(e => 
        e.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      resolve({
        data: {
          success: true,
          data: resultados
        }
      });
    }, 300);
  });
};

const toggleStatusSimulado = (id, activo) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = DATOS_SIMULADOS.empleados.findIndex(e => e.id_empleado === parseInt(id));
      if (index !== -1) {
        DATOS_SIMULADOS.empleados[index].activo = activo;
        resolve({ data: { success: true, message: 'Estado actualizado' } });
      } else {
        reject({ response: { data: { message: 'Empleado no encontrado' } } });
      }
    }, 400);
  });
};

const Empleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    puesto: "",
    password: "",
    rol: "empleado"
  });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // ============================================
  // 🟡 FUNCIONES PRINCIPALES (CON SOPORTE BD)
  // ============================================

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const response = await cargarEmpleadosSimulados();
      if (response.data.success) {
        setEmpleados(response.data.data);
        setUsandoSimulacion(true);
      }
      
      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setEmpleados(response.data.data);
        setUsandoSimulacion(false);
      } else {
        alert('❌ ' + response.data.message);
      }
      */
      
    } catch (error) {
      console.error('Error cargando empleados:', error);
      // Si falla, usar datos simulados como respaldo
      const response = await cargarEmpleadosSimulados();
      if (response.data.success) {
        setEmpleados(response.data.data);
        setUsandoSimulacion(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [name]: value
    });
  };

  const handleGuardar = async () => {
    try {
      // Validaciones
      if (!nuevoEmpleado.nombre || !nuevoEmpleado.telefono || 
          !nuevoEmpleado.correo || !nuevoEmpleado.puesto) {
        alert('⚠️ Todos los campos son obligatorios');
        return;
      }

      // Validar correo
      if (!nuevoEmpleado.correo.includes('@')) {
        alert('⚠️ Ingresa un correo válido');
        return;
      }

      if (!empleadoEditando && nuevoEmpleado.password.length < 8) {
        alert('⚠️ La contraseña debe tener al menos 8 caracteres');
        return;
      }

      setLoading(true);

      // ============================================
      // 🟢 PARTE 1: GUARDAR SIMULADO (SIN BD)
      // ============================================
      const empleadoData = {
        ...nuevoEmpleado,
        id_empleado: empleadoEditando ? empleadoEditando.id_empleado : null
      };
      
      const response = await guardarEmpleadoSimulado(empleadoData, !!empleadoEditando);
      alert(response.data.success ? '✅ Empleado guardado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      let response;
      if (empleadoEditando) {
        response = await axios.put(`${API_URL}/${empleadoEditando.id_empleado}`, nuevoEmpleado);
        if (response.data.success) {
          alert('✅ Empleado actualizado');
        }
      } else {
        response = await axios.post(API_URL, nuevoEmpleado);
        if (response.data.success) {
          alert('✅ Empleado creado');
        }
      }
      */
      
      await cargarEmpleados();
      setNuevoEmpleado({ nombre: "", telefono: "", correo: "", puesto: "", password: "", rol: "empleado" });
      setEmpleadoEditando(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error guardando:', error);
      alert(error.response?.data?.message || '❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este empleado?")) return;
    
    try {
      setLoading(true);
      
      // ============================================
      // 🟢 PARTE 1: ELIMINAR SIMULADO (SIN BD)
      // ============================================
      const response = await eliminarEmpleadoSimulado(id);
      alert(response.data.success ? '✅ Empleado eliminado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Empleado eliminado');
      }
      */
      
      await cargarEmpleados();
      setMostrarFormulario(false);
      setEmpleadoEditando(null);
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('❌ Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (empleado) => {
    setEmpleadoEditando(empleado);
    setNuevoEmpleado({
      nombre: empleado.nombre,
      telefono: empleado.telefono,
      correo: empleado.correo,
      puesto: empleado.puesto,
      password: "",
      rol: empleado.rol || "empleado"
    });
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setNuevoEmpleado({ nombre: "", telefono: "", correo: "", puesto: "", password: "", rol: "empleado" });
    setEmpleadoEditando(null);
    setMostrarFormulario(false);
  };

  const handleBuscar = async () => {
    if (buscarTexto.trim() === "") {
      alert("Ingresa un nombre para buscar");
      return;
    }
    
    try {
      setLoading(true);
      
      // ============================================
      // 🟢 PARTE 1: BUSCAR SIMULADO (SIN BD)
      // ============================================
      const response = await buscarEmpleadoSimulado(buscarTexto);

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.get(`${API_URL}/search?termino=${buscarTexto}`);
      */
      
      if (response.data.success) {
        if (response.data.data.length > 0) {
          alert(`📋 Encontrados:\n${response.data.data.map(e => `- ${e.nombre}`).join("\n")}`);
        } else {
          alert("No se encontraron empleados");
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
    setBuscarTexto("");
    await cargarEmpleados();
    alert("✅ Lista actualizada");
  };

  const handleToggleStatus = async (empleado) => {
    try {
      setLoading(true);
      
      // ============================================
      // 🟢 PARTE 1: TOGGLE STATUS SIMULADO (SIN BD)
      // ============================================
      const nuevoEstado = !empleado.activo;
      const response = await toggleStatusSimulado(empleado.id_empleado, nuevoEstado);
      alert(response.data.success ? '✅ Estado actualizado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.patch(`${API_URL}/${empleado.id_empleado}/status`, {
        activo: !empleado.activo
      });
      */
      
      await cargarEmpleados();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('❌ Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  const empleadosFiltrados = buscarTexto 
    ? empleados.filter(e => e.nombre.toLowerCase().includes(buscarTexto.toLowerCase()))
    : empleados;

  return (
    <div className="empleados-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <h1>SHELBY</h1>
          <span className="barrier">BARBER</span>
        </div>
        <nav className="nav-menu">
          <ul>
            <Link to="/dashboard"><li>Inicio</li></Link>
            <Link to="/clientes"><li>Clientes</li></Link>
            <Link to="/citas"><li>Citas</li></Link>
            <Link to="/servicio"><li>Servicios</li></Link>
            <Link to="/producto"><li>Productos</li></Link>
            <Link to="/ventas"><li>Ventas</li></Link>
            <li className="active">Empleados</li>
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

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <h2>
            EMPLEADOS {loading && <span>⏳</span>}
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
              setEmpleadoEditando(null);
              setNuevoEmpleado({ nombre: "", telefono: "", correo: "", puesto: "", password: "", rol: "empleado" });
            }}
          >
            + Nuevo Empleado
          </button>
        </header>

        {/* Aviso */}
        <div className="aviso-card">
          <p>
            El campo <strong>Contraseña</strong> permite al empleado iniciar sesión en el sistema. 
            Solo el administrador puede registrar nuevos empleados.
          </p>
          {usandoSimulacion && (
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              🔄 Modo demostración - Los datos se guardan en memoria
            </p>
          )}
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="formulario-card">
            <h3>{empleadoEditando ? "EDITAR EMPLEADO" : "NUEVO EMPLEADO"}</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>ID EMPLEADO</label>
                <input 
                  type="text" 
                  value={empleadoEditando ? empleadoEditando.id_empleado : "(auto)"} 
                  disabled 
                  className="id-disabled"
                />
              </div>

              <div className="form-group">
                <label>NOMBRE *</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={nuevoEmpleado.nombre}
                  onChange={handleInputChange}
                  placeholder="Carlos López"
                />
              </div>

              <div className="form-group">
                <label>TELÉFONO *</label>
                <input 
                  type="text" 
                  name="telefono"
                  value={nuevoEmpleado.telefono}
                  onChange={handleInputChange}
                  placeholder="722 123 4567"
                />
              </div>

              <div className="form-group">
                <label>CORREO *</label>
                <input 
                  type="email" 
                  name="correo"
                  value={nuevoEmpleado.correo}
                  onChange={handleInputChange}
                  placeholder="carlos@barberia.com"
                />
              </div>

              <div className="form-group">
                <label>PUESTO *</label>
                <select 
                  name="puesto"
                  value={nuevoEmpleado.puesto}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Barbero">Barbero</option>
                  <option value="Recepcionista">Recepcionista</option>
                </select>
              </div>

              <div className="form-group">
                <label>ROL</label>
                <select 
                  name="rol"
                  value={nuevoEmpleado.rol}
                  onChange={handleInputChange}
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>CONTRASEÑA {empleadoEditando ? '(Dejar vacío para mantener)' : '*'}</label>
                <div className="password-container">
                  <input 
                    type={mostrarPassword ? "text" : "password"}
                    name="password"
                    value={nuevoEmpleado.password}
                    onChange={handleInputChange}
                    placeholder={empleadoEditando ? "Nueva contraseña (opcional)" : "********"}
                  />
                  <button 
                    type="button"
                    className="btn-toggle-password"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                  >
                    {mostrarPassword ? "👁️" : "🔒"}
                  </button>
                </div>
                <span className="password-hint">Mínimo 8 caracteres</span>
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn-guardar" 
                onClick={handleGuardar}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              {empleadoEditando && (
                <button 
                  className="btn-eliminar" 
                  onClick={() => handleEliminar(empleadoEditando.id_empleado)}
                  disabled={loading}
                >
                  Eliminar
                </button>
              )}
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Buscador */}
        <div className="buscador-card">
          <div className="buscador-container">
            <label>Buscar empleado...</label>
            <div className="buscador-inputs">
              <input 
                type="text" 
                value={buscarTexto}
                onChange={(e) => setBuscarTexto(e.target.value)}
                placeholder="Nombre del empleado..."
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

        {/* Lista */}
        <div className="lista-section">
          <h3>LISTA DE EMPLEADOS {empleados.length > 0 && `(${empleados.length})`}</h3>
          
          <div className="table-responsive">
            <table className="empleados-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NOMBRE</th>
                  <th>TELÉFONO</th>
                  <th>CORREO</th>
                  <th>PUESTO</th>
                  <th>ROL</th>
                  <th>ACCESO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {loading && empleados.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Cargando empleados...
                    </td>
                  </tr>
                ) : empleadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No hay empleados registrados
                    </td>
                  </tr>
                ) : (
                  empleadosFiltrados.map((empleado, index) => (
                    <tr key={empleado.id_empleado}>
                      <td>{index + 1}</td>
                      <td>{empleado.nombre}</td>
                      <td>{empleado.telefono}</td>
                      <td>{empleado.correo}</td>
                      <td>
                        <span className={`cargo-badge ${empleado.puesto?.toLowerCase() || ''}`}>
                          {empleado.puesto}
                        </span>
                      </td>
                      <td>
                        <span className={`rol-badge ${empleado.rol === 'admin' ? 'admin' : 'empleado'}`}>
                          {empleado.rol || 'empleado'}
                        </span>
                      </td>
                      <td>
                        <span className={`acceso-badge ${empleado.activo ? 'activo' : 'inactivo'}`}>
                          {empleado.activo ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="acciones">
                          <button 
                            className="btn-edit" 
                            onClick={() => handleEditar(empleado)}
                            disabled={loading}
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleEliminar(empleado.id_empleado)}
                            disabled={loading}
                          >
                            🗑️
                          </button>
                          <button 
                            className={`btn-toggle ${empleado.activo ? 'btn-desactivar' : 'btn-activar'}`}
                            onClick={() => handleToggleStatus(empleado)}
                            disabled={loading}
                          >
                            {empleado.activo ? '🔴' : '🟢'}
                          </button>
                        </div>
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

export default Empleado;