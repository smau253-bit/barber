// src/components/detalle_catalogo/detalleca.jsx
import "./detallese.css";
import { FaTimes, FaClock, FaCircle, FaWhatsapp } from "react-icons/fa";

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
const PRODUCTOS_SIMULADOS = {
  1: {
    id: 1,
    nombre_producto: "Cera para Cabello Profesional",
    precio: 350.00,
    descripcion: "Cera de alta fijación para estilos duraderos. Ideal para cabello corto y medio. Textura mate con acabado natural.",
    imagen: "/img/cera.jpg",
    stock: 15
  },
  2: {
    id: 2,
    nombre_producto: "Tijeras Profesionales",
    precio: 1200.00,
    descripcion: "Tijeras de acero inoxidable japonés. Corte preciso y duradero. Ideal para barberos profesionales.",
    imagen: "/img/tijeras.jpg",
    stock: 8
  },
  3: {
    id: 3,
    nombre_producto: "Aceite para Barba",
    precio: 280.00,
    descripcion: "Aceite natural con ingredientes orgánicos. Hidrata, suaviza y da brillo a la barba. Aroma a sándalo.",
    imagen: "/img/aceite.jpg",
    stock: 20
  },
  4: {
    id: 4,
    nombre_producto: "Navaja de Afeitar Clásica",
    precio: 450.00,
    descripcion: "Navaja de acero carbono con mango de madera. Perfecta para un afeitado tradicional y preciso.",
    imagen: "/img/navaja.jpg",
    stock: 5
  },
  5: {
    id: 5,
    nombre_producto: "Shampoo Fortalecedor",
    precio: 320.00,
    descripcion: "Shampoo con biotina y queratina. Fortalece el cabello, previene la caída y estimula el crecimiento.",
    imagen: "/img/shampoo.jpg",
    stock: 0
  }
};

// ============================================
// 🟢 FUNCIÓN SIMULADA (SIN BD)
// ============================================

const obtenerProductoSimulado = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const producto = PRODUCTOS_SIMULADOS[id];
      if (producto) {
        resolve({
          data: {
            success: true,
            data: producto
          }
        });
      } else {
        reject({
          response: {
            data: {
              success: false,
              message: 'Producto no encontrado'
            }
          }
        });
      }
    }, 300);
  });
};

function Detalleca({ servicio, cerrar }) {
  // Estado para manejar el producto (en caso de que venga con diferentes formatos)
  const [productoData, setProductoData] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Si el servicio llega como ID, buscar el producto
  useEffect(() => {
    const cargarProducto = async () => {
      // Si ya es un objeto con datos, usarlo directamente
      if (servicio && typeof servicio === 'object' && servicio.id) {
        // Verificar si tiene los datos completos o solo el ID
        if (servicio.nombre_producto || servicio.nombre) {
          setProductoData(servicio);
        } else if (servicio.id) {
          // Si solo tiene ID, buscar los datos simulados
          setCargando(true);
          try {
            // ============================================
            // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
            // ============================================
            const response = await obtenerProductoSimulado(servicio.id);
            if (response.data.success) {
              setProductoData(response.data.data);
            }

            // ============================================
            // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
            // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
            // ============================================
            
            /*
            const API_URL = 'http://localhost:5000/api/productos';
            const response = await axios.get(`${API_URL}/${servicio.id}`);
            if (response.data.success) {
              setProductoData(response.data.data);
            }
            */
            
          } catch (error) {
            console.error('Error cargando producto:', error);
            // Usar datos simulados como respaldo
            const response = await obtenerProductoSimulado(servicio.id);
            if (response.data.success) {
              setProductoData(response.data.data);
            }
          } finally {
            setCargando(false);
          }
        }
      } else {
        // Si no hay servicio o es inválido, usar un producto por defecto
        setProductoData(PRODUCTOS_SIMULADOS[1]);
      }
    };

    cargarProducto();
  }, [servicio]);

  // Usar el productoData si existe, si no usar el servicio recibido
  const producto = productoData || servicio;

  if (!producto) return null;

  console.log("📦 Detalleca recibió:", producto);
  console.log("📦 Modo:", productoData ? 'Simulación' : 'Datos directos');

  // Extraer datos con diferentes formatos posibles
  const nombre = producto.nombre_producto || producto.nombre || "Sin nombre";
  const precio = producto.precio ? `$${parseFloat(producto.precio).toFixed(2)}` : "$0.00";
  const descripcion = producto.descripcion || "Sin descripción disponible";
  const imagen = producto.imagen || "/img/producto-default.jpg";
  const stock = producto.stock !== undefined ? producto.stock : "N/A";

  // Verificar si estamos en modo simulación
  const usandoSimulacion = !!productoData && !servicio?.nombre_producto;

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={cerrar}>
          <FaTimes />
        </button>

        {/* Indicador de modo (solo visible en desarrollo) */}
        {usandoSimulacion && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#f0f0f0',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#666',
            zIndex: 10,
            border: '1px solid #ddd'
          }}>
            ⚡ Demo
          </div>
        )}

        <div className="modal-imagen">
          {cargando ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '200px',
              backgroundColor: '#f5f5f5'
            }}>
              <span>Cargando...</span>
            </div>
          ) : (
            <img
              src={imagen}
              alt={nombre}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/producto-default.jpg";
              }}
            />
          )}
        </div>

        <div className="modal-info">
          <div className="titulo-precio">
            <h2>{nombre}</h2>
            <span className="precio-producto">{precio}</span>
          </div>

          <p className="descripcion-producto">{descripcion}</p>

          <div className="detalles-producto">
            <div className="detalle-item">
              <span className="detalle-label">📦 Stock disponible</span>
              <span className={`detalle-valor ${stock > 0 ? 'disponible' : 'agotado'}`}>
                {stock > 0 ? `${stock} unidades` : 'Agotado'}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">📋 Estado</span>
              <span className={`detalle-valor ${stock > 0 ? 'disponible' : 'agotado'}`}>
                {stock > 0 ? '✅ Disponible' : '❌ Agotado'}
              </span>
            </div>
            {usandoSimulacion && (
              <div className="detalle-item">
                <span className="detalle-label">🔧 Modo</span>
                <span className="detalle-valor" style={{ fontSize: '11px', color: '#666' }}>
                  Datos de prueba
                </span>
              </div>
            )}
          </div>

          <button
            className="modal-agendar" 
            onClick={() => {
              const mensaje = `Hola, me interesa adquirir el producto: ${nombre} (${precio})`;
              const url = `https://wa.me/5217298028398?text=${encodeURIComponent(mensaje)}`;
              window.open(url, '_blank');
            }}
          >
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 🔧 FUNCIÓN DE UTILIDAD PARA USAR DESDE OTROS COMPONENTES
// ============================================

// Si necesitas obtener un producto desde otro componente sin BD
export const obtenerProducto = async (id) => {
  try {
    // ============================================
    // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
    // ============================================
    const response = await obtenerProductoSimulado(id);
    return response.data.data;

    // ============================================
    // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
    // ============================================
    
    /*
    const API_URL = 'http://localhost:5000/api/productos';
    const response = await axios.get(`${API_URL}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Producto no encontrado');
    */
    
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    throw error;
  }
};

export default Detalleca;