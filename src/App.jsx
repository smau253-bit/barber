import { Routes, Route } from "react-router-dom";
import Inicio from "./components/inicio/inicio";
import Servicios from "./components/servicios/servicio";
import Catalogo from "./components/catalogo/catalogo";
import Sesion from "./components/sesion/sesion";
import Dashboard from "./components/dashboard/dashboard";
import Servicio2 from "./components/servicio2/servicio2"
import Citas from "./components/citas/citas"
import Clientes from "./components/clientes/clientes"
import Producto from "./components/productos/producto"
import Ventas from "./components/ventas/ventas"
import Empleado from "./components/empleados/empleado"
import Detallese from "./components/detalle_sesrvicio/detallese";
import Detalleca from "./components/detalle_catalogo/detalleca"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/sesion" element={<Sesion />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/servicio" element={<Servicio2 />}/>
      <Route path="/detalleca" element={<Detalleca />} />
      <Route path="/citas" element={<Citas />}/>
      <Route path="/producto" element={<Producto />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/empleados" element={<Empleado />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/detallese" element={<Detallese />} />

    </Routes>
  );
}

export default App;