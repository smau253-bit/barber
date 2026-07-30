// backend/db.js - VERSIÓN CORRECTA CON PROMESAS
const mysql = require("mysql2/promise"); // ← ¡IMPORTANTE! Con /promise

const conexion = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",  // Vacío para XAMPP
  database: "barberia",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión
(async () => {
  try {
    const connection = await conexion.getConnection();
    console.log("✅ Conectado a la base de datos MySQL");
    connection.release();
  } catch (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
  }
})();

module.exports = conexion;