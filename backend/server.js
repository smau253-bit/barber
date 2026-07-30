// server.js - VERSIÓN COMPLETA
const express = require("express");
const cors = require("cors");
const conexion = require("./db");

// === CREAR LA APLICACIÓN ===
const app = express(); // ← ESTO ES LO QUE TE FALTA
const PORT = 5000;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Permite imágenes grandes en Base64



// 🧪 ENDPOINT DE PRUEBA PARA VENTAS
app.get("/api/ventas-test", async (req, res) => {
  try {
    console.log("🧪 Probando conexión a ventas...");
    
    // Verificar todas las tablas
    const [tablas] = await conexion.query("SHOW TABLES");
    const nombresTablas = tablas.map(t => Object.values(t)[0]);
    
    // Verificar ventas
    const [ventas] = await conexion.query("SELECT COUNT(*) as total FROM ventas");
    const [clientes] = await conexion.query("SELECT COUNT(*) as total FROM clientes");
    const [productos] = await conexion.query("SELECT COUNT(*) as total FROM productos");
    const [detalles] = await conexion.query("SELECT COUNT(*) as total FROM detalle_venta");
    
    res.json({
      success: true,
      message: "✅ Conexión a ventas exitosa",
      tablas: nombresTablas,
      conteos: {
        ventas: ventas[0].total,
        clientes: clientes[0].total,
        productos: productos[0].total,
        detalle_venta: detalles[0].total
      }
    });
  } catch (error) {
    console.log("❌ Error en test:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});


// ============================================
// 🔐 LOGIN
// ============================================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    console.log("📨 Intentando login:", { correo });

    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios"
      });
    }

    // Consultar empleado
    const query = "SELECT * FROM empleados WHERE correo = ? AND password = ?";
    const [results] = await conexion.query(query, [correo, password]);
    
    console.log(`📊 Resultados: ${results.length}`);

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    const empleado = results[0];
    console.log(`✅ Login exitoso: ${empleado.nombre}`);

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
  } catch (error) {
    console.log("❌ Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message
    });
  }
});

// ============================================
// 👥 CRUD DE EMPLEADOS
// ============================================

// 📋 OBTENER TODOS
app.get("/api/empleados", async (req, res) => {
  try {
    console.log("📋 Obteniendo todos los empleados...");
    const query = "SELECT * FROM empleados ORDER BY id_empleado DESC";
    const [results] = await conexion.query(query);

    const empleadosSinPassword = results.map(emp => {
      const { password, ...resto } = emp;
      return resto;
    });

    console.log(`✅ ${empleadosSinPassword.length} empleados encontrados`);
    res.json({
      success: true,
      data: empleadosSinPassword
    });
  } catch (error) {
    console.log("❌ Error al obtener empleados:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener empleados",
      error: error.message
    });
  }
});

// 🔍 BUSCAR POR NOMBRE
app.get("/api/empleados/search", async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino || termino.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Se requiere un término de búsqueda"
      });
    }

    console.log(`🔍 Buscando: "${termino}"`);
    const query = "SELECT * FROM empleados WHERE nombre LIKE ?";
    const [results] = await conexion.query(query, [`%${termino}%`]);

    const empleadosSinPassword = results.map(emp => {
      const { password, ...resto } = emp;
      return resto;
    });

    res.json({
      success: true,
      data: empleadosSinPassword
    });
  } catch (error) {
    console.log("❌ Error al buscar:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar empleados",
      error: error.message
    });
  }
});

// 👤 OBTENER POR ID
app.get("/api/empleados/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👤 Obteniendo empleado ID: ${id}`);
    
    const query = "SELECT * FROM empleados WHERE id_empleado = ?";
    const [results] = await conexion.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado"
      });
    }

    const { password, ...empleado } = results[0];
    res.json({
      success: true,
      data: empleado
    });
  } catch (error) {
    console.log("❌ Error al obtener:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener empleado",
      error: error.message
    });
  }
});

