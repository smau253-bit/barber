// Productos.jsx - VERSIÓN SIN BD (CON SIMULACIÓN)
import React, { useState, useEffect } from "react";
import "./producto.css";
import { Link } from "react-router-dom";
import axios from 'axios';

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
// Imágenes en Base64 (simuladas)
const IMAGEN_POR_DEFECTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3ESin imagen%3C/text%3E%3C/svg%3E";

let DATOS_SIMULADOS = {
  productos: [
    { 
      id_producto: 1, 
      nombre_producto: 'Cera para Cabello Profesional', 
      descripcion: 'Cera de alta fijación para estilos duraderos', 
      precio: 350.00, 
      stock: 15,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_producto: 2, 
      nombre_producto: 'Tijeras Profesionales', 
      descripcion: 'Tijeras de acero inoxidable japonés', 
      precio: 1200.00, 
      stock: 8,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_producto: 3, 
      nombre_producto: 'Aceite para Barba', 
      descripcion: 'Aceite natural con ingredientes orgánicos', 
      precio: 280.00, 
      stock: 20,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_producto: 4, 
      nombre_producto: 'Navaja de Afeitar Clásica', 
      descripcion: 'Navaja de acero carbono con mango de madera', 
      precio: 450.00, 
      stock: 5,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_producto: 5, 
      nombre_producto: 'Shampoo Fortalecedor', 
      descripcion: 'Shampoo con biotina y queratina', 
      precio: 320.00, 
      stock: 0,
      imagen: IMAGEN_POR_DEFECTO
    }
  ]
};

let contadorId = 6; // Para generar IDs automáticos

// ============================================
// 🟢 FUNCIONES SIMULADAS (SIN BD)
// ============================================

const cargarProductosSimulados = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: DATOS_SIMULADOS.productos
        }
      });
    }, 500);
  });
};

const guardarProductoSimulado = (producto, editando) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (editando) {
        // Actualizar
        const index = DATOS_SIMULADOS.productos.findIndex(p => p.id_producto === producto.id_producto);
        if (index !== -1) {
          DATOS_SIMULADOS.productos[index] = { ...DATOS_SIMULADOS.productos[index], ...producto };
          resolve({ data: { success: true, message: 'Producto actualizado' } });
        } else {
          reject({ response: { data: { message: 'Producto no encontrado' } } });
        }
      } else {
        // Crear nuevo
        const nuevo = {
          id_producto: contadorId++,
          ...producto
        };
        DATOS_SIMULADOS.productos.push(nuevo);
        resolve({ data: { success: true, message: 'Producto creado' } });
      }
    }, 500);
  });
};

const eliminarProductoSimulado = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = DATOS_SIMULADOS.productos.findIndex(p => p.id_producto === parseInt(id));
      if (index !== -1) {
        DATOS_SIMULADOS.productos.splice(index, 1);
        resolve({ data: { success: true, message: 'Producto eliminado' } });
      } else {
        reject({ response: { data: { message: 'Producto no encontrado' } } });
      }
    }, 500);
  });
};

