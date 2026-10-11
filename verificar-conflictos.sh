#!/bin/bash

# Script de Verificación de Conflictos - Sistema de Barbería
# Verifica que no haya conflictos con otros servicios en el servidor

echo "🔍 Verificando Conflictos - Sistema de Barbería"
echo "=============================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
BARBERIA_BACKEND_PORT=5001
BARBERIA_FRONTEND_PORT=3000
BARBERIA_DB="/var/www/proyecto barberia/backend/database.sqlite"

# Función para verificar puertos
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        local pid=$(lsof -ti:$port)
        local process=$(ps -p $pid -o comm= 2>/dev/null)
        
        if [[ $process == *"node"* ]] && ps -p $pid -o args= | grep -q "proyecto barberia"; then
            echo -e "${GREEN}✅ Puerto $port - $service está siendo usado por Barbería (OK)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Puerto $port está en uso por otro servicio:${NC}"
            ps -p $pid -o comm=,args= 2>/dev/null | head -n 1
            return 1
        fi
    else
        echo -e "${YELLOW}⚪ Puerto $port - $service está libre${NC}"
        return 0
    fi
}

# 1. Verificar puertos
echo "📡 VERIFICANDO PUERTOS:"
echo "----------------------"
check_port $BARBERIA_BACKEND_PORT "Backend Barbería"
BACKEND_OK=$?
check_port $BARBERIA_FRONTEND_PORT "Frontend Barbería"
FRONTEND_OK=$?
echo ""

# 2. Mostrar otros puertos en uso
echo "📊 OTROS PUERTOS EN USO:"
echo "------------------------"
sudo lsof -i -P -n | grep LISTEN | grep -E "(node|npm)" | grep -v "proyecto barberia" | \
awk '{print $1, $9}' | sort -u | while read line; do
    echo "  • $line"
done
echo ""

# 3. Verificar base de datos
echo "💾 VERIFICANDO BASE DE DATOS:"
echo "-----------------------------"
if [ -f "$BARBERIA_DB" ]; then
    size=$(du -h "$BARBERIA_DB" | cut -f1)
    echo -e "${GREEN}✅ Base de datos existe: $BARBERIA_DB${NC}"
    echo "   Tamaño: $size"
    echo "   Tipo: SQLite (Aislada, no comparte con otros sistemas)"
else
    echo -e "${RED}❌ Base de datos NO encontrada${NC}"
fi
echo ""

# 4. Verificar procesos de Barbería
echo "🔄 PROCESOS DEL SISTEMA DE BARBERÍA:"
echo "------------------------------------"
BARBERIA_PROCESSES=$(ps aux | grep "proyecto barberia" | grep -v grep)
if [ -z "$BARBERIA_PROCESSES" ]; then
    echo -e "${YELLOW}⚠️  Sistema NO está corriendo${NC}"
else
    echo "$BARBERIA_PROCESSES" | awk '{printf "  • PID %s - %s\n", $2, substr($0, index($0,$11))}'
fi
echo ""

# 5. Verificar otros servicios Node.js
echo "🌐 OTROS SERVICIOS NODE.JS ACTIVOS:"
echo "-----------------------------------"
ps aux | grep -E "node.*server|npm" | grep -v grep | grep -v "proyecto barberia" | \
head -5 | awk '{printf "  • PID %s - %s\n", $2, substr($0, index($0,$11))}'
echo ""

# 6. Verificar espacio en disco
echo "💿 ESPACIO EN DISCO:"
echo "-------------------"
df -h "/var/www/proyecto barberia" | tail -1 | awk '{printf "  Usado: %s / Disponible: %s (%s usado)\n", $3, $4, $5}'
echo ""

# 7. Verificar conflictos de nombre
echo "📁 VERIFICANDO CONFLICTOS DE CARPETAS:"
echo "--------------------------------------"
SIMILAR_FOLDERS=$(find /var/www -maxdepth 1 -type d -iname "*barberia*" 2>/dev/null)
FOLDER_COUNT=$(echo "$SIMILAR_FOLDERS" | grep -v "^$" | wc -l)
if [ $FOLDER_COUNT -eq 1 ]; then
    echo -e "${GREEN}✅ Solo existe una carpeta 'barberia' (correcto)${NC}"
else
    echo -e "${YELLOW}⚠️  Se encontraron $FOLDER_COUNT carpetas con 'barberia':${NC}"
    echo "$SIMILAR_FOLDERS" | sed 's/^/  • /'
fi
echo ""

# 8. Resumen
echo "📋 RESUMEN DE VERIFICACIÓN:"
echo "==========================="

CONFLICTS=0

# Verificar si hay conflictos reales
if [ $BACKEND_OK -ne 0 ]; then
    OTHER_PROCESS=$(lsof -ti:$BARBERIA_BACKEND_PORT | xargs ps -p 2>/dev/null | grep -v "proyecto barberia")
    if [ ! -z "$OTHER_PROCESS" ]; then
        echo -e "${RED}❌ CONFLICTO: Puerto $BARBERIA_BACKEND_PORT usado por otro servicio${NC}"
        CONFLICTS=$((CONFLICTS + 1))
    fi
fi

if [ $FRONTEND_OK -ne 0 ]; then
    OTHER_PROCESS=$(lsof -ti:$BARBERIA_FRONTEND_PORT | xargs ps -p 2>/dev/null | grep -v "proyecto barberia")
    if [ ! -z "$OTHER_PROCESS" ]; then
        echo -e "${RED}❌ CONFLICTO: Puerto $BARBERIA_FRONTEND_PORT usado por otro servicio${NC}"
        CONFLICTS=$((CONFLICTS + 1))
    fi
fi

if [ ! -f "$BARBERIA_DB" ] && [ ! -z "$BARBERIA_PROCESSES" ]; then
    echo -e "${RED}❌ ADVERTENCIA: Sistema corriendo pero base de datos no existe${NC}"
    CONFLICTS=$((CONFLICTS + 1))
fi

if [ $CONFLICTS -eq 0 ]; then
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════╗"
    echo "║  ✅ NO SE DETECTARON CONFLICTOS ✅    ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo "El sistema de barbería puede funcionar sin interferir con otros servicios."
else
    echo -e "${RED}"
    echo "╔════════════════════════════════════════╗"
    echo "║  ⚠️  SE DETECTARON $CONFLICTS CONFLICTO(S) ⚠️  ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo "Revisa los detalles arriba y resuelve los conflictos."
fi

echo ""
echo "📌 ACCIONES DISPONIBLES:"
echo "------------------------"
echo "  • Ver este archivo: cat /var/www/proyecto\ barberia/VERIFICACION_NO_CONFLICTOS.md"
echo "  • Iniciar sistema: cd /var/www/proyecto\ barberia && ./start.sh"
echo "  • Ver estado: ps aux | grep 'proyecto barberia'"
echo "  • Liberar puerto: lsof -ti:5001 | xargs kill -9"
echo ""

exit $CONFLICTS
