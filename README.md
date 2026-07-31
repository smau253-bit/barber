# ✂️ Sistema de Gestión de Barbería "SHENLY BARBER"

Aplicación web desarrollada para administrar una barbería de manera eficiente.  
El sistema permite gestionar clientes, empleados, servicios, productos, citas y ventas, facilitando el control del negocio mediante una interfaz moderna y una API REST.

**Stack:** **React + Vite** (Frontend), **Node.js + Express** (Backend), **MySQL con XAMPP** (Base de datos).

---

# Estructura del proyecto

```text
barberia/
│
├── backend/
│   ├── db.js                    Conexión a MySQL
│   ├── server.js                Servidor principal
│   ├── routes/
│   │   └── auth.js              Rutas de autenticación
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│
├── pagina estatica/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/              Imágenes e iconos
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── paginas/
│   │   │   ├── inicio/
│   │   │   ├── sesion/
│   │   │   ├── dashboard/
│   │   │   ├── clientes/
│   │   │   ├── empleados/
│   │   │   ├── servicios/
│   │   │   ├── productos/
│   │   │   ├── citas/
│   │   │   ├── ventas/
│   │   │   ├── catalogo/
│   │   │   └── detalle_catalogo/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Tecnologías utilizadas

## Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- React Router DOM
- React Icons


## Backend

- Node.js
- Express
- CORS
- dotenv
- bcryptjs
- JSON Web Token (JWT)


## Base de datos

- MySQL
- mysql2
- XAMPP

---

# Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

- Visual Studio Code
- Node.js 18 o superior
- npm
- XAMPP
- MySQL

---

# Paso 1 — Crear la base de datos

1. Abrir XAMPP.
2. Iniciar Apache y MySQL.
3. Abrir phpMyAdmin.
4. Crear una base de datos llamada:

```sql
barberia
```

5. Importar el archivo SQL del proyecto.

Tablas principales:

- clientes
- empleados
- servicios
- productos
- citas
- ventas
- usuarios

---

# Paso 2 — Configurar el Backend

Entrar a la carpeta backend.

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Dependencias utilizadas:

- express
- cors
- mysql2
- dotenv
- bcryptjs
- jsonwebtoken
- nodemon


Crear archivo `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=barberia

JWT_SECRET=clave_secreta
```


Iniciar el servidor:

```bash
node server.js
```

o en desarrollo:

```bash
npm run dev
```


El servidor iniciará en:

```
http://localhost:3000
```


La ruta principal mostrará:

```
API Barbería
```

---

# Paso 3 — Configurar el Frontend

Abrir otra terminal.

Entrar al proyecto frontend:

```bash
cd "pagina estatica"
```


Instalar dependencias:

```bash
npm install
```


Ejecutar proyecto:

```bash
npm run dev
```


Vite iniciará normalmente en:

```
http://localhost:5173
```

---

# Inicio de sesión

El sistema cuenta con autenticación mediante JWT.

El login permite:

- Validar usuario.
- Verificar contraseña.
- Generar token JWT.
- Mantener sesión segura.


Flujo:

1. El usuario envía sus credenciales.
2. El backend valida la información.
3. Se genera un token JWT.
4. El frontend guarda el token.
5. Las peticiones protegidas utilizan autorización.

---

# API REST

La aplicación cuenta con una API desarrollada en Express.

---

# Página principal

```
GET /
```

Respuesta:

```
API Barbería
```

---

# Autenticación

## Iniciar sesión

```
POST /api/auth/login
```

Permite acceder al sistema.


## Registrar usuario

```
POST /api/auth/register
```


---

# Clientes

## Obtener clientes

```
GET /api/clientes
```


## Agregar cliente

```
POST /api/clientes
```


## Actualizar cliente

```
PUT /api/clientes/:id
```


## Eliminar cliente

```
DELETE /api/clientes/:id
```


Información del cliente:

- Nombre
- Teléfono
- Correo
- Dirección

---

# Empleados / Barberos

## Obtener empleados

```
GET /api/empleados
```


## Agregar empleado

```
POST /api/empleados
```


## Actualizar empleado

```
PUT /api/empleados/:id
```


## Eliminar empleado

```
DELETE /api/empleados/:id
```


Información:

- Nombre
- Especialidad
- Teléfono
- Correo
- Horario
- Comisión

---

# Servicios

## Obtener servicios

```
GET /api/servicios
```


## Agregar servicio

```
POST /api/servicios
```


Campos:

- Nombre
- Descripción
- Precio
- Duración
- Categoría

---

# Productos

## Obtener productos

```
GET /api/productos
```


## Agregar producto

```
POST /api/productos
```


Campos:

- Nombre
- Descripción
- Precio
- Stock
- Categoría
- Imagen

---

# Citas

## Obtener citas

```
GET /api/citas
```


## Crear cita

```
POST /api/citas
```


## Actualizar cita

```
PUT /api/citas/:id
```


## Cancelar cita

```
DELETE /api/citas/:id
```


Información:

- Cliente
- Empleado
- Servicio
- Fecha
- Hora
- Estado
- Notas


Estados:

- Pendiente
- Confirmada
- Completada
- Cancelada

---

# Ventas

## Obtener ventas

```
GET /api/ventas
```


## Registrar venta

```
POST /api/ventas
```


## Actualizar venta

```
PUT /api/ventas/:id
```


## Eliminar venta

```
DELETE /api/ventas/:id
```


Información:

- Cliente
- Empleado
- Productos
- Servicios
- Total
- Fecha
- Método de pago

---

# Estadísticas

El sistema cuenta con un Dashboard para mostrar información del negocio.


## Estadísticas generales

```
GET /api/dashboard/stats
```


Obtiene:

- Total de clientes
- Total de empleados
- Citas del día
- Ventas realizadas
- Ingresos


## Ventas mensuales

```
GET /api/dashboard/ventas-mensuales
```


## Ingresos

```
GET /api/dashboard/ingresos
```

---

# Funcionalidades incluidas

✅ Inicio de sesión.

✅ Dashboard administrativo.

✅ Gestión de clientes.

✅ Gestión de empleados.

✅ Gestión de servicios.

✅ Gestión de productos.

✅ Sistema de citas.

✅ Registro de ventas.

✅ Catálogo de productos y servicios.

✅ Detalle de productos.

✅ Estadísticas del negocio.

✅ API REST.

✅ Base de datos MySQL.

✅ Diseño responsive.

---

# Arquitectura


## Frontend

- React.
- Componentes reutilizables.
- Axios para comunicación con API.
- CSS modularizado.


## Backend

- Node.js.
- Express.
- API REST.
- Consultas SQL con mysql2.
- Manejo de autenticación.


## Base de datos

- MySQL.
- Modelo relacional.
- Relaciones entre tablas.
- Consultas optimizadas.

---

# Características

- Arquitectura Cliente - Servidor.
- API REST funcional.
- Comunicación mediante JSON.
- Diseño modular.
- Código escalable.
- Organización por componentes.
- Seguridad mediante JWT.
- Contraseñas protegidas con bcrypt.

---

# Capturas

Puedes agregar imágenes del sistema.

```
README/

login.png

dashboard.png

clientes.png

citas.png

servicios.png

productos.png

empleados.png

ventas.png
```


Ejemplo:

```markdown
## Dashboard

![Dashboard](README/dashboard.png)
```

---

# Variables de entorno


Backend `.env`

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=barberia

JWT_SECRET=clave_secreta
JWT_EXPIRE=7d
```


Frontend `.env`

```env
VITE_API_URL=http://localhost:3000/api
```