const buscarProductoSimulado = (termino) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultados = DATOS_SIMULADOS.productos.filter(p => 
        p.nombre_producto.toLowerCase().includes(termino.toLowerCase())
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

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagen: ""
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  // ============================================
  // 🟡 FUNCIONES PRINCIPALES (CON SOPORTE BD)
  // ============================================

  const cargarProductos = async () => {
    setLoading(true);
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const response = await cargarProductosSimulados();
      if (response.data.success) {
        setProductos(response.data.data);
        setUsandoSimulacion(true);
      }
      
      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setProductos(response.data.data);
        setUsandoSimulacion(false);
      }
      */
      
    } catch (error) {
      console.error('Error:', error);
      // Si falla, usar datos simulados como respaldo
      const response = await cargarProductosSimulados();
      if (response.data.success) {
        setProductos(response.data.data);
        setUsandoSimulacion(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para convertir imagen a Base64
  const convertirImagenABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (2MB máximo para Base64)
      if (file.size > 2 * 1024 * 1024) {
        alert('⚠️ La imagen no debe superar 2MB');
        e.target.value = '';
        return;
      }
      
      try {
        const base64 = await convertirImagenABase64(file);
        setNuevoProducto({
          ...nuevoProducto,
          imagen: base64
        });
      } catch (error) {
        alert('❌ Error al leer la imagen');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]: value
    });
  };

  const handleGuardar = async () => {
    try {
      if (!nuevoProducto.nombre_producto || !nuevoProducto.nombre_producto.trim()) {
        alert('⚠️ El nombre del producto es obligatorio');
        return;
      }

      if (nuevoProducto.precio <= 0) {
        alert('⚠️ El precio debe ser mayor a 0');
        return;
      }

      setLoading(true);

      // ============================================
      // 🟢 PARTE 1: GUARDAR SIMULADO (SIN BD)
      // ============================================
      const productoData = {
        ...nuevoProducto,
        id_producto: productoEditando ? productoEditando.id_producto : null
      };
      
      const response = await guardarProductoSimulado(productoData, !!productoEditando);
      alert(response.data.success ? '✅ Producto guardado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      let response;
      if (productoEditando) {
        response = await axios.put(`${API_URL}/${productoEditando.id_producto}`, nuevoProducto);
        if (response.data.success) {
          alert('✅ Producto actualizado');
        }
      } else {
        response = await axios.post(API_URL, nuevoProducto);
        if (response.data.success) {
          alert('✅ Producto creado');
        }
      }
      */
      
      await cargarProductos();
      setNuevoProducto({ 
        nombre_producto: "", 
        descripcion: "", 
        precio: 0, 
        stock: 0,
        imagen: ""
      });
      setProductoEditando(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || '❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    
    try {
      setLoading(true);
      
      // ============================================
      // 🟢 PARTE 1: ELIMINAR SIMULADO (SIN BD)
      // ============================================
      const response = await eliminarProductoSimulado(id);
      alert(response.data.success ? '✅ Producto eliminado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Producto eliminado');
      }
      */
      
      await cargarProductos();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setNuevoProducto({
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen || ""
    });
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setNuevoProducto({ 
      nombre_producto: "", 
      descripcion: "", 
      precio: 0, 
      stock: 0,
      imagen: ""
    });
    setProductoEditando(null);
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
      const response = await buscarProductoSimulado(buscarTexto);

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.get(`${API_URL}/search?termino=${buscarTexto}`);
      */
      
      if (response.data.success) {
        if (response.data.data.length > 0) {
          alert(`📋 Encontrados: ${response.data.data.length} producto(s)`);
        } else {
          alert("No se encontraron productos");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al buscar');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async () => {
    setBuscarTexto("");
    await cargarProductos();
    alert("✅ Lista actualizada");
  };

  const productosFiltrados = buscarTexto 
    ? productos.filter(p => p.nombre_producto.toLowerCase().includes(buscarTexto.toLowerCase()))
    : productos;

  return (
    <div className="productos-container">
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
            <li className="active">Productos</li>
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

      <main className="main-content">
        <header className="top-header">
          <h2>
            PRODUCTOS {loading && <span>⏳</span>}
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
              setProductoEditando(null);
              setNuevoProducto({ 
                nombre_producto: "", 
                descripcion: "", 
                precio: 0, 
                stock: 0,
                imagen: ""
              });
            }}
          >
            + Nuevo Producto
          </button>
        </header>

        {mostrarFormulario && (
          <div className="formulario-card">
            <h3>{productoEditando ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}</h3>
            {usandoSimulacion && (
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                🔄 Modo demostración - Los datos se guardan en memoria
              </p>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label>ID PRODUCTO</label>
                <input 
                  type="text" 
                  value={productoEditando ? productoEditando.id_producto : "(auto)"} 
                  disabled 
                  className="id-disabled"
                />
              </div>

              <div className="form-group">
                <label>NOMBRE *</label>
                <input 
                  type="text" 
                  name="nombre_producto"
                  value={nuevoProducto.nombre_producto}
                  onChange={handleInputChange}
                  placeholder="Cera para cabello"
                />
              </div>

              <div className="form-group full-width">
                <label>DESCRIPCIÓN</label>
                <input 
                  type="text" 
                  name="descripcion"
                  value={nuevoProducto.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción breve"
                />
              </div>

              <div className="form-group">
                <label>PRECIO ($) *</label>
                <input 
                  type="number" 
                  name="precio"
                  value={nuevoProducto.precio}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>STOCK</label>
                <input 
                  type="number" 
                  name="stock"
                  value={nuevoProducto.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* CAMPO DE IMAGEN SIMPLIFICADO */}
              <div className="form-group full-width">
                <label>IMAGEN DEL PRODUCTO</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                
                {/* Vista previa de la imagen */}
                {nuevoProducto.imagen && (
                  <div className="image-preview">
                    <p>Vista previa:</p>
                    <img 
                      src={nuevoProducto.imagen} 
                      alt="Vista previa" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        marginTop: '10px',
                        borderRadius: '8px',
                        border: '2px solid #ddd'
                      }}
                    />
                    <button 
                      onClick={() => setNuevoProducto({...nuevoProducto, imagen: ""})}
                      style={{ 
                        marginTop: '10px',
                        padding: '5px 15px',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar imagen
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-guardar" onClick={handleGuardar} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              {productoEditando && (
                <button className="btn-eliminar" onClick={() => handleEliminar(productoEditando.id_producto)} disabled={loading}>
                  Eliminar
                </button>
              )}
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="buscador-card">
          <div className="buscador-container">
            <label>Buscar producto...</label>
            <div className="buscador-inputs">
              <input 
                type="text" 
                value={buscarTexto}
                onChange={(e) => setBuscarTexto(e.target.value)}
                placeholder="Nombre del producto..."
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

        <div className="lista-section">
          <h3>LISTA DE PRODUCTOS {productos.length > 0 && `(${productos.length})`}</h3>
          
          <div className="table-responsive">
            <table className="productos-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>IMAGEN</th>
                  <th>PRODUCTO</th>
                  <th className="hide-mobile">DESCRIPCIÓN</th>
                  <th>PRECIO</th>
                  <th>STOCK</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {loading && productos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">Cargando productos...</td>
                  </tr>
                ) : productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No hay productos registrados</td>
                  </tr>
                ) : (
                  productosFiltrados.map((producto, index) => (
                    <tr key={producto.id_producto}>
                      <td>{index + 1}</td>
                      <td>
                        {producto.imagen && producto.imagen !== IMAGEN_POR_DEFECTO ? (
                          <img 
                            src={producto.imagen} 
                            alt={producto.nombre_producto}
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              border: '1px solid #eee'
                            }}
                          />
                        ) : (
                          <span style={{ color: '#999', fontSize: '12px' }}>Sin imagen</span>
                        )}
                      </td>
                      <td>{producto.nombre_producto}</td>
                      <td className="hide-mobile">{producto.descripcion || '-'}</td>
                      <td>${parseFloat(producto.precio).toFixed(2)}</td>
                      <td>
                        <span style={{ 
                          color: producto.stock > 0 ? '#28a745' : '#dc3545',
                          fontWeight: 'bold'
                        }}>
                          {producto.stock}
                        </span>
                      </td>
                      <td>
                        <div className="acciones">
                          <button className="btn-edit" onClick={() => handleEditar(producto)} disabled={loading}>
                            ✏️
                          </button>
                          <button className="btn-delete" onClick={() => handleEliminar(producto.id_producto)} disabled={loading}>
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

export default Producto;