// ➕ CREAR EMPLEADO - VERSIÓN CON LOGS
app.post("/api/empleados", async (req, res) => {
  console.log("=".repeat(60));
  console.log("📝 SOLICITUD PARA CREAR EMPLEADO");
  console.log("=".repeat(60));
  
  try {
    const { nombre, telefono, correo, puesto, password, rol } = req.body;
    console.log("📦 Datos recibidos:", { 
      nombre, 
      telefono, 
      correo, 
      puesto, 
      rol,
      password: password ? "***" : "undefined"
    });

    // VALIDACIONES
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre es obligatorio"
      });
    }

    if (!telefono || !telefono.trim()) {
      return res.status(400).json({
        success: false,
        message: "El teléfono es obligatorio"
      });
    }

    if (!correo || !correo.trim()) {
      return res.status(400).json({
        success: false,
        message: "El correo es obligatorio"
      });
    }

    if (!correo.includes('@')) {
      return res.status(400).json({
        success: false,
        message: "El correo no es válido (debe contener @)"
      });
    }

    if (!puesto || !puesto.trim()) {
      return res.status(400).json({
        success: false,
        message: "El puesto es obligatorio"
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres"
      });
    }

    // VERIFICAR CORREO DUPLICADO
    console.log(`🔍 Verificando correo: ${correo}`);
    const [checkResults] = await conexion.query(
      "SELECT id_empleado FROM empleados WHERE correo = ?",
      [correo.trim()]
    );

    if (checkResults.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado"
      });
    }

    // INSERTAR
    console.log("📝 Insertando empleado...");
    const insertQuery = `
      INSERT INTO empleados 
      (nombre, telefono, correo, puesto, password, rol, activo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      nombre.trim(),
      telefono.trim(),
      correo.trim().toLowerCase(),
      puesto.trim(),
      password,
      rol || 'empleado',
      1
    ];
    
    const [result] = await conexion.query(insertQuery, values);
    console.log(`✅ Empleado creado con ID: ${result.insertId}`);
    
    // RECUPERAR EMPLEADO CREADO
    const [getResults] = await conexion.query(
      "SELECT * FROM empleados WHERE id_empleado = ?",
      [result.insertId]
    );

    const { password: pass, ...nuevoEmpleado } = getResults[0];
    console.log("✅ Empleado creado exitosamente:", nuevoEmpleado.nombre);
    console.log("=".repeat(60));
    
    res.status(201).json({
      success: true,
      message: "Empleado creado exitosamente",
      data: nuevoEmpleado
    });
    
  } catch (error) {
    console.log("=".repeat(60));
    console.log("❌ ERROR:");
    console.log("  Mensaje:", error.message);
    console.log("  Código:", error.code);
    console.log("=".repeat(60));
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear empleado",
      error: error.message,
      code: error.code || 'unknown'
    });
  }
});

// ✏️ ACTUALIZAR EMPLEADO
app.put("/api/empleados/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo, puesto, password, rol, activo } = req.body;
    console.log(`✏️ Actualizando empleado ID: ${id}`);

    // Verificar si existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM empleados WHERE id_empleado = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado"
      });
    }

    let updateQuery = `
      UPDATE empleados 
      SET nombre = ?, telefono = ?, correo = ?, puesto = ?, rol = ?, activo = ?
    `;
    const params = [nombre, telefono, correo, puesto, rol || 'empleado', activo !== undefined ? activo : 1];

    if (password && password.length > 0) {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "La contraseña debe tener al menos 8 caracteres"
        });
      }
      updateQuery += ", password = ?";
      params.push(password);
    }

    updateQuery += " WHERE id_empleado = ?";
    params.push(id);

    await conexion.query(updateQuery, params);
    console.log(`✅ Empleado ID ${id} actualizado`);
    
    const [getResults] = await conexion.query(
      "SELECT * FROM empleados WHERE id_empleado = ?",
      [id]
    );
    const { password: pass, ...empleadoActualizado } = getResults[0];
    res.json({
      success: true,
      message: "Empleado actualizado exitosamente",
      data: empleadoActualizado
    });
  } catch (error) {
    console.log("❌ Error al actualizar:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar empleado",
      error: error.message
    });
  }
});

// 🗑️ ELIMINAR EMPLEADO - VERSIÓN MEJORADA CON MANEJO DE DEPENDENCIAS
app.delete("/api/empleados/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando empleado ID: ${id}`);

    // 1. Verificar si el empleado existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM empleados WHERE id_empleado = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado"
      });
    }

    // 2. VERIFICAR DEPENDENCIAS - Ver si tiene citas asociadas
    const [citas] = await conexion.query(
      "SELECT COUNT(*) as total FROM citas WHERE id_empleado = ?",
      [id]
    );

    if (citas[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el empleado porque tiene ${citas[0].total} cita(s) asociadas. Primero elimina o reasigna las citas.`
      });
    }

    // 3. Verificar si tiene ventas asociadas (si existe la tabla)
    try {
      const [ventas] = await conexion.query(
        "SELECT COUNT(*) as total FROM ventas WHERE id_empleado = ?",
        [id]
      );
      
      if (ventas[0].total > 0) {
        return res.status(400).json({
          success: false,
          message: `No se puede eliminar el empleado porque tiene ${ventas[0].total} venta(s) asociadas.`
        });
      }
    } catch (error) {
      // Si la columna id_empleado no existe en ventas, ignorar
      console.log("ℹ️ La tabla ventas no tiene columna id_empleado");
    }

    // 4. Si no hay dependencias, eliminar
    const [result] = await conexion.query(
      "DELETE FROM empleados WHERE id_empleado = ?",
      [id]
    );

    console.log(`✅ Empleado ID ${id} eliminado`);
    res.json({
      success: true,
      message: "Empleado eliminado exitosamente"
    });

  } catch (error) {
    console.log("❌ Error al eliminar empleado:", error);
    
    // Detectar error específico de clave foránea
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        success: false,
        message: "No se puede eliminar el empleado porque tiene registros relacionados en otras tablas (citas, ventas, etc.)",
        error: "El empleado está siendo referenciado en otra tabla"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar empleado",
      error: error.message,
      code: error.code || 'unknown'
    });
  }
});

// 🔄 CAMBIAR ESTADO
app.patch("/api/empleados/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (typeof activo !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "El estado debe ser booleano (true/false)"
      });
    }

    const [result] = await conexion.query(
      "UPDATE empleados SET activo = ? WHERE id_empleado = ?",
      [activo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado"
      });
    }

    res.json({
      success: true,
      message: `Empleado ${activo ? 'activado' : 'desactivado'} exitosamente`
    });
  } catch (error) {
    console.log("❌ Error al cambiar estado:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado",
      error: error.message
    });
  }
});

// ============================================
// 🧪 RUTA DE PRUEBA
// ============================================
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ API funcionando correctamente",
    endpoints: {
      login: "POST /api/auth/login",
      empleados: "GET /api/empleados",
      buscar: "GET /api/empleados/search?termino=nombre",
      crear: "POST /api/empleados",
      actualizar: "PUT /api/empleados/:id",
      eliminar: "DELETE /api/empleados/:id",
      estado: "PATCH /api/empleados/:id/status"
    }
  });
});


// ============================================
// 📦 CRUD DE PRODUCTOS
// ============================================

// 📋 OBTENER TODOS LOS PRODUCTOS
app.get("/api/productos", async (req, res) => {
  try {
    console.log("📋 Obteniendo todos los productos...");
    const query = "SELECT * FROM productos ORDER BY id_producto DESC";
    const [results] = await conexion.query(query);

    console.log(`✅ ${results.length} productos encontrados`);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log("❌ Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message
    });
  }
});

// 🔍 BUSCAR PRODUCTOS POR NOMBRE
app.get("/api/productos/search", async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino || termino.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Se requiere un término de búsqueda"
      });
    }

    console.log(`🔍 Buscando productos con: "${termino}"`);
    const query = "SELECT * FROM productos WHERE nombre_producto LIKE ?";
    const [results] = await conexion.query(query, [`%${termino}%`]);

    console.log(`✅ ${results.length} productos encontrados`);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log("❌ Error al buscar productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar productos",
      error: error.message
    });
  }
});

// ➕ CREAR NUEVO PRODUCTO (CON IMAGEN BASE64)
app.post("/api/productos", async (req, res) => {
  try {
    const { nombre_producto, descripcion, precio, stock, imagen } = req.body;
    console.log("📝 Creando nuevo producto:", { 
      nombre_producto, 
      precio, 
      stock,
      tiene_imagen: imagen ? '✅' : '❌'
    });

    // VALIDACIONES
    if (!nombre_producto || !nombre_producto.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre del producto es obligatorio"
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    if (stock === undefined || stock === null || parseInt(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "El stock no puede ser negativo"
      });
    }

    // Verificar si el producto ya existe (por nombre)
    const [checkResults] = await conexion.query(
      "SELECT id_producto FROM productos WHERE nombre_producto = ?",
      [nombre_producto.trim()]
    );

    if (checkResults.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El producto ya existe"
      });
    }

    // Insertar producto con imagen
    const insertQuery = `
      INSERT INTO productos 
      (nombre_producto, descripcion, precio, stock, imagen) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await conexion.query(insertQuery, [
      nombre_producto.trim(),
      descripcion || '',
      parseFloat(precio),
      parseInt(stock) || 0,
      imagen || null // Guarda la imagen Base64
    ]);

    console.log(`✅ Producto creado con ID: ${result.insertId}`);
    
    // Obtener producto creado
    const [getResults] = await conexion.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al crear producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
      error: error.message
    });
  }
});

