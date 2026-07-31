// Servicios.jsx - VERSIÓN SIN BD (CON SIMULACIÓN)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./servicio2.css";

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
// Imagen por defecto en Base64 (SVG simple)
const IMAGEN_POR_DEFECTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EServicio%3C/text%3E%3C/svg%3E";

let DATOS_SIMULADOS = {
  servicios: [
    { 
      id_servicio: 1, 
      nombre_servicio: 'Corte de Cabello Premium', 
      descripcion: 'Corte con técnica de tijera y máquina. Incluye lavado y styling.', 
      precio: 350.00,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_servicio: 2, 
      nombre_servicio: 'Barba y Bigote', 
      descripcion: 'Perfilado y recorte de barba con aceite y bálsamo.', 
      precio: 250.00,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_servicio: 3, 
      nombre_servicio: 'Tinte de Cabello', 
      descripcion: 'Coloración profesional con productos de alta calidad.', 
      precio: 550.00,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_servicio: 4, 
      nombre_servicio: 'Tratamiento Capilar', 
      descripcion: 'Tratamiento con keratina y vitaminas para cabello dañado.', 
      precio: 480.00,
      imagen: IMAGEN_POR_DEFECTO
    },
    { 
      id_servicio: 5, 
      nombre_servicio: 'Combo Corte + Barba', 
      descripcion: 'Paquete completo de corte y arreglo de barba.', 
      precio: 520.00,
      imagen: IMAGEN_POR_DEFECTO
    }
  ]
};

let contadorId = 6; // Para generar IDs automáticos

// ============================================
// 🟢 FUNCIONES SIMULADAS (SIN BD)
// ============================================

const cargarServiciosSimulados = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: DATOS_SIMULADOS.servicios
        }
      });
    }, 500);
  });
};

const guardarServicioSimulado = (servicio, editando) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (editando) {
        // Actualizar
        const index = DATOS_SIMULADOS.servicios.findIndex(s => s.id_servicio === servicio.id_servicio);
        if (index !== -1) {
          DATOS_SIMULADOS.servicios[index] = { ...DATOS_SIMULADOS.servicios[index], ...servicio };
          resolve({ data: { success: true, message: 'Servicio actualizado' } });
        } else {
          reject({ response: { data: { message: 'Servicio no encontrado' } } });
        }
      } else {
        // Crear nuevo
        const nuevo = {
          id_servicio: contadorId++,
          ...servicio
        };
        DATOS_SIMULADOS.servicios.push(nuevo);
        resolve({ data: { success: true, message: 'Servicio creado' } });
      }
    }, 500);
  });
};

const eliminarServicioSimulado = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = DATOS_SIMULADOS.servicios.findIndex(s => s.id_servicio === parseInt(id));
      if (index !== -1) {
        DATOS_SIMULADOS.servicios.splice(index, 1);
        resolve({ data: { success: true, message: 'Servicio eliminado' } });
      } else {
        reject({ response: { data: { message: 'Servicio no encontrado' } } });
      }
    }, 500);
  });
};

