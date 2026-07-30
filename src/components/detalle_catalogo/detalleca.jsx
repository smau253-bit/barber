// src/components/detalle_catalogo/detalleca.jsx
import "./detallese.css";
import { FaTimes, FaClock, FaCircle, FaWhatsapp } from "react-icons/fa";

function Detalleca({ servicio, cerrar }) {
  if (!servicio) return null;

  console.log("📦 Detalleca recibió:", servicio);

  const nombre = servicio.nombre_producto || servicio.nombre || "Sin nombre";
  const precio = servicio.precio ? `$${parseFloat(servicio.precio).toFixed(2)}` : "$0.00";
  const descripcion = servicio.descripcion || "Sin descripción disponible";
  const imagen = servicio.imagen || "/img/producto-default.jpg";
  const stock = servicio.stock !== undefined ? servicio.stock : "N/A";

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={cerrar}>
          <FaTimes />
        </button>

        <div className="modal-imagen">
          <img
            src={imagen}
            alt={nombre}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/producto-default.jpg";
            }}
          />
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
          </div>

          <button
            className="modal-agendar" 
            onClick={() => {
              const mensaje = `Hola, me interesa adquirir el producto: ${nombre} (${precio})`;
              const url = `https://wa.me/5217221234567?text=${encodeURIComponent(mensaje)}`;
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

export default Detalleca;