// ✏️ ACTUALIZAR PRODUCTO (CON IMAGEN BASE64)
app.put("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_producto, descripcion, precio, stock, imagen } = req.body;
    console.log(`✏️ Actualizando producto ID: ${id}`);

    // VALIDACIONES
    if (!nombre_producto || !nombre_producto.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre del producto es obligatorio"
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    // Verificar si existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    // Actualizar con imagen
    const updateQuery = `
      UPDATE productos 
      SET nombre_producto = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?
      WHERE id_producto = ?
    `;
    
    await conexion.query(updateQuery, [
      nombre_producto.trim(),
      descripcion || '',
      parseFloat(precio),
      parseInt(stock) || 0,
      imagen || null, // Actualiza la imagen Base64
      id
    ]);

    console.log(`✅ Producto ID ${id} actualizado`);
    
    // Obtener producto actualizado
    const [getResults] = await conexion.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar producto",
      error: error.message
    });
  }
});

// 🗑️ ELIMINAR PRODUCTO
app.delete("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando producto ID: ${id}`);

    // Verificar si existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    const [result] = await conexion.query(
      "DELETE FROM productos WHERE id_producto = ?",
      [id]
    );

    console.log(`✅ Producto ID ${id} eliminado`);
    res.json({
      success: true,
      message: "Producto eliminado exitosamente"
    });
  } catch (error) {
    console.log("❌ Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar producto",
      error: error.message
    });
  }
});





