
# Crear guía rápida de comandos

quick_start_content = '''# 🚀 GUÍA RÁPIDA DE DEPLOYMENT

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Reemplaza tu package.json
```bash
# Haz backup del actual (opcional)
cp package.json package.json.backup

# Reemplaza con el actualizado
cp package_updated.json package.json
```

### 2️⃣ Instala dependencias
```bash
npm install
```

### 3️⃣ Construye y ejecuta
```bash
npm run deploy
```

🎉 ¡Listo! Tu servidor está corriendo en http://localhost:3000

---

## 🌐 Acceso desde otros dispositivos (misma red)

### Paso 1: Encuentra tu IP local

**Windows:**
```cmd
ipconfig
```
Busca "IPv4 Address" (ejemplo: 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig | grep inet
```
Busca la IP que empieza con 192.168.x.x

### Paso 2: Comparte la URL

Desde otros dispositivos en la misma red, abre:
```
http://TU-IP-LOCAL:3000
```
Ejemplo: `http://192.168.1.100:3000`

---

## 🐳 Deployment con Docker (Alternativa)

Si prefieres usar Docker:

```bash
# Construir imagen
docker build -t monopoly-game .

# Ejecutar contenedor
docker run -p 3000:3000 monopoly-game
```

O más fácil con Docker Compose:
```bash
docker-compose up -d
```

---

## 🔧 Comandos Útiles

```bash
# Solo construir (sin ejecutar)
npm run build

# Solo ejecutar servidor (requiere build previo)
npm start

# Cambiar puerto (editar .env)
echo "PORT=8080" > .env
npm start
```

---

## 🆘 Problemas Comunes

### "Port 3000 already in use"
```bash
# Opción 1: Cambiar puerto
echo "PORT=8080" > .env

# Opción 2: Detener proceso en puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### "Cannot GET /"
- Asegúrate de haber ejecutado `npm run build` primero
- Verifica que exista la carpeta `dist/`

### No se puede acceder desde otros dispositivos
- Verifica que estén en la misma red WiFi
- Desactiva temporalmente el firewall para probar
- Asegúrate de usar tu IP correcta

---

## 📚 Documentación Completa

Para instrucciones detalladas, deployment online, y más opciones:
➡️ Lee `README_DEPLOY.md`

---

## 🎮 ¡A Jugar!

Una vez el servidor esté corriendo, simplemente:
1. Abre el navegador en http://localhost:3000
2. Configura los jugadores
3. ¡Disfruta del Monopoly! 🎲
'''

with open('QUICK_START.md', 'w', encoding='utf-8') as f:
    f.write(quick_start_content)

print("✅ QUICK_START.md creado")
print("   Guía rápida para comenzar en minutos")
