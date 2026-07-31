// Clientes.jsx - VERSIÓN SIN BD (CON SIMULACIÓN)
import React, { useState, useEffect } from "react";
import "./clientes.css";
import { Link } from "react-router-dom";
import axios from 'axios';

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
let DATOS_SIMULADOS = {
  clientes: [
    { id_cliente: 1, nombre: 'Juan Pérez', telefono: '722 123 4567', correo: 'juan@email.com' },
    { id_cliente: 2, nombre: 'María García', telefono: '722 234 5678', correo: 'maria@email.com' },
    { id_cliente: 3, nombre: 'Pedro Rodríguez', telefono: '722 345 6789', correo: 'pedro@email.com' },
    { id_cliente: 4, nombre: 'Laura Sánchez', telefono: '722 456 7890', correo: 'laura@email.com' },
    { id_cliente: 5, nombre: 'Diego Ramírez', telefono: '722 567 8901', correo: 'diego@email.com' },
    { id_cliente: 6, nombre: 'Sofía Torres', telefono: '722 678 9012', correo: 'sofia@email.com' },
    { id_cliente: 7, nombre: 'Carlos Mendoza', telefono: '722 789 0123', correo: '' },
    { id_cliente: 8, nombre: 'Ana Flores', telefono: '', correo: 'ana@email.com' },
  ]
};

let contadorId = 9; // Para generar IDs automáticos

// ============================================
// 🟢 FUNCIONES SIMULADAS (SIN BD)
// ============================================

const cargarClientesSimulados = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: DATOS_SIMULADOS.clientes
        }
      });
    }, 500);
  });
};

const guardarClienteSimulado = (cliente, editando) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (editando) {
        // Actualizar
        const index = DATOS_SIMULADOS.clientes.findIndex(c => c.id_cliente === cliente.id_cliente);
        if (index !== -1) {
          DATOS_SIMULADOS.clientes[index] = { ...DATOS_SIMULADOS.clientes[index], ...cliente };
          resolve({ data: { success: true, message: 'Cliente actualizado' } });
        } else {
          reject({ response: { data: { message: 'Cliente no encontrado' } } });
        }
      } else {
        // Crear nuevo
        const nuevo = {
          id_cliente: contadorId++,
          ...cliente
        };
        DATOS_SIMULADOS.clientes.push(nuevo);
        resolve({ data: { success: true, message: 'Cliente creado' } });
      }
    }, 500);
  });
};

const eliminarClienteSimulado = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = DATOS_SIMULADOS.clientes.findIndex(c => c.id_cliente === parseInt(id));
      if (index !== -1) {
        DATOS_SIMULADOS.clientes.splice(index, 1);
        resolve({ data: { success: true, message: 'Cliente eliminado' } });
      } else {
        reject({ response: { data: { message: 'Cliente no encontrado' } } });
      }
    }, 500);
  });
};

