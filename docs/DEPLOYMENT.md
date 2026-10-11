# Instalación en un servidor nuevo

Guía para desplegar el frontend, API, SQLite y servicios en Linux con systemd, Nginx y Cloudflare Tunnel. Los ejemplos usan `/opt/barberia`, el puerto API `5002` y el frontend servido por Nginx en `3003`; ajusta rutas y hostname a tu servidor.

## Requisitos

- Ubuntu Server 22.04/24.04 o Debian compatible.
- Node.js 18 o superior (se recomienda una versión LTS soportada) y npm.
- Git, SQLite 3, Nginx y `cloudflared`.
- Un hostname DNS gestionado por Cloudflare y un túnel configurado.

## Clonar e instalar

```bash
sudo useradd --system --create-home --home-dir /opt/barberia --shell /usr/sbin/nologin barberia
sudo mkdir -p /opt/barberia /var/lib/barberia
sudo chown -R barberia:barberia /opt/barberia /var/lib/barberia
sudo -u barberia git clone https://github.com/LAES18/proyectoBarberia.git /opt/barberia
cd /opt/barberia/backend
sudo -u barberia npm ci
cd /opt/barberia/frontend
sudo -u barberia npm ci
sudo -u barberia npm run build
```

Si GitHub es privado, configura autenticación Git en el servidor de forma segura. No guardes un PAT dentro de la URL del remoto ni de un script.

## Configurar el backend

```bash
sudo install -d -o root -g barberia -m 0750 /etc/barberia
sudo install -o root -g barberia -m 0640 backend/.env.example /etc/barberia/backend.env
sudoedit /etc/barberia/backend.env
```

Define como mínimo un `JWT_SECRET` aleatorio y único, una `ADMIN_PASSWORD` fuerte, y los datos de administrador. `DATABASE_PATH=/var/lib/barberia/database.sqlite` mantiene la base de datos fuera del repositorio. El usuario del servicio necesita permiso de escritura en `/var/lib/barberia`.

Genera el secreto sin pegarlo en chats ni en Git:

```bash
openssl rand -base64 48
```

El administrador inicial se crea únicamente cuando la base no contiene uno. El backend falla al arrancar si necesita crearlo y faltan las variables `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_FULL_NAME` o `ADMIN_PASSWORD`. Guarda la contraseña en el gestor de contraseñas y cámbiala si se comparte.

## Instalar los servicios

```bash
sudo cp deploy/systemd/barberia-backend.service.example /etc/systemd/system/barberia-backend.service
sudo systemctl daemon-reload
sudo systemctl enable --now barberia-backend
sudo systemctl status barberia-backend --no-pager
```

El ejemplo espera el código en `/opt/barberia/backend` y el usuario `barberia`. Ajusta esos campos si usaste otras rutas.

## Nginx y frontend

Instala `deploy/nginx/barberia.conf.example` en `/etc/nginx/sites-available/barberia`, cambia `barberia.example.com` por tu hostname y enlázalo en `sites-enabled`:

```bash
sudo ln -s /etc/nginx/sites-available/barberia /etc/nginx/sites-enabled/barberia
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx
```

El proxy entrega `/api/` al backend `127.0.0.1:5002`; Vite solo se usa para compilar. Después de actualizar frontend, vuelve a ejecutar `npm run build`.

## Cloudflare Tunnel

Sigue [CLOUDFLARE_TUNNEL.md](CLOUDFLARE_TUNNEL.md). El túnel debe apuntar a `http://127.0.0.1:3003`. No instales ni reemplaces servicios de otros proyectos del servidor.

## Comprobaciones

```bash
curl -i http://127.0.0.1:5002/
curl -I -H 'Host: barberia.example.com' http://127.0.0.1:3003/
sudo systemctl is-active barberia-backend nginx cloudflared-barberia
sudo journalctl -u barberia-backend -n 100 --no-pager
```

Prueba el hostname HTTPS desde una red externa. El endpoint `/api/auth/login` requiere `POST` con credenciales válidas.

## Actualizar una instalación

Haz una copia privada de la base de datos primero. Luego actualiza el código con `git pull`, ejecuta `npm ci` en los directorios backend y frontend, construye frontend y reinicia solo `barberia-backend`. Si cambiaste configuración Nginx o Cloudflare, valida antes de recargar sus servicios.
