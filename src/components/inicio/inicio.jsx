import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./inicio.css";

function Inicio() {
  const navigate = useNavigate();
  return (
    <div className="inicio-hero">
      <div className="inicio-overlay"></div>

      <header className="inicio-header">
        <div className="inicio-logo">
          <h2>SHELBY</h2>
          <span>BARBERÍA</span>
        </div>



        <div className="inicio-opciones">
<Link to="/sesion">
  <button className="inicio-login">
    Iniciar sesión
  </button>
</Link>

        </div>
      </header>

      <main className="inicio-contenido">
        <p className="inicio-subtitulo">DESDE 2010 • CIUDAD DE MÉXICO</p>
        
        <h1>
          SHELBY
          <br />
          <span>BARBER</span>
        </h1>

        <p className="inicio-descripcion">
          Barbería premium donde cada corte es una obra de precisión.
          <br />
          Servicios de clase mundial, atención personalizada y la
          elegancia que mereces.
        </p>

        <div className="inicio-acciones">
          <Link to="/servicios">
            <button className="inicio-servicios">VER SERVICIOS</button>
          </Link>

        </div>
      </main>
    </div>
  );
}

export default Inicio;