// ============================================
// 💇 CRUD DE SERVICIOS
// ============================================

// 📋 OBTENER TODOS LOS SERVICIOS
app.get("/api/servicios", async (req, res) => {
  try {
    console.log("📋 Obteniendo todos los servicios...");
    const query = "SELECT * FROM servicios ORDER BY id_servicio DESC";
    const [results] = await conexion.query(query);

    console.log(`✅ ${results.length} servicios encontrados`);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log("❌ Error al obtener servicios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener servicios",
      error: error.message
    });
  }
});

// 🔍 BUSCAR SERVICIOS POR NOMBRE
app.get("/api/servicios/search", async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino || termino.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Se requiere un término de búsqueda"
      });
    }

    console.log(`🔍 Buscando servicios con: "${termino}"`);
    const query = "SELECT * FROM servicios WHERE nombre_servicio LIKE ?";
    const [results] = await conexion.query(query, [`%${termino}%`]);

    console.log(`✅ ${results.length} servicios encontrados`);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log("❌ Error al buscar servicios:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar servicios",
      error: error.message
    });
  }
});

// ➕ CREAR NUEVO SERVICIO (CON IMAGEN BASE64)
app.post("/api/servicios", async (req, res) => {
  try {
    const { nombre_servicio, descripcion, precio, imagen } = req.body;
    console.log("📝 Creando nuevo servicio:", { 
      nombre_servicio, 
      precio,
      tiene_imagen: imagen ? '✅' : '❌'
    });

    // VALIDACIONES
    if (!nombre_servicio || !nombre_servicio.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre del servicio es obligatorio"
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    // Verificar si el servicio ya existe (por nombre)
    const [checkResults] = await conexion.query(
      "SELECT id_servicio FROM servicios WHERE nombre_servicio = ?",
      [nombre_servicio.trim()]
    );

    if (checkResults.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El servicio ya existe"
      });
    }

    // Insertar servicio con imagen
    const insertQuery = `
      INSERT INTO servicios 
      (nombre_servicio, descripcion, precio, imagen) 
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await conexion.query(insertQuery, [
      nombre_servicio.trim(),
      descripcion || '',
      parseFloat(precio),
      imagen || null // Guarda la imagen Base64
    ]);

    console.log(`✅ Servicio creado con ID: ${result.insertId}`);
    
    // Obtener servicio creado
    const [getResults] = await conexion.query(
      "SELECT * FROM servicios WHERE id_servicio = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Servicio creado exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al crear servicio:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear servicio",
      error: error.message
    });
  }
});

// ✏️ ACTUALIZAR SERVICIO (CON IMAGEN BASE64)
app.put("/api/servicios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_servicio, descripcion, precio, imagen } = req.body;
    console.log(`✏️ Actualizando servicio ID: ${id}`);

    // VALIDACIONES
    if (!nombre_servicio || !nombre_servicio.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre del servicio es obligatorio"
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    // Verificar si existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM servicios WHERE id_servicio = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado"
      });
    }

    // Actualizar con imagen
    const updateQuery = `
      UPDATE servicios 
      SET nombre_servicio = ?, descripcion = ?, precio = ?, imagen = ?
      WHERE id_servicio = ?
    `;
    
    await conexion.query(updateQuery, [
      nombre_servicio.trim(),
      descripcion || '',
      parseFloat(precio),
      imagen || null, // Actualiza la imagen Base64
      id
    ]);

    console.log(`✅ Servicio ID ${id} actualizado`);
    
    // Obtener servicio actualizado
    const [getResults] = await conexion.query(
      "SELECT * FROM servicios WHERE id_servicio = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Servicio actualizado exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al actualizar servicio:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar servicio",
      error: error.message
    });
  }
});

// 🗑️ ELIMINAR SERVICIO
app.delete("/api/servicios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando servicio ID: ${id}`);

    // Verificar si existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM servicios WHERE id_servicio = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado"
      });
    }

    const [result] = await conexion.query(
      "DELETE FROM servicios WHERE id_servicio = ?",
      [id]
    );

    console.log(`✅ Servicio ID ${id} eliminado`);
    res.json({
      success: true,
      message: "Servicio eliminado exitosamente"
    });
  } catch (error) {
    console.log("❌ Error al eliminar servicio:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar servicio",
      error: error.message
    });
  }
});







// ============================================
// 👥 CRUD DE CLIENTES
// ============================================

