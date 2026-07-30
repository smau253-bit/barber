// Clientes.jsx - VERSIÓN ACTUALIZADA
import React, { useState, useEffect } from "react";
import "./Clientes.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clientes';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [buscarTexto, setBuscarTexto] = useState("");

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    correo: ""
  });

  // Cargar clientes al iniciar
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setClientes(response.data.data);
      } else {
        alert('❌ ' + response.data.message);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
      alert('❌ Error al cargar clientes');
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

      let response;
      if (clienteEditando) {
        // Actualizar
        response = await axios.put(`${API_URL}/${clienteEditando.id_cliente}`, nuevoCliente);
        if (response.data.success) {
          alert('✅ Cliente actualizado');
        }
      } else {
        // Crear
        response = await axios.post(API_URL, nuevoCliente);
        if (response.data.success) {
          alert('✅ Cliente creado');
        }
      }
      
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
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Cliente eliminado');
        await cargarClientes();
        setMostrarFormulario(false);
        setClienteEditando(null);
      }
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
      const response = await axios.get(`${API_URL}/search?termino=${buscarTexto}`);
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
          <h2>CLIENTES {loading && <span>⏳</span>}</h2>
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