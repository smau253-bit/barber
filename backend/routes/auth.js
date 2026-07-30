// routes/auth.js
const express = require("express");
const router = express.Router();
const conexion = require("../db");

router.post("/login", (req, res) => {
  const { correo, password } = req.body;

  // 📨 LOG: Ver qué datos llegan
  console.log("📨 Datos recibidos:", { correo, password });

  if (!correo || !password) {
    console.log("❌ Campos vacíos");
    return res.status(400).json({
      success: false,
      message: "Todos los campos son obligatorios"
    });
  }

  // 🔍 Primero verificar si la tabla existe
  conexion.query("SHOW TABLES LIKE 'empleados'", (err, tables) => {
    if (err) {
      console.log("❌ Error verificando tabla:", err);
      return res.status(500).json({
        success: false,
        message: "Error al verificar tabla"
      });
    }

    console.log("📊 Tablas encontradas:", tables.length);

    if (tables.length === 0) {
      console.log("❌ La tabla 'empleados' no existe");
      return res.status(500).json({
        success: false,
        message: "La tabla empleados no existe en la base de datos"
      });
    }

    // 🔍 Verificar las columnas de la tabla
    conexion.query("DESCRIBE empleados", (err, columns) => {
      if (err) {
        console.log("❌ Error obteniendo columnas:", err);
        return res.status(500).json({
          success: false,
          message: "Error al obtener columnas"
        });
      }

      console.log("📋 Columnas de la tabla:", columns.map(c => c.Field).join(", "));

      // Verificar si existe la columna correo y password
      const columnas = columns.map(c => c.Field);
      if (!columnas.includes('correo') || !columnas.includes('password')) {
        console.log("❌ Faltan columnas 'correo' o 'password'");
        return res.status(500).json({
          success: false,
          message: "La tabla empleados no tiene las columnas necesarias (correo, password)"
        });
      }

      // ✅ Ahora hacer la consulta de login
      const query = "SELECT * FROM empleados WHERE correo = ? AND password = ?";
      console.log("🔍 Ejecutando consulta:", query);

      conexion.query(query, [correo, password], (error, results) => {
        if (error) {
          console.log("❌ Error en consulta:", error);
          return res.status(500).json({
            success: false,
            message: "Error del servidor",
            error: error.message // 👈 Enviar mensaje de error específico
          });
        }

        console.log("📊 Resultados encontrados:", results.length);

        if (results.length === 0) {
          return res.status(401).json({
            success: false,
            message: "Credenciales incorrectas"
          });
        }

        const empleado = results[0];
        console.log("✅ Usuario autenticado:", empleado.nombre);

        res.json({
          success: true,
          message: "Inicio de sesión exitoso",
          usuario: {
            id: empleado.id_empleado,
            nombre: empleado.nombre,
            correo: empleado.correo,
            puesto: empleado.puesto,
            telefono: empleado.telefono,
            rol: empleado.rol || 'empleado'
          }
        });
      });
    });
  });
});

module.exports = router;