// 📋 OBTENER TODOS LOS CLIENTES
app.get("/api/clientes", async (req, res) => {
  try {
    console.log("📋 Obteniendo todos los clientes...");
    const query = "SELECT * FROM clientes ORDER BY id_cliente DESC";
    const [results] = await conexion.query(query);

    console.log(`✅ ${results.length} clientes encontrados`);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log("❌ Error al obtener clientes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener clientes",
      error: error.message
    });
  }
});

// 🔍 BUSCAR CLIENTES POR NOMBRE
app.get("/api/clientes/search", async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino || termino.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Se requiere un término de búsqueda"
      });
    }

    console.log(`🔍 Buscando clientes con: "${termino}"`);
    const query = "SELECT * FROM clientes WHERE nombre LIKE ?";
    const [results] = await conexion.query(query, [`%${termino}%`]);

    console.log(`✅ ${results.length} clientes encontrados`);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log("❌ Error al buscar clientes:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar clientes",
      error: error.message
    });
  }
});

// 👤 OBTENER CLIENTE POR ID
app.get("/api/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👤 Obteniendo cliente ID: ${id}`);
    
    const query = "SELECT * FROM clientes WHERE id_cliente = ?";
    const [results] = await conexion.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  } catch (error) {
    console.log("❌ Error al obtener cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener cliente",
      error: error.message
    });
  }
});

// ➕ CREAR NUEVO CLIENTE
app.post("/api/clientes", async (req, res) => {
  try {
    const { nombre, telefono, correo } = req.body;
    console.log("📝 Creando nuevo cliente:", { nombre, telefono, correo });

    // VALIDACIONES
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre del cliente es obligatorio"
      });
    }

    // Verificar si el correo ya existe (solo si se proporcionó)
    if (correo && correo.trim()) {
      const [checkResults] = await conexion.query(
        "SELECT id_cliente FROM clientes WHERE correo = ?",
        [correo.trim()]
      );

      if (checkResults.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El correo ya está registrado"
        });
      }
    }

    // Insertar cliente
    const insertQuery = `
      INSERT INTO clientes 
      (nombre, telefono, correo) 
      VALUES (?, ?, ?)
    `;
    
    const [result] = await conexion.query(insertQuery, [
      nombre.trim(),
      telefono?.trim() || null,
      correo?.trim() || null
    ]);

    console.log(`✅ Cliente creado con ID: ${result.insertId}`);
    
    // Obtener cliente creado
    const [getResults] = await conexion.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al crear cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear cliente",
      error: error.message
    });
  }
});

// ✏️ ACTUALIZAR CLIENTE
app.put("/api/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo } = req.body;
    console.log(`✏️ Actualizando cliente ID: ${id}`);

    // VALIDACIONES
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre del cliente es obligatorio"
      });
    }

    // Verificar si existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    // Actualizar
    const updateQuery = `
      UPDATE clientes 
      SET nombre = ?, telefono = ?, correo = ?
      WHERE id_cliente = ?
    `;
    
    await conexion.query(updateQuery, [
      nombre.trim(),
      telefono?.trim() || null,
      correo?.trim() || null,
      id
    ]);

    console.log(`✅ Cliente ID ${id} actualizado`);
    
    // Obtener cliente actualizado
    const [getResults] = await conexion.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Cliente actualizado exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al actualizar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar cliente",
      error: error.message
    });
  }
});

// 🗑️ ELIMINAR CLIENTE
app.delete("/api/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando cliente ID: ${id}`);

    // Verificar si existe
    const [checkResults] = await conexion.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    const [result] = await conexion.query(
      "DELETE FROM clientes WHERE id_cliente = ?",
      [id]
    );

    console.log(`✅ Cliente ID ${id} eliminado`);
    res.json({
      success: true,
      message: "Cliente eliminado exitosamente"
    });
  } catch (error) {
    console.log("❌ Error al eliminar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar cliente",
      error: error.message
    });
  }
});







// ============================================
// 📅 CRUD DE CITAS
// ============================================

// 📋 OBTENER TODAS LAS CITAS CON NOMBRES
app.get("/api/citas", async (req, res) => {
  try {
    console.log("📋 Obteniendo todas las citas...");
    const query = `
      SELECT 
        c.id_cita,
        c.fecha,
        c.hora,
        c.estado,
        c.id_cliente,
        cl.nombre AS cliente,
        c.id_empleado,
        e.nombre AS empleado,
        c.id_servicio,
        s.nombre_servicio AS servicio
      FROM citas c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
      LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
      ORDER BY c.id_cita DESC
    `;
    const [results] = await conexion.query(query);
    res.json({ success: true, data: results });
  } catch (error) {
    console.log("❌ Error al obtener citas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener citas",
      error: error.message
    });
  }
});

// 📋 OBTENER CLIENTES PARA SELECT
app.get("/api/citas/clientes", async (req, res) => {
  try {
    const [results] = await conexion.query(
      "SELECT id_cliente, nombre FROM clientes ORDER BY nombre"
    );
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener clientes",
      error: error.message
    });
  }
});

