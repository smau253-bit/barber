// Ventas.jsx - VERSIÓN CON BACKEND
import React, { useState, useEffect } from "react";
import "./Ventas.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ventas';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventaEditando, setVentaEditando] = useState(null);
  const [buscarTexto, setBuscarTexto] = useState("");

  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: "",
    fecha: new Date().toISOString().split('T')[0],
    productos: [],
    total: 0,
    estado: "Completada"
  });

  const [productoActual, setProductoActual] = useState({
    id_producto: "",
    nombre: "",
    cantidad: 1,
    precio: 0
  });

  // Cargar datos al iniciar
  useEffect(() => {
    cargarVentas();
    cargarSelectores();
  }, []);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setVentas(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando ventas:', error);
      alert('❌ Error al cargar ventas');
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

      // Cargar productos
      const productosRes = await axios.get(`${API_URL}/productos`);
      if (productosRes.data.success) {
        setProductos(productosRes.data.data);
      }
    } catch (error) {
      console.error('Error cargando selectores:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaVenta({
      ...nuevaVenta,
      [name]: value
    });
  };

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'id_producto') {
      const productoSeleccionado = productos.find(p => p.id_producto === parseInt(value));
      setProductoActual({
        ...productoActual,
        id_producto: value,
        nombre: productoSeleccionado?.nombre_producto || '',
        precio: productoSeleccionado?.precio || 0
      });
    } else {
      setProductoActual({
        ...productoActual,
        [name]: name === 'cantidad' ? parseInt(value) || 1 : value
      });
    }
  };

  const agregarProducto = () => {
    if (!productoActual.id_producto || productoActual.cantidad <= 0) {
      alert("Selecciona un producto y cantidad válida");
      return;
    }

    // Verificar stock
    const producto = productos.find(p => p.id_producto === parseInt(productoActual.id_producto));
    if (producto && producto.stock < productoActual.cantidad) {
      alert(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles`);
      return;
    }

    const nuevoProducto = {
      id_producto: parseInt(productoActual.id_producto),
      nombre: productoActual.nombre,
      cantidad: productoActual.cantidad,
      precio: productoActual.precio
    };

    const nuevosProductos = [...nuevaVenta.productos, nuevoProducto];
    const nuevoTotal = nuevosProductos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);

    setNuevaVenta({
      ...nuevaVenta,
      productos: nuevosProductos,
      total: nuevoTotal
    });

    setProductoActual({
      id_producto: "",
      nombre: "",
      cantidad: 1,
      precio: 0
    });
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = nuevaVenta.productos.filter((_, i) => i !== index);
    const nuevoTotal = nuevosProductos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);

    setNuevaVenta({
      ...nuevaVenta,
      productos: nuevosProductos,
      total: nuevoTotal
    });
  };

  const handleGuardar = async () => {
    try {
      if (!nuevaVenta.id_cliente) {
        alert('⚠️ Selecciona un cliente');
        return;
      }

      if (nuevaVenta.productos.length === 0) {
        alert('⚠️ Agrega al menos un producto');
        return;
      }

      setLoading(true);

      const dataToSend = {
        id_cliente: parseInt(nuevaVenta.id_cliente),
        fecha: nuevaVenta.fecha,
        productos: nuevaVenta.productos,
        total: nuevaVenta.total,
        estado: nuevaVenta.estado || "Completada"
      };

      const response = await axios.post(API_URL, dataToSend);
      if (response.data.success) {
        alert('✅ Venta registrada exitosamente');
        await cargarVentas();
        handleCancelar();
      }
    } catch (error) {
      console.error('Error guardando:', error);
      alert(error.response?.data?.message || '❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta venta?")) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Venta eliminada');
        await cargarVentas();
      }
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('❌ Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setNuevaVenta({ id_cliente: "", fecha: new Date().toISOString().split('T')[0], productos: [], total: 0, estado: "Completada" });
    setVentaEditando(null);
    setMostrarFormulario(false);
    setProductoActual({ id_producto: "", nombre: "", cantidad: 1, precio: 0 });
  };

  const handleBuscar = async () => {
    if (buscarTexto.trim() === "") {
      alert("Ingresa un nombre de cliente para buscar");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/search?termino=${buscarTexto}`);
      if (response.data.success) {
        if (response.data.data.length > 0) {
          alert(`📋 Ventas encontradas:\n${response.data.data.map(v => `- ${v.cliente}: $${v.total}`).join("\n")}`);
        } else {
          alert("No se encontraron ventas para ese cliente");
        }
      }
    } catch (error) {
      console.error('Error buscando:', error);
      alert('❌ Error al buscar');
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = (venta) => {
    const productosStr = venta.productos.map(p => 
      `- ${p.nombre} x ${p.cantidad} = $${p.cantidad * p.precio}`
    ).join('\n');
    
    alert(
      `📋 DETALLE DE VENTA\n` +
      `ID: #${venta.id_venta}\n` +
      `Cliente: ${venta.cliente}\n` +
      `Fecha: ${venta.fecha}\n` +
      `Total: $${venta.total}\n` +
      `Estado: ${venta.estado}\n\n` +
      `PRODUCTOS:\n${productosStr}`
    );
  };

  const ventasFiltradas = buscarTexto 
    ? ventas.filter(v => v.cliente?.toLowerCase().includes(buscarTexto.toLowerCase()))
    : ventas;

  return (
    <div className="ventas-container">
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
            <Link to="/citas"><li>Citas</li></Link>
            <Link to="/servicio"><li>Servicios</li></Link>
            <Link to="/producto"><li>Productos</li></Link>
            <li className="active">Ventas</li>
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
          <h2>VENTAS {loading && <span>⏳</span>}</h2>
          <button 
            className="btn-nuevo"
            onClick={() => {
              setMostrarFormulario(true);
              setVentaEditando(null);
              setNuevaVenta({ id_cliente: "", fecha: new Date().toISOString().split('T')[0], productos: [], total: 0, estado: "Completada" });
              setProductoActual({ id_producto: "", nombre: "", cantidad: 1, precio: 0 });
            }}
          >
            + Nueva Venta
          </button>
        </header>

        {/* FORMULARIO */}
        {mostrarFormulario && (
          <div className="formulario-card">
            <h3>NUEVA VENTA</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>ID VENTA</label>
                <input 
                  type="text" 
                  value="(auto)" 
                  disabled 
                  className="id-disabled"
                />
              </div>

              <div className="form-group">
                <label>FECHA</label>
                <input 
                  type="date" 
                  name="fecha"
                  value={nuevaVenta.fecha}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label>CLIENTE *</label>
                <select 
                  name="id_cliente"
                  value={nuevaVenta.id_cliente}
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

              <div className="form-group full-width">
                <label>PRODUCTOS</label>
                <div className="producto-form">
                  <div className="producto-row">
                    <div className="producto-field">
                      <label>PRODUCTO</label>
                      <select 
                        name="id_producto"
                        value={productoActual.id_producto}
                        onChange={handleProductoChange}
                      >
                        <option value="">Seleccionar...</option>
                        {productos.map(producto => (
                          <option key={producto.id_producto} value={producto.id_producto}>
                            {producto.nombre_producto} (Stock: {producto.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="producto-field">
                      <label>CANTIDAD</label>
                      <input 
                        type="number" 
                        name="cantidad"
                        value={productoActual.cantidad}
                        onChange={handleProductoChange}
                        min="1"
                      />
                    </div>
                    <div className="producto-field">
                      <label>PRECIO ($)</label>
                      <input 
                        type="number" 
                        name="precio"
                        value={productoActual.precio}
                        disabled
                      />
                    </div>
                    <div className="producto-field">
                      <button 
                        className="btn-agregar-producto"
                        onClick={agregarProducto}
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de productos agregados */}
                {nuevaVenta.productos.length > 0 && (
                  <div className="productos-agregados">
                    <h4>Productos agregados:</h4>
                    <ul>
                      {nuevaVenta.productos.map((producto, index) => (
                        <li key={index}>
                          <span>
                            {producto.nombre} x {producto.cantidad} = ${producto.cantidad * producto.precio}
                          </span>
                          <button 
                            className="btn-eliminar-producto"
                            onClick={() => eliminarProducto(index)}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="total-productos">
                      <strong>TOTAL: ${nuevaVenta.total}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-guardar" onClick={handleGuardar} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* BUSCADOR */}
        <div className="buscador-card">
          <div className="buscador-container">
            <label>Buscar por cliente...</label>
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
              <button className="btn-actualizar" onClick={() => setBuscarTexto("")}>
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* HISTORIAL DE VENTAS */}
        <div className="lista-section">
          <h3>HISTORIAL DE VENTAS {ventas.length > 0 && `(${ventas.length})`}</h3>
          
          <div className="table-responsive">
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>FECHA</th>
                  <th>CLIENTE</th>
                  <th>PRODUCTOS</th>
                  <th>TOTAL</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {loading && ventas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Cargando ventas...
                    </td>
                  </tr>
                ) : ventasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay ventas registradas
                    </td>
                  </tr>
                ) : (
                  ventasFiltradas.map((venta, index) => (
                    <tr key={venta.id_venta}>
                      <td>{index + 1}</td>
                      <td>{venta.fecha}</td>
                      <td>{venta.cliente || 'Cliente eliminado'}</td>
                      <td>{venta.productos?.length || 0} productos</td>
                      <td className="precio-total">${venta.total}</td>
                      <td>
                        <span className={`estado-badge ${venta.estado?.toLowerCase() || 'completada'}`}>
                          {venta.estado || 'Completada'}
                        </span>
                      </td>
                      <td>
                        <div className="acciones">
                          <button 
                            className="btn-detalle"
                            onClick={() => verDetalle(venta)}
                            disabled={loading}
                          >
                            📋
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleEliminar(venta.id_venta)}
                            disabled={loading}
                          >
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

export default Ventas;