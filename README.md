# Sistema de Gestión de Barbería

> Guía de producción y clonación: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). El repositorio lleva el esquema en [db/schema.sql](db/schema.sql) y, para esta instalación privada, un snapshot de cuentas en [db/seed-users.sql](db/seed-users.sql). Ese snapshot contiene datos personales y hashes: mantén el repositorio privado.

Sistema completo de gestión para barberías con roles de Barbero, Cobrador y Administrador. Desarrollado con React, Vite, Bootstrap, Node.js, Express y SQLite.

## 🚀 Características

### Rol Barbero
- ✂️ Registro de cortes diarios con precio en Quetzales
- 📊 Visualización de cortes del día en tiempo real
- 💰 Cálculo automático de ganancias según porcentaje
- 🔢 Contador automático de cortes que se reinicia diariamente
- 🗑️ Eliminación de cortes registrados

### Rol Cobrador
- 👥 Vista de todos los barberos del día
- 💵 Cálculo automático de pagos por barbero
- 📈 Resumen diario de cortes e ingresos
- 🔍 Detalles expandibles de cortes por barbero
- ⚡ Actualización automática cada 30 segundos

### Rol Administrador
- 👤 CRUD completo de usuarios (Crear, Leer, Actualizar, Eliminar)
- 📊 Generación de reportes por fecha (diario, semanal, mensual)
- 🎯 Reportes unificados de todos los barberos
- 📈 Estadísticas detalladas de ingresos y cortes
- 💯 Edición de porcentajes de ganancia por barbero
- 📥 Exportación de reportes a CSV

## 🛠️ Tecnologías

### Frontend
- ⚛️ React 18
- ⚡ Vite
- 🎨 Bootstrap 5 + React Bootstrap
- ✨ Framer Motion (Animaciones)
- 🚦 React Router DOM
- 📡 Axios
- 📅 date-fns

### Backend
- 🟢 Node.js
- 🚂 Express
- 🗄️ Sequelize ORM
- 💾 SQLite (Base de datos local)
- 🔐 JWT (Autenticación)
- 🔒 bcryptjs (Hash de contraseñas)

## Requisitos previos

- Node.js 18 o superior y npm.
- SQLite 3 para administración y copias; Sequelize crea las tablas al iniciar.
- Para producción en Linux: Nginx, systemd y Cloudflare Tunnel (opcional si se usa otro proxy).

## Instalación local

### 1. Configurar backend

```bash
cd backend
npm ci
cp .env.example .env
```

Edita `backend/.env`: define un `JWT_SECRET` aleatorio, la ruta de base de datos y las variables `ADMIN_*` para la primera instalación. No uses valores de producción ni los subas a Git.

### 2. Instalar frontend

```bash
cd frontend
npm ci
cp .env.example .env
```

## 🚀 Ejecución

### Iniciar backend (puerto 5002 por `.env.example`)

```bash
cd backend
npm start
```

O en modo desarrollo con auto-reload:

```bash
npm run dev
```

### Iniciar frontend en desarrollo (puerto 3003)

```bash
cd frontend
npm run dev
```

Frontend: http://localhost:3003. La API de desarrollo se proxya al puerto 5002.

## Administrador inicial

Al iniciar una base sin administrador, el backend lo crea usando `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_FULL_NAME` y `ADMIN_PASSWORD` de `backend/.env`. No existe una contraseña pública por defecto. Protege el archivo `.env` y usa una contraseña fuerte.

## 📱 Características de Diseño

- 🎨 **Diseño Minimalista**: Interfaz limpia y moderna
- 📱 **Responsive**: Totalmente adaptado para móviles (pantallas verticales)
- 💜 **Color Lila**: Paleta de colores principal en tonos morados
- ✨ **Animaciones Suaves**: Transiciones y efectos con Framer Motion
- 🎯 **UX Optimizada**: Interfaz intuitiva y fácil de usar

## 🗂️ Estructura del Proyecto

```
proyecto-barberia/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Haircut.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── haircutController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── haircutRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── PrivateRoute.jsx
    │   │   ├── UserModal.jsx
    │   │   ├── PercentageModal.jsx
    │   │   ├── ReportsSection.jsx
    │   │   └── [CSS files]
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── BarberDashboard.jsx
    │   │   ├── CashierDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── [CSS files]
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── haircutService.js
    │   │   └── userService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── package.json
    └── vite.config.js
```

## 🔐 Seguridad

- 🔒 Contraseñas hasheadas con bcrypt
- 🎫 Autenticación basada en JWT
- 🛡️ Protección de rutas según roles
- ✅ Validación de datos en frontend y backend

## Base de datos

La base SQLite se crea automáticamente al iniciar el backend. `db/schema.sql` define las tablas; `db/seed-users.sql` restaura las cinco cuentas capturadas en el snapshot, pero no incluye cortes ni ingresos. El seed contiene nombres, correos y hashes de contraseña: el repositorio debe permanecer privado. Las instrucciones están en [docs/DATABASE.md](docs/DATABASE.md). Nunca subas la base SQLite real.

Las tablas incluyen:

- **users**: Usuarios del sistema (barberos, cobradores, administradores)
- **haircuts**: Registro de cortes con precio, fecha y barbero

## 🎯 Flujo de Trabajo

1. **Barbero**: Registra cada corte con su precio durante el día
2. **Cobrador**: Consulta los cortes del día y calcula pagos
3. **Administrador**: Gestiona usuarios, configura porcentajes y genera reportes

## Seguridad y control de versiones

- `.env`, base SQLite, respaldos, `node_modules`, `dist` y logs están excluidos por `.gitignore`.
- No incluyas tokens de Cloudflare, credenciales de túnel ni contraseñas en el repositorio.
- `db/seed-users.sql` es una excepción deliberada: contiene datos de cuentas y hashes para clonación; limita el acceso al repositorio privado y rota las contraseñas si se expone.
- El snapshot incluye usuarios, pero no cortes, ingresos ni el archivo SQLite productivo.
- Las notas históricas de despliegue del servidor se excluyen porque pueden contener información específica o sensible del host.

## 🔄 Características Especiales

- **Reinicio Diario**: Los cortes del día se reinician automáticamente
- **Historial Completo**: Todos los cortes quedan registrados para reportes
- **Porcentajes Flexibles**: El administrador puede ajustar el porcentaje de cada barbero
- **Múltiples Barberos**: Soporte para varios barberos con datos separados
- **Exportación de Datos**: Reportes exportables a CSV

## Documentación de despliegue

- [Instalar en otro servidor](docs/DEPLOYMENT.md)
- [Esquema, respaldo y restauración de SQLite](docs/DATABASE.md)
- [Cloudflare Tunnel dedicado](docs/CLOUDFLARE_TUNNEL.md)
- Ejemplos de Nginx y systemd en `deploy/`

## Solución de problemas

### El backend no inicia
- Verifica que el puerto 5000 esté libre
- Asegúrate de haber instalado todas las dependencias

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo
- Revisa la variable `VITE_API_URL` en `frontend/.env`

### Error de base de datos
- Comprueba `DATABASE_PATH` y permisos de escritura.
- No elimines la base de producción para intentar resolver un error; restaura un respaldo o revisa los logs.

## 📝 Notas

- La base de datos SQLite es perfecta para servidores locales
- Los datos persisten entre reinicios
- El sistema está optimizado para pantallas móviles verticales
- Las animaciones funcionan mejor en navegadores modernos

## 🤝 Contribuciones

Este es un proyecto personalizado para gestión de barberías.

## 📄 Licencia

ISC

---

Desarrollado con ❤️ para optimizar la gestión de barberías