// 📋 OBTENER EMPLEADOS PARA SELECT
app.get("/api/citas/empleados", async (req, res) => {
  try {
    const [results] = await conexion.query(
      "SELECT id_empleado, nombre FROM empleados ORDER BY nombre"
    );
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener empleados",
      error: error.message
    });
  }
});

// 📋 OBTENER SERVICIOS PARA SELECT
app.get("/api/citas/servicios", async (req, res) => {
  try {
    const [results] = await conexion.query(
      "SELECT id_servicio, nombre_servicio FROM servicios ORDER BY nombre_servicio"
    );
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener servicios",
      error: error.message
    });
  }
});

// 🔍 BUSCAR CITA POR ID
app.get("/api/citas/search", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Se requiere un ID de cita"
      });
    }
    const query = `
      SELECT 
        c.id_cita,
        c.fecha,
        c.hora,
        c.estado,
        c.id_cliente,
        cl.nombre AS cliente,
        c.id_empleado,
        e.nombre AS empleado,
        c.id_servicio,
        s.nombre_servicio AS servicio
      FROM citas c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
      LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE c.id_cita = ?
    `;
    const [results] = await conexion.query(query, [id]);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar cita",
      error: error.message
    });
  }
});

// 👤 OBTENER CITA POR ID
app.get("/api/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        c.id_cita,
        c.fecha,
        c.hora,
        c.estado,
        c.id_cliente,
        cl.nombre AS cliente,
        c.id_empleado,
        e.nombre AS empleado,
        c.id_servicio,
        s.nombre_servicio AS servicio
      FROM citas c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
      LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE c.id_cita = ?
    `;
    const [results] = await conexion.query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada"
      });
    }
    res.json({ success: true, data: results[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener cita",
      error: error.message
    });
  }
});

// ➕ CREAR NUEVA CITA
app.post("/api/citas", async (req, res) => {
  try {
    const { fecha, hora, id_cliente, id_empleado, id_servicio, estado } = req.body;
    console.log("📝 Creando nueva cita:", { fecha, hora, id_cliente, id_empleado, id_servicio, estado });

    if (!fecha || !hora || !id_cliente || !id_empleado || !id_servicio) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios"
      });
    }

    const insertQuery = `
      INSERT INTO citas 
      (fecha, hora, id_cliente, id_empleado, id_servicio, estado) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await conexion.query(insertQuery, [
      fecha, hora, id_cliente, id_empleado, id_servicio, estado || 'Pendiente'
    ]);

    const [getResults] = await conexion.query(`
      SELECT 
        c.id_cita,
        c.fecha,
        c.hora,
        c.estado,
        c.id_cliente,
        cl.nombre AS cliente,
        c.id_empleado,
        e.nombre AS empleado,
        c.id_servicio,
        s.nombre_servicio AS servicio
      FROM citas c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
      LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE c.id_cita = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Cita creada exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al crear cita:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear cita",
      error: error.message
    });
  }
});

// ✏️ ACTUALIZAR CITA
app.put("/api/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, id_cliente, id_empleado, id_servicio, estado } = req.body;

    const [checkResults] = await conexion.query(
      "SELECT * FROM citas WHERE id_cita = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada"
      });
    }

    const updateQuery = `
      UPDATE citas 
      SET fecha = ?, hora = ?, id_cliente = ?, id_empleado = ?, id_servicio = ?, estado = ?
      WHERE id_cita = ?
    `;
    
    await conexion.query(updateQuery, [
      fecha, hora, id_cliente, id_empleado, id_servicio, estado || 'Pendiente', id
    ]);

    const [getResults] = await conexion.query(`
      SELECT 
        c.id_cita,
        c.fecha,
        c.hora,
        c.estado,
        c.id_cliente,
        cl.nombre AS cliente,
        c.id_empleado,
        e.nombre AS empleado,
        c.id_servicio,
        s.nombre_servicio AS servicio
      FROM citas c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
      LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE c.id_cita = ?
    `, [id]);

    res.json({
      success: true,
      message: "Cita actualizada exitosamente",
      data: getResults[0]
    });
  } catch (error) {
    console.log("❌ Error al actualizar cita:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar cita",
      error: error.message
    });
  }
});

// 🗑️ ELIMINAR CITA
app.delete("/api/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [checkResults] = await conexion.query(
      "SELECT * FROM citas WHERE id_cita = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada"
      });
    }

    await conexion.query("DELETE FROM citas WHERE id_cita = ?", [id]);

    res.json({
      success: true,
      message: "Cita eliminada exitosamente"
    });
  } catch (error) {
    console.log("❌ Error al eliminar cita:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar cita",
      error: error.message
    });
  }
});



// ============================================
// 📊 DASHBOARD - ESTADÍSTICAS
// ============================================

// 📊 OBTENER ESTADÍSTICAS DEL DASHBOARD
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    console.log("📊 Obteniendo estadísticas del dashboard...");

    // Total de clientes
    const [clientes] = await conexion.query("SELECT COUNT(*) as total FROM clientes");
    
    // Total de citas de hoy
    const [citasHoy] = await conexion.query(
      "SELECT COUNT(*) as total FROM citas WHERE fecha = CURDATE()"
    );
    
    // Total de servicios
    const [servicios] = await conexion.query("SELECT COUNT(*) as total FROM servicios");
    
    // Total de citas pendientes
    const [pendientes] = await conexion.query(
      "SELECT COUNT(*) as total FROM citas WHERE estado = 'Pendiente'"
    );

    // Total de productos
    const [productos] = await conexion.query("SELECT COUNT(*) as total FROM productos");
    
    // Total de empleados
    const [empleados] = await conexion.query("SELECT COUNT(*) as total FROM empleados");

    console.log("📊 Estadísticas:", {
      clientes: clientes[0].total,
      citasHoy: citasHoy[0].total,
      servicios: servicios[0].total,
      pendientes: pendientes[0].total,
      productos: productos[0].total,
      empleados: empleados[0].total
    });

    res.json({
      success: true,
      data: {
        clientes: clientes[0].total || 0,
        citasHoy: citasHoy[0].total || 0,
        servicios: servicios[0].total || 0,
        pendientes: pendientes[0].total || 0,
        productos: productos[0].total || 0,
        empleados: empleados[0].total || 0,
        ventasHoy: 0,
        montoVentasHoy: 0
      }
    });
  } catch (error) {
    console.log("❌ Error al obtener estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
});

// 📋 OBTENER CITAS DE HOY PARA EL DASHBOARD
app.get("/api/dashboard/citas-hoy", async (req, res) => {
  try {
    console.log("📋 Obteniendo citas de hoy...");
    const query = `
      SELECT 
        c.id_cita,
        c.fecha,
        c.hora,
        c.estado,
        cl.nombre AS cliente,
        e.nombre AS empleado,
        s.nombre_servicio AS servicio
      FROM citas c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
      LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE c.fecha = CURDATE()
      ORDER BY c.hora ASC
    `;
    const [results] = await conexion.query(query);

    // Formatear hora para mostrar (quitar segundos)
    const citasFormateadas = results.map(cita => ({
      ...cita,
      hora: cita.hora ? cita.hora.substring(0, 5) : null // "HH:MM"
    }));

    console.log(`✅ ${citasFormateadas.length} citas encontradas para hoy`);
    res.json({
      success: true,
      data: citasFormateadas
    });
  } catch (error) {
    console.log("❌ Error al obtener citas de hoy:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener citas de hoy",
      error: error.message
    });
  }
});





// 🧪 ENDPOINT DE PRUEBA
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ Servidor funcionando",
    endpoints: {
      ventas: "/api/ventas",
      clientes: "/api/ventas/clientes",
      productos: "/api/ventas/productos"
    }
  });
});




// ============================================
// 💰 CRUD DE VENTAS - CÓDIGO COMPLETO
// ============================================

// 📋 OBTENER CLIENTES PARA SELECT
app.get("/api/ventas/clientes", async (req, res) => {
  try {
    console.log("📋 Obteniendo clientes para ventas...");
    const [results] = await conexion.query(
      "SELECT id_cliente, nombre FROM clientes ORDER BY nombre"
    );
    res.json({ success: true, data: results });
  } catch (error) {
    console.log("❌ Error al obtener clientes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 📋 OBTENER PRODUCTOS PARA SELECT
app.get("/api/ventas/productos", async (req, res) => {
  try {
    console.log("📋 Obteniendo productos para ventas...");
    const [results] = await conexion.query(
      "SELECT id_producto, nombre_producto, precio, stock FROM productos ORDER BY nombre_producto"
    );
    res.json({ success: true, data: results });
  } catch (error) {
    console.log("❌ Error al obtener productos:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 📋 OBTENER TODAS LAS VENTAS
app.get("/api/ventas", async (req, res) => {
  try {
    console.log("📋 Obteniendo todas las ventas...");
    
    const query = `
      SELECT 
        v.id_venta,
        v.fecha,
        v.total,
        v.estado,
        c.nombre AS cliente,
        c.id_cliente
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      ORDER BY v.id_venta DESC
    `;
    
    const [ventas] = await conexion.query(query);
    console.log(`✅ ${ventas.length} ventas encontradas`);

    // Obtener detalles de cada venta
    for (let venta of ventas) {
      try {
        const [detalles] = await conexion.query(`
          SELECT 
            d.cantidad,
            d.precio,
            d.subtotal,
            p.nombre_producto AS nombre
          FROM detalle_venta d
          LEFT JOIN productos p ON d.id_producto = p.id_producto
          WHERE d.id_venta = ?
        `, [venta.id_venta]);
        venta.productos = detalles || [];
      } catch (error) {
        venta.productos = [];
      }
    }

    res.json({ success: true, data: ventas });
  } catch (error) {
    console.log("❌ Error al obtener ventas:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔍 BUSCAR VENTAS POR CLIENTE
app.get("/api/ventas/search", async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino || termino.trim() === "") {
      return res.status(400).json({ success: false, message: "Se requiere un término de búsqueda" });
    }

    console.log(`🔍 Buscando ventas con: "${termino}"`);
    const query = `
      SELECT 
        v.id_venta,
        v.fecha,
        v.total,
        v.estado,
        c.nombre AS cliente
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      WHERE c.nombre LIKE ?
      ORDER BY v.id_venta DESC
    `;
    const [ventas] = await conexion.query(query, [`%${termino}%`]);

    for (let venta of ventas) {
      try {
        const [detalles] = await conexion.query(`
          SELECT 
            d.cantidad,
            d.precio,
            d.subtotal,
            p.nombre_producto AS nombre
          FROM detalle_venta d
          LEFT JOIN productos p ON d.id_producto = p.id_producto
          WHERE d.id_venta = ?
        `, [venta.id_venta]);
        venta.productos = detalles || [];
      } catch (error) {
        venta.productos = [];
      }
    }

    res.json({ success: true, data: ventas });
  } catch (error) {
    console.log("❌ Error al buscar ventas:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ➕ CREAR NUEVA VENTA
app.post("/api/ventas", async (req, res) => {
  try {
    console.log("📝 Creando nueva venta...");
    const { id_cliente, fecha, productos, total, estado } = req.body;

    if (!id_cliente) {
      return res.status(400).json({ success: false, message: "El cliente es obligatorio" });
    }

    if (!productos || productos.length === 0) {
      return res.status(400).json({ success: false, message: "Debes agregar al menos un producto" });
    }

    // Verificar stock
    for (let producto of productos) {
      const [check] = await conexion.query(
        "SELECT stock FROM productos WHERE id_producto = ?",
        [producto.id_producto]
      );
      
      if (check.length === 0) {
        return res.status(400).json({ success: false, message: `El producto con ID ${producto.id_producto} no existe` });
      }
      
      if (check[0].stock < producto.cantidad) {
        return res.status(400).json({ success: false, message: `Stock insuficiente. Disponible: ${check[0].stock}` });
      }
    }

    await conexion.query("START TRANSACTION");

    try {
      const fechaVenta = fecha || new Date().toISOString().split('T')[0];
      
      const [ventaResult] = await conexion.query(
        `INSERT INTO ventas (fecha, id_cliente, total, estado) VALUES (?, ?, ?, ?)`,
        [fechaVenta, id_cliente, total || 0, estado || 'Completada']
      );

      const id_venta = ventaResult.insertId;
      console.log(`✅ Venta insertada con ID: ${id_venta}`);

      for (let producto of productos) {
        const subtotal = producto.cantidad * producto.precio;
        
        await conexion.query(
          `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?)`,
          [id_venta, producto.id_producto, producto.cantidad, producto.precio, subtotal]
        );

        await conexion.query(
          `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
          [producto.cantidad, producto.id_producto]
        );
      }

      await conexion.query("COMMIT");

      res.status(201).json({
        success: true,
        message: "Venta creada exitosamente",
        data: { id_venta }
      });

    } catch (error) {
      await conexion.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.log("❌ Error al crear venta:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🗑️ ELIMINAR VENTA
app.delete("/api/ventas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando venta ID: ${id}`);

    const [checkResults] = await conexion.query(
      "SELECT * FROM ventas WHERE id_venta = ?",
      [id]
    );

    if (checkResults.length === 0) {
      return res.status(404).json({ success: false, message: "Venta no encontrada" });
    }

    await conexion.query("START TRANSACTION");

    try {
      const [detalles] = await conexion.query(
        "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ?",
        [id]
      );

      for (let detalle of detalles) {
        await conexion.query(
          `UPDATE productos SET stock = stock + ? WHERE id_producto = ?`,
          [detalle.cantidad, detalle.id_producto]
        );
      }

      await conexion.query("DELETE FROM detalle_venta WHERE id_venta = ?", [id]);
      await conexion.query("DELETE FROM ventas WHERE id_venta = ?", [id]);

      await conexion.query("COMMIT");

      res.json({ success: true, message: "Venta eliminada exitosamente" });
    } catch (error) {
      await conexion.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.log("❌ Error al eliminar venta:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});





// ============================================
// 🚀 INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   🔐 POST  /api/auth/login`);
  console.log(`   👥 GET   /api/empleados`);
  console.log(`   🔍 GET   /api/empleados/search?termino=`);
  console.log(`   👤 GET   /api/empleados/:id`);
  console.log(`   ➕ POST  /api/empleados`);
  console.log(`   ✏️ PUT   /api/empleados/:id`);
  console.log(`   🗑️ DELETE /api/empleados/:id`);
  console.log(`   🔄 PATCH /api/empleados/:id/status`);
  console.log(`   🧪 GET   /api/test`);
});