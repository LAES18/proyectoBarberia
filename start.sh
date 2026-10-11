#!/bin/bash

# Script para iniciar el Sistema de Gestión de Barbería

echo "🚀 Iniciando Sistema de Gestión de Barbería..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js v16 o superior."
    exit 1
fi

echo "✅ Node.js versión: $(node --version)"
echo ""

# Iniciar Backend
echo "📡 Iniciando Backend..."
cd backend
if [ ! -f ".env" ]; then
    echo "❌ Falta backend/.env. Copia backend/.env.example y configura sus valores."
    exit 1
fi
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm ci
fi

nohup node server.js > /tmp/barberia-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"
echo ""

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar Frontend
echo "🌐 Iniciando Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm ci
fi

npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
echo ""

echo "============================================"
echo "✨ Sistema iniciado correctamente!"
echo "============================================"
echo ""
echo "🌐 Frontend: http://localhost:3003"
echo "📡 Backend API: http://localhost:5002"
echo ""
echo "👤 Usa el administrador configurado en backend/.env."
echo ""
echo "Para detener los servicios, presiona Ctrl+C"
echo ""

# Mantener el script corriendo
wait
