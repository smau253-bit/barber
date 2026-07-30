// Servicio.jsx - VERSIÓN LIMPIA (Solo con el modal real)
import "./servicio.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Detallese from "../detalle_sesrvicio/detallese";

const API_URL = 'http://localhost:5000/api/servicios';

function Servicio() {
  const navigate = useNavigate();
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [error, setError] = useState(null);

  // Cargar servicios desde la base de datos
  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setServicios(response.data.data);
      } else {
        setError('Error al cargar servicios');
      }
    } catch (error) {
      console.error('Error cargando servicios:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar servicios por búsqueda
  const serviciosFiltrados = buscarTexto.trim() === "" 
    ? servicios 
    : servicios.filter(s => 
        s.nombre_servicio.toLowerCase().includes(buscarTexto.toLowerCase()) ||
        (s.descripcion && s.descripcion.toLowerCase().includes(buscarTexto.toLowerCase()))
      );

  const volverAlInicio = () => {
    navigate("/");
  };

  const handleBuscar = (e) => {
    setBuscarTexto(e.target.value);
  };

  // Función para abrir el modal
  const abrirModal = (servicio) => {
    console.log("🖱️ Click en VER DETALLES - Servicio:", servicio.nombre_servicio);
    setServicioSeleccionado(servicio);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    console.log("❌ Cerrando modal");
    setServicioSeleccionado(null);
  };

  return (
    <>
      <header className="servicios-header">
        <div className="servicios-logo">
          <h2>SHELBY</h2>
          <span>BARBER</span>
        </div>

        <nav>
          <ul className="servicios-menu">
            <li>
              <Link to="/servicios" className="servicios-activo">
                Servicios
              </Link>
            </li>
            <li>
              <Link to="/catalogo">Productos</Link>
            </li>
          </ul>
        </nav>

        <div className="servicios-opciones">
          <input
            type="text"
            placeholder="Buscar servicio..."
            className="servicios-input"
            value={buscarTexto}
            onChange={handleBuscar}
          />

        </div>
      </header>

      <main className="servicios-principal">
        <div className="servicios-header-contenido">
          <button className="servicios-volver" onClick={volverAlInicio}>
            ← Volver al inicio
          </button>
          <div>
            <h1>CATÁLOGO DE SERVICIOS</h1>
            <p className="servicios-total">
              {loading ? 'Cargando...' : `${serviciosFiltrados.length} resultados disponibles`}
            </p>
          </div>
        </div>

        <div className="servicios-separador">
          <span>CORTES Y ESTILOS</span>
        </div>

        {loading ? (
          <div className="servicios-loading">
            <p>Cargando servicios...</p>
          </div>
        ) : error ? (
          <div className="servicios-error">
            <p>❌ {error}</p>
            <button onClick={cargarServicios} className="servicios-reintentar">
              Reintentar
            </button>
          </div>
        ) : serviciosFiltrados.length === 0 ? (
          <div className="servicios-vacio">
            <p>No hay servicios disponibles</p>
            {buscarTexto && <p>No se encontraron servicios con "{buscarTexto}"</p>}
          </div>
        ) : (
          <section className="servicios-grid">
            {serviciosFiltrados.map((servicio) => (
              <div className="servicio-card" key={servicio.id_servicio}>
                <img
                  src={servicio.imagen || "/img/servicio-default.jpg"}
                  alt={servicio.nombre_servicio}
                  className="servicio-imagen"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/servicio-default.jpg";
                  }}
                />
                <div className="servicio-info">
                  <h2 className="servicio-precio">${parseFloat(servicio.precio).toFixed(2)}</h2>
                  <h3 className="servicio-nombre">{servicio.nombre_servicio}</h3>
                  <p className="servicio-texto">{servicio.descripcion || 'Sin descripción'}</p>
                  <button
                    className="servicio-boton"
                    onClick={() => abrirModal(servicio)}
                  >
                    VER DETALLES
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* MODAL REAL - Se muestra cuando hay un servicio seleccionado */}
      {servicioSeleccionado && (
        <Detallese
          servicio={servicioSeleccionado}
          cerrar={cerrarModal}
        />
      )}
    </>
  );
}

export default Servicio;