// src/components/catalogo/catalogo.jsx
import "./catalogo.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Detalleca from "../detalle_catalogo/detalleca";

// 🔥 SOLO CAMBIA ESTA LÍNEA (línea 7)
// Reemplaza la URL fija con esta configuración dinámica:
const API_URL = 'http://localhost:5000/api/productos';

function Catalogo() {
  const navigate = useNavigate();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Conectando a:', API_URL); // Para debug
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setProductos(response.data.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al conectar con el servidor');
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
            </p>
          </div>
        </div>

        <div className="productos-separador">
          <span>PERFUMES Y COLONIAS</span>
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