const buscarClienteSimulado = (termino) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultados = DATOS_SIMULADOS.clientes.filter(c => 
        c.nombre.toLowerCase().includes(termino.toLowerCase())
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

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    correo: ""
  });

  // Cargar clientes al iniciar
  useEffect(() => {
    cargarClientes();
  }, []);

  // ============================================
  // 🟡 FUNCIONES PRINCIPALES (CON SOPORTE BD)
  // ============================================

  const cargarClientes = async () => {
    setLoading(true);
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const response = await cargarClientesSimulados();
      if (response.data.success) {
        setClientes(response.data.data);
        setUsandoSimulacion(true);
      }
      
      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setClientes(response.data.data);
        setUsandoSimulacion(false);
      } else {
        alert('❌ ' + response.data.message);
      }
      */
      
    } catch (error) {
      console.error('Error cargando clientes:', error);
      // Si falla, usar datos simulados como respaldo
      const response = await cargarClientesSimulados();
      if (response.data.success) {
        setClientes(response.data.data);
        setUsandoSimulacion(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente({
      ...nuevoCliente,
      [name]: value
    });
  };

  const handleGuardar = async () => {
    try {
      // Validaciones - Solo el nombre es obligatorio
      if (!nuevoCliente.nombre || !nuevoCliente.nombre.trim()) {
        alert('⚠️ El nombre es obligatorio');
        return;
      }

      // Validar correo solo si se proporcionó
      if (nuevoCliente.correo && nuevoCliente.correo.trim() && !nuevoCliente.correo.includes('@')) {
        alert('⚠️ Ingresa un correo válido');
        return;
      }

      setLoading(true);

      // ============================================
      // 🟢 PARTE 1: GUARDAR SIMULADO (SIN BD)
      // ============================================
      const clienteData = {
        ...nuevoCliente,
        id_cliente: clienteEditando ? clienteEditando.id_cliente : null
      };
      
      const response = await guardarClienteSimulado(clienteData, !!clienteEditando);
      alert(response.data.success ? '✅ Cliente guardado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      let response;
      if (clienteEditando) {
        response = await axios.put(`${API_URL}/${clienteEditando.id_cliente}`, nuevoCliente);
        if (response.data.success) {
          alert('✅ Cliente actualizado');
        }
      } else {
        response = await axios.post(API_URL, nuevoCliente);
        if (response.data.success) {
          alert('✅ Cliente creado');
        }
      }
      */
      
      await cargarClientes();
      setNuevoCliente({ nombre: "", telefono: "", correo: "" });
      setClienteEditando(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error guardando:', error);
      alert(error.response?.data?.message || '❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    
    try {
      setLoading(true);
      
      // ============================================
      // 🟢 PARTE 1: ELIMINAR SIMULADO (SIN BD)
      // ============================================
      const response = await eliminarClienteSimulado(id);
      alert(response.data.success ? '✅ Cliente eliminado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Cliente eliminado');
      }
      */
      
      await cargarClientes();
      setMostrarFormulario(false);
      setClienteEditando(null);
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('❌ Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setNuevoCliente({
      nombre: cliente.nombre || "",
      telefono: cliente.telefono || "",
      correo: cliente.correo || ""
    });
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setNuevoCliente({ nombre: "", telefono: "", correo: "" });
    setClienteEditando(null);
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
      const response = await buscarClienteSimulado(buscarTexto);

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.get(`${API_URL}/search?termino=${buscarTexto}`);
      */
      
      if (response.data.success) {
        if (response.data.data.length > 0) {
          alert(`📋 Clientes encontrados:\n${response.data.data.map(c => `- ${c.nombre}`).join("\n")}`);
        } else {
          alert("No se encontraron clientes");
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
    await cargarClientes();
    alert("✅ Lista actualizada");
  };

  const clientesFiltrados = buscarTexto 
    ? clientes.filter(c => c.nombre.toLowerCase().includes(buscarTexto.toLowerCase()))
    : clientes;

  return (
    <div className="clientes-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <h1>SHELBY</h1>
          <span className="barrier">BARBER</span>
        </div>

        <nav className="nav-menu">
          <ul>
            <Link to="/dashboard"><li>Inicio</li></Link>
            <li className="active">Clientes</li>
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
        {/* HEADER */}
        <header className="top-header">
          <h2>
            CLIENTES {loading && <span>⏳</span>}
            {!loading && usandoSimulacion && (
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
             
              </span>
            )}
          </h2>
          <button 
            className="btn-nuevo"
            onClick={() => {
              setMostrarFormulario(true);
              setClienteEditando(null);
              setNuevoCliente({ nombre: "", telefono: "", correo: "" });
            }}
          >
            + Nuevo Cliente
          </button>
        </header>

        {/* FORMULARIO */}
        {mostrarFormulario && (
          <div className="formulario-card">
            <h3>{clienteEditando ? "EDITAR CLIENTE" : "NUEVO CLIENTE"}</h3>
            {usandoSimulacion && (
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
       
              </p>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label>ID CLIENTE</label>
                <input 
                  type="text" 
                  value={clienteEditando ? clienteEditando.id_cliente : "(auto)"} 
                  disabled 
                  className="id-disabled"
                />
              </div>

              <div className="form-group">
                <label>NOMBRE *</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={nuevoCliente.nombre}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="form-group">
                <label>TELÉFONO</label>
                <input 
                  type="text" 
                  name="telefono"
                  value={nuevoCliente.telefono}
                  onChange={handleInputChange}
                  placeholder="722 123 4567"
                />
              </div>

              <div className="form-group">
                <label>CORREO</label>
                <input 
                  type="email" 
                  name="correo"
                  value={nuevoCliente.correo}
                  onChange={handleInputChange}
                  placeholder="cliente@email.com"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-guardar" onClick={handleGuardar} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              {clienteEditando && (
                <button className="btn-eliminar" onClick={() => handleEliminar(clienteEditando.id_cliente)} disabled={loading}>
                  Eliminar
                </button>
              )}
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* BUSCADOR */}
        <div className="buscador-card">
          <div className="buscador-container">
            <label>Buscar cliente...</label>
            <div className="buscador-inputs">
              <input 
                type="text" 
                value={buscarTexto}
                onChange={(e) => setBuscarTexto(e.target.value)}
                placeholder="Nombre del cliente..."
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

        {/* LISTA DE CLIENTES */}
        <div className="lista-section">
          <h3>LISTA DE CLIENTES {clientes.length > 0 && `(${clientes.length})`}</h3>
          
          <div className="table-responsive">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NOMBRE</th>
                  <th>TELÉFONO</th>
                  <th className="hide-mobile">CORREO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {loading && clientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Cargando clientes...
                    </td>
                  </tr>
                ) : clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay clientes registrados
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente, index) => (
                    <tr key={cliente.id_cliente}>
                      <td>{index + 1}</td>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.telefono || '-'}</td>
                      <td className="hide-mobile">{cliente.correo || '-'}</td>
                      <td>
                        <div className="acciones">
                          <button className="btn-edit" onClick={() => handleEditar(cliente)} disabled={loading}>
                            ✏️
                          </button>
                          <button className="btn-delete" onClick={() => handleEliminar(cliente.id_cliente)} disabled={loading}>
                            🗑️
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

export default Clientes;