# 📖 Guía de Uso - Sistema de Gestión de Barbería

## 🚀 Inicio Rápido

### Acceso al Sistema
1. Abre el hostname HTTPS configurado para el sistema. En desarrollo local usa **http://localhost:3003**.
2. Inicia sesión con la cuenta configurada mediante `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el primer arranque. No hay credenciales públicas por defecto.

---

## 👥 Roles y Funcionalidades

### 1️⃣ ROL ADMINISTRADOR

#### Gestión de Usuarios
1. **Iniciar sesión** como administrador
2. En el dashboard, verás dos pestañas: **Usuarios** y **Reportes**
3. **Crear nuevo usuario**:
   - Clic en "Nuevo Usuario"
   - Completa los datos:
     - Nombre completo
     - Usuario
     - Email
     - Contraseña
     - Rol (Barbero, Cobrador o Administrador)
     - Porcentaje de ganancia (solo para barberos)
   - Clic en "Crear"

4. **Editar usuario**:
   - Clic en el botón de editar (lápiz) en la tarjeta del usuario
   - Modifica los campos necesarios
   - Clic en "Actualizar"

5. **Editar porcentaje de barbero**:
   - Clic en el botón de porcentaje (%) en la tarjeta del barbero
   - Ajusta el porcentaje con el slider o ingresa un valor
   - Prueba los presets: 30%, 40%, 50%, 60%
   - Clic en "Guardar Cambios"

6. **Eliminar usuario**:
   - Clic en el botón de eliminar (papelera) en la tarjeta del usuario
   - Confirma la acción

#### Generación de Reportes
1. **Cambiar a pestaña "Reportes"**
2. **Filtros rápidos**:
   - Hoy
   - Ayer
   - Esta Semana
   - Este Mes

3. **Filtros personalizados**:
   - Selecciona fecha inicio
   - Selecciona fecha fin
   - (Opcional) Filtra por barbero específico
   - Clic en "Generar Reporte"

4. **Ver estadísticas**:
   - Total de cortes
   - Ingresos totales
   - Días activos

5. **Detalles por día y barbero**:
   - Cada día muestra:
     - Fecha completa
     - Total de cortes del día
     - Total generado
   - Por cada barbero:
     - Nombre
     - Porcentaje
     - Cantidad de cortes
     - Ingresos generados
     - Ganancia del barbero

6. **Exportar datos**:
   - Clic en "Exportar CSV"
   - El archivo se descargará automáticamente

---

### 2️⃣ ROL BARBERO

#### Registrar Cortes
1. **Iniciar sesión** con tu cuenta de barbero
2. Verás tarjetas con:
   - **Cortes Hoy**: Cantidad de cortes registrados
   - **Tus Ganancias**: Tu porcentaje del total

3. **Agregar nuevo corte**:
   - Ingresa el precio en Quetzales (Ej: 50.00)
   - Opcionalmente agrega una descripción, por ejemplo sombreado o barba
   - Clic en "+ Agregar Corte"
   - El corte se agregará automáticamente a la lista

4. **Ver lista de cortes**:
   - Cada corte muestra:
     - Número de corte del día (#1, #2, #3...)
     - Precio en Quetzales
     - Hora de registro

5. **Eliminar corte** (si cometiste un error):
   - Clic en el botón de papelera del corte
   - Confirma la eliminación

#### Información Importante para Barberos
- ✅ Los cortes se numeran automáticamente (#1, #2, #3...)
- ✅ Tu ganancia se calcula según tu porcentaje configurado
- ✅ Puedes ver el total generado en tiempo real
- ✅ Los cortes del día se reinician automáticamente cada día
- ✅ Todo queda registrado en el sistema para reportes

---

### 3️⃣ ROL COBRADOR

#### Ver Cortes del Día
1. **Iniciar sesión** con tu cuenta de cobrador
2. Verás un **Resumen del Día** con:
   - Total de cortes de todos los barberos
   - Total generado
   - Cantidad de barberos activos

3. **Ver información por barbero**:
   - Cada tarjeta muestra:
     - Nombre del barbero
     - Cantidad de cortes
     - Total generado
     - **Pago al barbero** (calculado con su porcentaje)

4. **Ver detalles de cortes**:
   - Clic en "Ver Detalles" en la tarjeta del barbero
   - Se despliega la lista completa de cortes:
     - Número de corte
     - Precio
     - Hora
   - Resumen detallado:
     - Total en cortes
     - Pago al barbero
     - Lo que queda para la barbería

5. **Actualización automática**:
   - Los datos se actualizan cada 30 segundos automáticamente

#### Cálculo de Pagos
El sistema calcula automáticamente:
- **Ejemplo con 50%**:
  - Total del barbero: Q 1000.00
  - Pago al barbero (50%): Q 500.00
  - Para la barbería (50%): Q 500.00

- **Ejemplo con 40%**:
  - Total del barbero: Q 1000.00
  - Pago al barbero (40%): Q 400.00
  - Para la barbería (60%): Q 600.00

---

## 💡 Casos de Uso Comunes

### Escenario 1: Primer día de trabajo
1. Administrador crea cuentas de barberos
2. Barberos registran sus cortes durante el día
3. Al final del día, el cobrador revisa y paga a cada barbero
4. Al día siguiente, los contadores se reinician automáticamente

### Escenario 2: Cambio de porcentaje
1. Un barbero negocia un nuevo porcentaje (ej: de 50% a 60%)
2. Administrador edita el porcentaje del barbero
3. El cambio aplica para todos los cortes futuros
4. El sistema calcula automáticamente con el nuevo porcentaje

### Escenario 3: Generación de reporte mensual
1. Administrador selecciona "Este Mes" en reportes
2. Ve todos los cortes y ganancias del mes
3. Exporta el reporte a CSV para contabilidad
4. Analiza qué barberos son más productivos

---

## 📱 Uso en Dispositivos Móviles

### El sistema está optimizado para móviles:
- ✅ Diseño responsive
- ✅ Botones grandes y táctiles
- ✅ Navegación fácil
- ✅ Orientación vertical optimizada
- ✅ Funciona en Chrome, Safari, Firefox móvil

### Recomendaciones:
- Usa en orientación vertical para mejor experiencia
- Actualiza la página si los datos no cargan
- Mantén el navegador actualizado

---

## 🔐 Seguridad

### Mejores prácticas:
- ✅ Usa una contraseña única y fuerte para cada cuenta
- ✅ No compartas las credenciales
- ✅ Desactiva usuarios que ya no trabajan

---

## ❓ Preguntas Frecuentes

**P: ¿Los cortes del día se borran?**
R: No se borran, solo dejan de mostrarse en la vista del barbero. Quedan guardados en el historial para reportes.

**P: ¿Puedo tener más de un administrador?**
R: Sí, puedes crear múltiples usuarios con rol de administrador.

**P: ¿Cómo reinicio el contador de cortes?**
R: Se reinicia automáticamente cada día a medianoche.

**P: ¿Puedo recuperar cortes eliminados?**
R: No, los cortes eliminados no se pueden recuperar. Ten cuidado al eliminar.

**P: ¿Qué pasa si dos barberos tienen el mismo nombre?**
R: No hay problema, el sistema los diferencia por ID interno.

**P: ¿Puedo usar otro símbolo de moneda?**
R: El sistema usa Quetzales (Q) por defecto. Para cambiar, edita el código.

---

## 🆘 Soporte y Ayuda

Si tienes problemas:
1. Verifica que el backend y frontend estén corriendo
2. Revisa que uses un navegador moderno
3. Limpia el caché del navegador
4. Verifica la consola del navegador (F12) para errores

---

## 🎯 Tips para Optimizar el Uso

### Para Barberos:
- Registra cada corte inmediatamente después de terminar
- Verifica el precio antes de confirmar
- Revisa tu total al final del día

### Para Cobradores:
- Revisa los datos antes de cerrar caja
- Usa la función de detalles para verificar
- Guarda capturas de pantalla si es necesario

### Para Administradores:
- Genera reportes semanalmente
- Ajusta porcentajes según desempeño
- Mantén activos solo los usuarios actuales
- Exporta datos regularmente para respaldo

---

¡Disfruta usando el Sistema de Gestión de Barbería! 💈✂️
