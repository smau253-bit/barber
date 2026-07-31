// src/detalle_sesrvicio/detallese.jsx
import React from "react";
import "./detallese.css";

const Detallese = ({ servicio, cerrar }) => {
  // Si no hay servicio, no mostrar nada
  if (!servicio) {
    console.log("❌ No hay servicio para mostrar");
    return null;
  }

  console.log("✅ Mostrando modal para:", servicio.nombre_servicio);

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={cerrar}>
          ✕
        </button>
        
        <div className="modal-imagen">
          <img 
            src={servicio.imagen || "/img/servicio-default.jpg"} 
            alt={servicio.nombre_servicio || servicio.nombre}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/servicio-default.jpg";
            }}
          />
        </div>
        
        <div className="modal-info">
          <h2>{servicio.nombre_servicio || servicio.nombre}</h2>
          <p className="modal-precio">${parseFloat(servicio.precio).toFixed(2)}</p>
          <p className="modal-descripcion">{servicio.descripcion || 'Sin descripción'}</p>
          
          <div className="modal-detalles">
            <div className="modal-detalle-item">
              <span className="modal-detalle-label">⏱ Tiempo estimado</span>
              <span className="modal-detalle-valor">{servicio.tiempo || '30-45 min'}</span>
            </div>
            <div className="modal-detalle-item">
              <span className="modal-detalle-label">📋 Categoría</span>
              <span className="modal-detalle-valor">Corte y Estilo</span>
            </div>
          </div>
          
          <button 
            className="modal-agendar" 
            onClick={() => {
              const mensaje = `Hola, me interesa agendar el servicio: ${servicio.nombre_servicio} ($${parseFloat(servicio.precio).toFixed(2)})`;
              const url = `https://wa.me/5217298028398?text=${encodeURIComponent(mensaje)}`;
              window.open(url, '_blank');
            }}
          >
            AGENDAR CITA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detallese;