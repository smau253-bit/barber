import "./sesion.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// USUARIOS DE PRUEBA (SIMULACIÓN DE BD)
const USUARIOS_VALIDOS = [
  {
    correo: "admin@elitecut.com",
    password: "admin123",
    nombre: "Administrador",
    rol: "admin"
  },
  {
    correo: "usuario@demo.com",
    password: "demo123",
    nombre: "Usuario Demo",
    rol: "usuario"
  }
];

function Sesion() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // 🔧 FUNCIÓN SIMULADA (PARA CUANDO NO HAY BD)
  const loginSimulado = (correo, password) => {
    // Buscar usuario en el array local
    const usuario = USUARIOS_VALIDOS.find(
      u => u.correo === correo && u.password === password
    );
    
    if (usuario) {
      return {
        success: true,
        usuario: {
          correo: usuario.correo,
          nombre: usuario.nombre,
          rol: usuario.rol
        }
      };
    } else {
      return {
        success: false,
        message: "Credenciales incorrectas"
      };
    }
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      // ============================================
      // 🟢 PARTE 1: LOGIN SIMULADO (SIN BD)
      // ============================================
      
      // Simular delay de red (como si fuera una petición real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resultado = loginSimulado(correo, password);
      
      if (resultado.success) {
        localStorage.setItem("usuario", JSON.stringify(resultado.usuario));
        alert("✅ ¡Inicio de sesión exitoso!");
        window.location.href = "/dashboard";
      } else {
        setError(resultado.message);
      }

      // ============================================
      // 🟡 PARTE 2: CÓDIGO ORIGINAL CON BD (COMENTADO)
      // DESCOMENTAR ESTA PARTE CUANDO TENGAS BD
      // ============================================
      
      /*
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      });

      const text = await response.text();
      console.log(text);

      if (!response.ok) {
        throw new Error(text);
      }

      const data = JSON.parse(text);

      if (data.success) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        alert("✅ ¡Inicio de sesión exitoso!");
        window.location.href = "/dashboard";
      } else {
        setError(data.message);
      }
      */

    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="logo">
          <div className="icono">💈</div>
          <h1>
            Shenly<span>Barber</span>
          </h1>
          <p>PANEL DE ADMINISTRACIÓN</p>
        </div>

        <div className="separador">
          <span>♦</span>
        </div>

        <form onSubmit={iniciarSesion}>
          <label>CORREO ELECTRÓNICO</label>
          <input
            type="email"
            placeholder="admin@elitecut.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label>CONTRASEÑA</label>
          <div className="password">
            <input
              type={mostrar ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setMostrar(!mostrar)}
            >
              {mostrar ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <div className="error-mensaje">{error}</div>}

          <button 
            className="btn-login" 
            type="submit"
            disabled={cargando}
          >
            {cargando ? "VERIFICANDO..." : "INICIAR SESIÓN"}
          </button>
        </form>


      </div>
    </div>
  );
}

export default Sesion;