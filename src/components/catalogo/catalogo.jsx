// src/components/catalogo/catalogo.jsx
import "./catalogo.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Detalleca from "../detalle_catalogo/detalleca";

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
const IMAGEN_POR_DEFECTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EProducto%3C/text%3E%3C/svg%3E";

const DATOS_SIMULADOS = [
  { 
    id_producto: 1, 
    nombre_producto: 'Cera para Cabello Profesional', 
    descripcion: 'Cera de alta fijación para estilos duraderos. Ideal para cabello corto y medio.', 
    precio: 350.00,
    stock: 15,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_producto: 2, 
    nombre_producto: 'Tijeras Profesionales', 
    descripcion: 'Tijeras de acero inoxidable japonés. Corte preciso y duradero.', 
    precio: 1200.00,
    stock: 8,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_producto: 3, 
    nombre_producto: 'Aceite para Barba', 
    descripcion: 'Aceite natural con ingredientes orgánicos. Hidrata y suaviza la barba.', 
    precio: 280.00,
    stock: 20,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_producto: 4, 
    nombre_producto: 'Navaja de Afeitar Clásica', 
    descripcion: 'Navaja de acero carbono con mango de madera. Perfecta para afeitado tradicional.', 
    precio: 450.00,
    stock: 5,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_producto: 5, 
    nombre_producto: 'Shampoo Fortalecedor', 
    descripcion: 'Shampoo con biotina y queratina. Fortalece y previene la caída del cabello.', 
    precio: 320.00,
    stock: 10,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_producto: 6, 
    nombre_producto: 'Bálsamo Acondicionador', 
    descripcion: 'Acondicionador con keratina y aceites esenciales. Repara el cabello dañado.', 
    precio: 290.00,
    stock: 12,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_producto: 7, 
    nombre_producto: 'Gel Fijador Extremo', 
    descripcion: 'Gel de fijación extrema con acabado brillante. Ideal para estilos definidos.', 
    precio: 180.00,
    stock: 25,
    imagen: IMAGEN_POR_DEFECTO
  }
];

// ============================================
// 🟢 FUNCIÓN SIMULADA (SIN BD)
// ============================================

const cargarProductosSimulados = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: DATOS_SIMULADOS
        }
      });
    }, 600); // Simular delay de red
  });
};

function Catalogo() {
  const navigate = useNavigate();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [error, setError] = useState(null);
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  // ============================================
  // 🟡 FUNCIÓN PRINCIPAL (CON SOPORTE BD)
  // ============================================

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const response = await cargarProductosSimulados();
      if (response.data.success) {
        setProductos(response.data.data);
        setUsandoSimulacion(true);
        console.log('✅ Productos cargados desde simulación (sin BD)');
      }
      
      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      console.log('📡 Conectando a:', API_URL);
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setProductos(response.data.data);
        setUsandoSimulacion(false);
      } else {
        setError('Error al cargar productos');
      }
      */
      
    } catch (error) {
      console.error('Error cargando productos:', error);
      
      // Si falla, usar datos simulados como respaldo
      try {
        const response = await cargarProductosSimulados();
        if (response.data.success) {
          setProductos(response.data.data);
          setUsandoSimulacion(true);
          console.log('✅ Productos cargados desde simulación (respaldo)');
        }
      } catch (fallbackError) {
        setError('Error al conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = buscarTexto.trim() === "" 
    ? productos 
    : productos.filter(p => 
        p.nombre_producto.toLowerCase().includes(buscarTexto.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(buscarTexto.toLowerCase()))
      );

  const volverAlInicio = () => {
    navigate("/");
  };

  const handleBuscar = (e) => {
    setBuscarTexto(e.target.value);
  };

  const abrirModal = (producto) => {
    console.log("🖱️ Click en VER DETALLES - Producto:", producto.nombre_producto);
    setProductoSeleccionado(producto);
  };

  const cerrarModal = () => {
    console.log("❌ Cerrando modal");
    setProductoSeleccionado(null);
  };

  const formatearPrecio = (precio) => {
    return `$${parseFloat(precio).toFixed(2)}`;
  };

  return (
    <>
      <header className="productos-header">
        <div className="productos-logo">
          <h2>SHELBY</h2>
          <span>BARBER</span>
        </div>

        <nav>
          <ul className="productos-menu">
            <li>
              <Link to="/servicios">Servicios</Link>
            </li>
            <li>
              <Link to="/catalogo" className="productos-activo">
                Productos
              </Link>
            </li>
          </ul>
        </nav>

        <div className="productos-opciones">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="productos-input"
            value={buscarTexto}
            onChange={handleBuscar}
          />
          {/* Indicador de modo simulación */}
          {!loading && usandoSimulacion && (
            <span style={{ 
              fontSize: '11px', 
              color: '#666', 
              marginLeft: '10px',
              backgroundColor: '#f0f0f0',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              ⚡ Demo
            </span>
          )}
        </div>
      </header>

      <main className="productos-principal">
        <div className="productos-header-contenido">
          <button className="productos-volver" onClick={volverAlInicio}>
            ← Volver al inicio
          </button>
          <div>
            <h1>CATÁLOGO DE PRODUCTOS</h1>
            <p className="productos-total">
              {loading ? 'Cargando...' : `${productosFiltrados.length} resultados disponibles`}
              {!loading && usandoSimulacion && (
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                  (modo demo)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="productos-separador">
          <span>PRODUCTOS DE BARBERÍA</span>
        </div>

        {loading ? (
          <div className="productos-loading">
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="productos-error">
            <p>❌ {error}</p>
            <button onClick={cargarProductos} className="productos-reintentar">
              Reintentar
            </button>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="productos-vacio">
            <p>No hay productos disponibles</p>
            {buscarTexto && <p>No se encontraron productos con "{buscarTexto}"</p>}
          </div>
        ) : (
          <section className="productos-grid">
            {productosFiltrados.map((producto) => (
              <div className="producto-card" key={producto.id_producto}>
                <img
                  src={producto.imagen || "/img/producto-default.jpg"}
                  alt={producto.nombre_producto}
                  className="producto-imagen"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/producto-default.jpg";
                  }}
                />
                <div className="producto-info">
                  <h2 className="producto-precio">{formatearPrecio(producto.precio)}</h2>
                  <h3 className="producto-nombre">{producto.nombre_producto}</h3>
                  <p className="producto-texto">{producto.descripcion || 'Sin descripción'}</p>
                  <button
                    className="servicio-boton"
                    onClick={() => abrirModal(producto)}
                  >
                    VER DETALLES
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Indicador de modo demo */}
        {!loading && usandoSimulacion && productos.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
            fontSize: '11px',
            color: '#666',
            textAlign: 'center',
            border: '1px solid #e0e0e0'
          }}>
            ⚡ Catálogo en modo <strong>DEMO</strong> - Los datos son de prueba
            <br />
            <span style={{ fontSize: '10px', color: '#999' }}>
              Para conectar con BD, descomenta la Parte 2 en cargarProductos()
            </span>
          </div>
        )}
      </main>

      {productoSeleccionado && (
        <Detalleca
          servicio={productoSeleccionado}
          cerrar={cerrarModal}
        />
      )}
    </>
  );
}

export default Catalogo;