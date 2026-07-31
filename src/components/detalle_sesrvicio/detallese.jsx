// src/detalle_sesrvicio/detallese.jsx
import React, { useState, useEffect } from "react";
import "./detallese.css";

// ============================================
// 📊 DATOS SIMULADOS (PARA PRUEBAS SIN BD)
// ============================================
const SERVICIOS_SIMULADOS = {
  1: {
    id_servicio: 1,
    nombre_servicio: "Corte de Cabello Premium",
    precio: 350.00,
    descripcion: "Corte de cabello con técnica de tijera y máquina. Incluye lavado, masaje capilar y styling con productos de alta calidad.",
    imagen: "/img/corte-premium.jpg",
    tiempo: "45 min"
  },
  2: {
    id_servicio: 2,
    nombre_servicio: "Barba y Bigote",
    precio: 250.00,
    descripcion: "Perfilado y recorte de barba con tijera y máquina. Incluye aplicación de aceite y bálsamo para barba.",
    imagen: "/img/barba.jpg",
    tiempo: "30 min"
  },
  3: {
    id_servicio: 3,
    nombre_servicio: "Tinte de Cabello",
    precio: 550.00,
    descripcion: "Aplicación de tinte de alta calidad. Incluye lavado, secado y peinado. Asesoría en coloración.",
    imagen: "/img/tinte.jpg",
    tiempo: "90 min"
  },
  4: {
    id_servicio: 4,
    nombre_servicio: "Tratamiento Capilar",
    precio: 480.00,
    descripcion: "Tratamiento profundo con keratina y vitaminas. Repara y fortalece el cabello dañado. Incluye masaje.",
    imagen: "/img/tratamiento.jpg",
    tiempo: "60 min"
  },
  5: {
    id_servicio: 5,
    nombre_servicio: "Combo Corte + Barba",
    precio: 520.00,
    descripcion: "Paquete completo que incluye corte de cabello y arreglo de barba. Incluye lavado y productos de styling.",
    imagen: "/img/combo.jpg",
    tiempo: "60 min"
  }
};

// ============================================
// 🟢 FUNCIONES SIMULADAS (SIN BD)
// ============================================

const obtenerServicioSimulado = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const servicio = SERVICIOS_SIMULADOS[id];
      if (servicio) {
        resolve({
          data: {
            success: true,
            data: servicio
          }
        });
      } else {
        reject({
          response: {
            data: {
              success: false,
              message: 'Servicio no encontrado'
            }
          }
        });
      }
    }, 300);
  });
};

