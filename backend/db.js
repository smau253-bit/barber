// backend/db.js - VERSIÓN CORREGIDA
const mysql = require("mysql2/promise");
const dotenv = require("dotenv"); // ← ¡AGREGA ESTA LÍNEA!

// Cargar variables de entorno desde el archivo .env
dotenv.config(); // ← ¡AGREGA ESTA LÍNEA!

// Configuración con variables de entorno
const conexion = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "barberia",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Si usas SSL (necesario para algunos servicios en la nube)
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

// Probar la conexión
(async () => {
  try {
    const connection = await conexion.getConnection();
    console.log("✅ Conectado a la base de datos MySQL");
    console.log(`📊 Base de datos: ${process.env.DB_NAME || "barberia"}`);
    console.log(`🌐 Host: ${process.env.DB_HOST || "localhost"}`);
    connection.release();
  } catch (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
    console.error("💡 Verifica las variables de entorno en Render");
  }
})();

module.exports = conexion;