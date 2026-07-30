import "./sesion.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Sesion() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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
        // Guardar usuario en localStorage o contexto
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        alert("✅ ¡Inicio de sesión exitoso!");
        // Redirigir al dashboard
        window.location.href = "/dashboard";
      } else {
        setError(data.message);
      }
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

        <div className="demo">
          <strong>Demo:</strong> admin@elitecut.com / admin123
        </div>
      </div>
    </div>
  );
}

export default Sesion;