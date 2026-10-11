# Base de datos

La aplicación utiliza SQLite con Sequelize. El backend crea tablas que falten al iniciar; no usa `sync({ alter: true })` para evitar recreaciones destructivas en SQLite.

## Esquema versionado

`db/schema.sql` contiene las definiciones de `users`, `haircuts` y el índice por barbero/fecha. El snapshot `db/seed-users.sql` contiene las cinco cuentas existentes al momento de generarlo, incluyendo datos personales y hashes bcrypt para conservar sus inicios de sesión. No contiene cortes ni ingresos. **Mantén el repositorio privado**; si el archivo se expone, rota las contraseñas de esas cuentas.

```bash
sqlite3 /var/lib/barberia/database.sqlite < db/schema.sql
```

Para clonar las cuentas, importa el snapshot después del esquema y antes del primer arranque del backend:

```bash
sqlite3 /var/lib/barberia/database.sqlite < db/schema.sql
sqlite3 /var/lib/barberia/database.sqlite < db/seed-users.sql
```

No arranques el backend entre ambos comandos: al no encontrar un administrador, intentará crear uno usando `ADMIN_*`. En una instalación completamente nueva sin snapshot, basta con iniciar el backend y se creará el administrador definido en el entorno. Regenera el snapshot al cambiar cuentas y sube el cambio únicamente al repositorio privado.

En la instalación normal Sequelize crea las tablas si faltan. El SQL es reproducible y permite clonar las cuentas existentes cuando se necesite.

## Copia de seguridad de la base real

Nunca agregues `backend/database.sqlite`, dumps de producción ni archivos WAL al repositorio. Para crear una copia consistente en una ruta privada:

```bash
sqlite3 /var/lib/barberia/database.sqlite ".backup '/secure-backups/barberia-$(date +%F).sqlite'"
chmod 600 /secure-backups/barberia-*.sqlite
```

Transfiere ese archivo al nuevo servidor por un canal privado y seguro, verifica su integridad, instala los permisos apropiados y define `DATABASE_PATH` para apuntar a él. Mantén copias cifradas y prueba restauraciones. No subas respaldos a GitHub, aunque el repositorio sea privado.

Al migrar producción, detén temporalmente el backend antes de copiar/restaurar o utiliza el comando `.backup` de SQLite para evitar copiar una base activa de forma inconsistente. Conserva una copia del destino antes de reemplazarla.
