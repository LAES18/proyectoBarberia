# Cloudflare Tunnel

Esta guía configura solo el túnel de barbería. Si el servidor aloja otros proyectos, conserva sus servicios y archivos independientes; no uses `cloudflared service install` global sobre una instalación existente.

## Opción recomendada: túnel administrado localmente

1. En Cloudflare Zero Trust, crea un túnel dedicado para barbería o selecciona uno dedicado a este proyecto.
2. En el servidor, autentica `cloudflared` siguiendo el flujo de Cloudflare y crea el túnel:

```bash
cloudflared tunnel login
cloudflared tunnel create barberia
```

3. Instala el JSON de credenciales en `/etc/cloudflared/` con permisos restringidos. No lo copies al repositorio.
4. Copia `deploy/cloudflared/config.yml.example` a `/etc/cloudflared/config.yml`. Sustituye el UUID, el path de credenciales y el hostname real. Conserva la ruta final `http_status:404`.
5. Crea el DNS del túnel para el hostname elegido:

```bash
cloudflared tunnel route dns barberia barberia.example.com
```

6. Valida la configuración:

```bash
sudo cloudflared --config /etc/cloudflared/config.yml tunnel ingress validate
```

7. Instala `deploy/systemd/cloudflared-barberia.service.example` en `/etc/systemd/system/cloudflared-barberia.service`, ajusta el path de configuración si hace falta y actívalo:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now cloudflared-barberia
sudo systemctl status cloudflared-barberia --no-pager
```

La ruta del túnel debe apuntar al origen local de Nginx (`http://127.0.0.1:3003`), no al puerto de Vite ni al puerto API directamente.

## Túnel administrado desde el dashboard

También se puede usar un token de túnel dedicado. Guarda el token solamente en el servidor, con permisos restringidos, y crea un servicio systemd propio de barbería. No compartas el token ni lo guardes en Git, README, capturas o historial de shell. Nunca instales el conector de barbería sobre la unidad global `cloudflared` si esa unidad sirve otros proyectos.

## Diagnóstico

```bash
sudo systemctl status cloudflared-barberia --no-pager
sudo journalctl -u cloudflared-barberia -n 100 --no-pager
sudo cloudflared --config /etc/cloudflared/config.yml tunnel ingress validate
curl -I -H 'Host: barberia.example.com' http://127.0.0.1:3003/
```

Confirma que el hostname público está en el túnel correcto del dashboard y que su DNS se resuelve. Para solucionar un problema, reinicia solo `cloudflared-barberia`; no detengas túneles de otros proyectos.