const Detallese = ({ servicio, cerrar }) => {
  // Estado para manejar el servicio (en caso de que venga con diferentes formatos)
  const [servicioData, setServicioData] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Si el servicio llega como ID, buscar el servicio
  useEffect(() => {
    const cargarServicio = async () => {
      // Si ya es un objeto con datos, usarlo directamente
      if (servicio && typeof servicio === 'object' && servicio.id_servicio) {
        // Verificar si tiene los datos completos o solo el ID
        if (servicio.nombre_servicio || servicio.nombre) {
          setServicioData(servicio);
          console.log("✅ Usando servicio directo:", servicio.nombre_servicio || servicio.nombre);
        } else if (servicio.id_servicio) {
          // Si solo tiene ID, buscar los datos simulados
          setCargando(true);
          console.log("🔄 Buscando servicio con ID:", servicio.id_servicio);
          try {
            // ============================================
            // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
            // ============================================
            const response = await obtenerServicioSimulado(servicio.id_servicio);
            if (response.data.success) {
              setServicioData(response.data.data);
              console.log("✅ Servicio cargado desde simulación");
            }

            // ============================================
            // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
            // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
            // ============================================
            
            /*
            const API_URL = 'http://localhost:5000/api/servicios';
            const response = await axios.get(`${API_URL}/${servicio.id_servicio}`);
            if (response.data.success) {
              setServicioData(response.data.data);
              console.log("✅ Servicio cargado desde BD");
            }
            */
            
          } catch (error) {
            console.error('❌ Error cargando servicio:', error);
            // Usar datos simulados como respaldo
            try {
              const response = await obtenerServicioSimulado(servicio.id_servicio);
              if (response.data.success) {
                setServicioData(response.data.data);
                console.log("✅ Servicio cargado desde simulación (respaldo)");
              }
            } catch (fallbackError) {
              console.error('❌ Error en fallback:', fallbackError);
              // Usar un servicio por defecto si todo falla
              setServicioData(SERVICIOS_SIMULADOS[1]);
            }
          } finally {
            setCargando(false);
          }
        }
      } else if (servicio && typeof servicio === 'object' && servicio.id) {
        // Si viene con id (en lugar de id_servicio)
        setCargando(true);
        try {
          const response = await obtenerServicioSimulado(servicio.id);
          if (response.data.success) {
            setServicioData(response.data.data);
          }
        } catch (error) {
          console.error('❌ Error cargando servicio por id:', error);
          setServicioData(SERVICIOS_SIMULADOS[1]);
        } finally {
          setCargando(false);
        }
      } else {
        // Si no hay servicio o es inválido, usar un servicio por defecto
        console.log("⚠️ Servicio inválido, usando servicio por defecto");
        setServicioData(SERVICIOS_SIMULADOS[1]);
      }
    };

    cargarServicio();
  }, [servicio]);

  // Usar el servicioData si existe, si no usar el servicio recibido
  const servicioFinal = servicioData || servicio;

  // Si no hay servicio, no mostrar nada
  if (!servicioFinal) {
    console.log("❌ No hay servicio para mostrar");
    return null;
  }

  // Verificar si estamos en modo simulación
  const usandoSimulacion = !!servicioData && !servicio?.nombre_servicio && !servicio?.nombre;

  // Extraer datos con diferentes formatos posibles
  const nombre = servicioFinal.nombre_servicio || servicioFinal.nombre || "Servicio sin nombre";
  const precio = servicioFinal.precio ? parseFloat(servicioFinal.precio).toFixed(2) : "0.00";
  const descripcion = servicioFinal.descripcion || "Sin descripción disponible";
  const imagen = servicioFinal.imagen || "/img/servicio-default.jpg";
  const tiempo = servicioFinal.tiempo || "30-45 min";
  const categoria = servicioFinal.categoria || "Corte y Estilo";

  console.log("✅ Mostrando modal para:", nombre);
  console.log("📦 Modo:", usandoSimulacion ? 'Simulación' : 'Datos directos');

  if (cargando) {
    return (
      <div className="modal-overlay" onClick={cerrar}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-cerrar" onClick={cerrar}>
            ✕
          </button>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '10px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              ⏳
            </div>
            <p style={{ color: '#666' }}>Cargando servicio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={cerrar}>
          ✕
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
          <img 
            src={imagen} 
            alt={nombre}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/servicio-default.jpg";
            }}
          />
        </div>
        
        <div className="modal-info">
          <h2>{nombre}</h2>
          <p className="modal-precio">${precio}</p>
          <p className="modal-descripcion">{descripcion}</p>
          
          <div className="modal-detalles">
            <div className="modal-detalle-item">
              <span className="modal-detalle-label">⏱ Tiempo estimado</span>
              <span className="modal-detalle-valor">{tiempo}</span>
            </div>
            <div className="modal-detalle-item">
              <span className="modal-detalle-label">📋 Categoría</span>
              <span className="modal-detalle-valor">{categoria}</span>
            </div>
            {usandoSimulacion && (
              <div className="modal-detalle-item">
                <span className="modal-detalle-label">🔧 Modo</span>
                <span className="modal-detalle-valor" style={{ fontSize: '12px', color: '#666' }}>
                  Datos de prueba
                </span>
              </div>
            )}
          </div>
          
          <button 
            className="modal-agendar" 
            onClick={() => {
              const mensaje = `Hola, me interesa agendar el servicio: ${nombre} ($${precio})`;
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

// ============================================
// 🔧 FUNCIÓN DE UTILIDAD PARA USAR DESDE OTROS COMPONENTES
// ============================================

// Si necesitas obtener un servicio desde otro componente sin BD
export const obtenerServicio = async (id) => {
  try {
    // ============================================
    // 🟢 PARTE 1: DATOS SIMULADOS (SIN BD)
    // ============================================
    const response = await obtenerServicioSimulado(id);
    return response.data.data;

    // ============================================
    // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
    // ============================================
    
    /*
    const API_URL = 'http://localhost:5000/api/servicios';
    const response = await axios.get(`${API_URL}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Servicio no encontrado');
    */
    
  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    throw error;
  }
};

// ============================================
// 🎨 ANIMACIÓN PARA EL LOADING
// ============================================

// Agregar al CSS del componente si no existe
const estiloLoading = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

// Si no tienes un archivo CSS separado, puedes inyectar el estilo
// o simplemente agregarlo a tu archivo detallese.css

export default Detallese;