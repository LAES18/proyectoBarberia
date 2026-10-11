# Base de datos

La aplicación utiliza SQLite con Sequelize. El backend crea tablas que falten al iniciar; no usa `sync({ alter: true })` para evitar recreaciones destructivas en SQLite.

## Esquema versionado

`db/schema.sql` contiene las definiciones de `users`, `haircuts` y el índice por barbero/fecha. No incluye usuarios, hashes de contraseñas, cortes ni otra información de la instancia productiva. Para crear una base vacía manualmente:

```bash
sqlite3 /var/lib/barberia/database.sqlite < db/schema.sql
```

En la instalación normal no hace falta ejecutar el SQL: Sequelize crea las tablas cuando el servicio arranca. El SQL es una referencia reproducible y útil para revisar el esquema.

## Copia de seguridad de la base real

Nunca agregues `backend/database.sqlite`, dumps de producción ni archivos WAL al repositorio. Para crear una copia consistente en una ruta privada:

```bash
sqlite3 /var/lib/barberia/database.sqlite ".backup '/secure-backups/barberia-$(date +%F).sqlite'"
chmod 600 /secure-backups/barberia-*.sqlite
```

Transfiere ese archivo al nuevo servidor por un canal privado y seguro, verifica su integridad, instala los permisos apropiados y define `DATABASE_PATH` para apuntar a él. Mantén copias cifradas y prueba restauraciones. No subas respaldos a GitHub, aunque el repositorio sea privado.

Al migrar producción, detén temporalmente el backend antes de copiar/restaurar o utiliza el comando `.backup` de SQLite para evitar copiar una base activa de forma inconsistente. Conserva una copia del destino antes de reemplazarla.