const buscarServicioSimulado = (termino) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultados = DATOS_SIMULADOS.servicios.filter(s => 
        s.nombre_servicio.toLowerCase().includes(termino.toLowerCase())
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

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);

  const [nuevoServicio, setNuevoServicio] = useState({
    nombre_servicio: "",
    descripcion: "",
    precio: 0,
    imagen: ""
  });

  // Cargar servicios al iniciar
  useEffect(() => {
    cargarServicios();
  }, []);

  // ============================================
  // 🟡 FUNCIONES PRINCIPALES (CON SOPORTE BD)
  // ============================================

  const cargarServicios = async () => {
    setLoading(true);
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const response = await cargarServiciosSimulados();
      if (response.data.success) {
        setServicios(response.data.data);
        setUsandoSimulacion(true);
      }
      
      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setServicios(response.data.data);
        setUsandoSimulacion(false);
      } else {
        alert('❌ ' + response.data.message);
      }
      */
      
    } catch (error) {
      console.error('Error cargando servicios:', error);
      // Si falla, usar datos simulados como respaldo
      const response = await cargarServiciosSimulados();
      if (response.data.success) {
        setServicios(response.data.data);
        setUsandoSimulacion(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES PARA MANEJAR LA IMAGEN
  // ============================================
  
  // Convertir imagen a Base64
  const convertirImagenABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Manejar cambio de imagen
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        alert('⚠️ La imagen no debe superar 2MB');
        e.target.value = '';
        return;
      }
      
      try {
        const base64 = await convertirImagenABase64(file);
        setNuevoServicio({
          ...nuevoServicio,
          imagen: base64
        });
      } catch (error) {
        alert('❌ Error al leer la imagen');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoServicio({
      ...nuevoServicio,
      [name]: value
    });
  };

  const handleGuardar = async () => {
    try {
      // Validaciones
      if (!nuevoServicio.nombre_servicio || !nuevoServicio.nombre_servicio.trim()) {
        alert('⚠️ El nombre del servicio es obligatorio');
        return;
      }

      if (nuevoServicio.precio <= 0) {
        alert('⚠️ El precio debe ser mayor a 0');
        return;
      }

      setLoading(true);

      // ============================================
      // 🟢 PARTE 1: GUARDAR SIMULADO (SIN BD)
      // ============================================
      const servicioData = {
        ...nuevoServicio,
        id_servicio: servicioEditando ? servicioEditando.id_servicio : null
      };
      
      const response = await guardarServicioSimulado(servicioData, !!servicioEditando);
      alert(response.data.success ? '✅ Servicio guardado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const datosServicio = {
        nombre_servicio: nuevoServicio.nombre_servicio,
        descripcion: nuevoServicio.descripcion,
        precio: nuevoServicio.precio,
        imagen: nuevoServicio.imagen || null
      };

      let response;
      if (servicioEditando) {
        response = await axios.put(`${API_URL}/${servicioEditando.id_servicio}`, datosServicio);
        if (response.data.success) {
          alert('✅ Servicio actualizado');
        }
      } else {
        response = await axios.post(API_URL, datosServicio);
        if (response.data.success) {
          alert('✅ Servicio creado');
        }
      }
      */
      
      await cargarServicios();
      setNuevoServicio({ 
        nombre_servicio: "", 
        descripcion: "", 
        precio: 0,
        imagen: ""
      });
      setServicioEditando(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error guardando:', error);
      alert(error.response?.data?.message || '❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    
    try {
      setLoading(true);
      
      // ============================================
      // 🟢 PARTE 1: ELIMINAR SIMULADO (SIN BD)
      // ============================================
      const response = await eliminarServicioSimulado(id);
      alert(response.data.success ? '✅ Servicio eliminado' : '❌ Error');

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        alert('✅ Servicio eliminado');
      }
      */
      
      await cargarServicios();
      setMostrarFormulario(false);
      setServicioEditando(null);
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('❌ Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (servicio) => {
    setServicioEditando(servicio);
    setNuevoServicio({
      nombre_servicio: servicio.nombre_servicio,
      descripcion: servicio.descripcion || "",
      precio: servicio.precio,
      imagen: servicio.imagen || ""
    });
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setNuevoServicio({ 
      nombre_servicio: "", 
      descripcion: "", 
      precio: 0,
      imagen: ""
    });
    setServicioEditando(null);
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
      const response = await buscarServicioSimulado(buscarTexto);

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // ============================================
      
      /*
      const response = await axios.get(`${API_URL}/search?termino=${buscarTexto}`);
      */
      
      if (response.data.success) {
        if (response.data.data.length > 0) {
          alert(`📋 Encontrados:\n${response.data.data.map(s => `- ${s.nombre_servicio}`).join("\n")}`);
        } else {
          alert("No se encontraron servicios");
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
    await cargarServicios();
    alert("✅ Lista actualizada");
  };

  const serviciosFiltrados = buscarTexto 
    ? servicios.filter(s => s.nombre_servicio.toLowerCase().includes(buscarTexto.toLowerCase()))
    : servicios;

  return (
    <div className="servicios-container">
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
            <li className="active">Servicios</li>
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
            SERVICIOS {loading && <span>⏳</span>}
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
              setServicioEditando(null);
              setNuevoServicio({ 
                nombre_servicio: "", 
                descripcion: "", 
                precio: 0,
                imagen: ""
              });
            }}
          >
            + Nuevo Servicio
          </button>
        </header>

        {/* FORMULARIO */}
        {mostrarFormulario && (
          <div className="formulario-card">
            <h3>{servicioEditando ? "EDITAR SERVICIO" : "NUEVO SERVICIO"}</h3>
            {usandoSimulacion && (
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                🔄 Modo demostración - Los datos se guardan en memoria
              </p>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label>ID SERVICIO</label>
                <input 
                  type="text" 
                  value={servicioEditando ? servicioEditando.id_servicio : "(auto)"} 
                  disabled 
                  className="id-disabled"
                />
              </div>

              <div className="form-group">
                <label>NOMBRE *</label>
                <input 
                  type="text" 
                  name="nombre_servicio"
                  value={nuevoServicio.nombre_servicio}
                  onChange={handleInputChange}
                  placeholder="Corte clásico"
                />
              </div>

              <div className="form-group full-width">
                <label>DESCRIPCIÓN</label>
                <input 
                  type="text" 
                  name="descripcion"
                  value={nuevoServicio.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción breve"
                />
              </div>

              <div className="form-group">
                <label>PRECIO ($) *</label>
                <input 
                  type="number" 
                  name="precio"
                  value={nuevoServicio.precio}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* CAMPO DE IMAGEN */}
              <div className="form-group full-width">
                <label>IMAGEN DEL SERVICIO</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                
                {/* Vista previa de la nueva imagen */}
                {nuevoServicio.imagen && nuevoServicio.imagen.startsWith('data:image') && (
                  <div className="image-preview">
                    <p>Vista previa:</p>
                    <img 
                      src={nuevoServicio.imagen} 
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
                      onClick={() => setNuevoServicio({...nuevoServicio, imagen: ""})}
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
                
                {/* Imagen actual (en modo edición) */}
                {servicioEditando && servicioEditando.imagen && !nuevoServicio.imagen && (
                  <div className="current-image">
                    <p>Imagen actual:</p>
                    <img 
                      src={servicioEditando.imagen} 
                      alt="Imagen actual" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        marginTop: '10px', 
                        borderRadius: '8px',
                        border: '2px solid #ddd'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-guardar" onClick={handleGuardar} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              {servicioEditando && (
                <button 
                  className="btn-eliminar" 
                  onClick={() => handleEliminar(servicioEditando.id_servicio)}
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

        {/* BUSCADOR */}
        <div className="buscador-card">
          <div className="buscador-container">
            <label>Buscar servicio...</label>
            <div className="buscador-inputs">
              <input 
                type="text" 
                value={buscarTexto}
                onChange={(e) => setBuscarTexto(e.target.value)}
                placeholder="Nombre del servicio..."
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

        {/* CATÁLOGO DE SERVICIOS */}
        <div className="catalogo-section">
          <h3>CATÁLOGO DE SERVICIOS {servicios.length > 0 && `(${servicios.length})`}</h3>
          
          {loading && servicios.length === 0 ? (
            <div className="loading-message">Cargando servicios...</div>
          ) : serviciosFiltrados.length === 0 ? (
            <div className="empty-message">No hay servicios registrados</div>
          ) : (
            <div className="servicios-grid">
              {serviciosFiltrados.map((servicio) => (
                <div key={servicio.id_servicio} className="servicio-card">
                  {/* MOSTRAR IMAGEN DEL SERVICIO */}
                  {servicio.imagen && (
                    <div className="servicio-imagen-container">
                      <img 
                        src={servicio.imagen} 
                        alt={servicio.nombre_servicio}
                        className="servicio-imagen"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px 8px 0 0'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="servicio-header">
                    <h4>{servicio.nombre_servicio}</h4>
                    <div className="servicio-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditar(servicio)}
                        disabled={loading}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleEliminar(servicio.id_servicio)}
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="servicio-descripcion">{servicio.descripcion || 'Sin descripción'}</p>
                  <span className="servicio-precio">${parseFloat(servicio.precio).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="welcome-footer">
          Bienvenido, Administrador
        </div>


      </main>
    </div>
  );
};

export default Servicios;