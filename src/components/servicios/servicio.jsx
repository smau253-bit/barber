// Servicio.jsx - VERSIÓN SIN BD (CON SIMULACIÓN)
import "./servicio.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Detallese from "../detalle_sesrvicio/detallese";

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
const IMAGEN_POR_DEFECTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EServicio%3C/text%3E%3C/svg%3E";

const DATOS_SIMULADOS = [
  { 
    id_servicio: 1, 
    nombre_servicio: 'Corte de Cabello Premium', 
    descripcion: 'Corte con técnica de tijera y máquina. Incluye lavado, masaje capilar y styling con productos de alta calidad.', 
    precio: 350.00,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_servicio: 2, 
    nombre_servicio: 'Barba y Bigote', 
    descripcion: 'Perfilado y recorte de barba con tijera y máquina. Incluye aplicación de aceite y bálsamo para barba.', 
    precio: 250.00,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_servicio: 3, 
    nombre_servicio: 'Tinte de Cabello', 
    descripcion: 'Aplicación de tinte de alta calidad. Incluye lavado, secado y peinado. Asesoría en coloración.', 
    precio: 550.00,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_servicio: 4, 
    nombre_servicio: 'Tratamiento Capilar', 
    descripcion: 'Tratamiento profundo con keratina y vitaminas. Repara y fortalece el cabello dañado. Incluye masaje.', 
    precio: 480.00,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_servicio: 5, 
    nombre_servicio: 'Combo Corte + Barba', 
    descripcion: 'Paquete completo que incluye corte de cabello y arreglo de barba. Incluye lavado y productos de styling.', 
    precio: 520.00,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_servicio: 6, 
    nombre_servicio: 'Lavado y Peinado', 
    descripcion: 'Lavado profesional con masaje capilar, secado y peinado con productos de styling.', 
    precio: 180.00,
    imagen: IMAGEN_POR_DEFECTO
  },
  { 
    id_servicio: 7, 
    nombre_servicio: 'Afeitado Clásico', 
    descripcion: 'Afeitado tradicional con navaja, toalla caliente y productos premium. Incluye masaje facial.', 
    precio: 300.00,
    imagen: IMAGEN_POR_DEFECTO
  }
];

// ============================================
// 🟢 FUNCIÓN SIMULADA (SIN BD)
// ============================================

const cargarServiciosSimulados = () => {
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

function Servicio() {
  const navigate = useNavigate();
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [error, setError] = useState(null);
  const [usandoSimulacion, setUsandoSimulacion] = useState(false);

  // Cargar servicios
  useEffect(() => {
    cargarServicios();
  }, []);

  // ============================================
  // 🟡 FUNCIÓN PRINCIPAL (CON SOPORTE BD)
  // ============================================

  const cargarServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      // ============================================
      // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
      // ============================================
      const response = await cargarServiciosSimulados();
      if (response.data.success) {
        setServicios(response.data.data);
        setUsandoSimulacion(true);
        console.log("✅ Servicios cargados desde simulación");
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
        setError('Error al cargar servicios');
      }
      */
      
    } catch (error) {
      console.error('Error cargando servicios:', error);
      
      // Si falla, usar datos simulados como respaldo
      try {
        const response = await cargarServiciosSimulados();
        if (response.data.success) {
          setServicios(response.data.data);
          setUsandoSimulacion(true);
          console.log("✅ Servicios cargados desde simulación (respaldo)");
        }
      } catch (fallbackError) {
        setError('Error al conectar con el servidor');
      }
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

      <main className="servicios-principal">
        <div className="servicios-header-contenido">
          <button className="servicios-volver" onClick={volverAlInicio}>
            ← Volver al inicio
          </button>
          <div>
            <h1>CATÁLOGO DE SERVICIOS</h1>
            <p className="servicios-total">
              {loading ? 'Cargando...' : `${serviciosFiltrados.length} resultados disponibles`}
              {!loading && usandoSimulacion && (
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                  (modo demo)
                </span>
              )}
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