# 🎲 Monopoly Online - Guía de Deployment

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o pnpm
- Puerto 3000 disponible (o configurar otro en .env)

## 🚀 Pasos para Deployment Local/Red

### 1. Instalar Dependencias

Primero, actualiza tu `package.json` con el contenido de `package_updated.json` y luego:

```bash
npm install
# o
pnpm install
```

### 2. Construir la Aplicación

Genera los archivos optimizados para producción:

```bash
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos estáticos compilados.

### 3. Iniciar el Servidor

Opción 1 - Comando directo:
```bash
npm start
```

Opción 2 - Build y start en un solo comando:
```bash
npm run deploy
```

### 4. Acceder al Juego

Una vez iniciado el servidor, verás un mensaje como:

```
🎲 Monopoly Server corriendo en http://localhost:3000
🌐 Accesible desde la red local en http://0.0.0.0:3000
```

**Acceso local:** http://localhost:3000

**Acceso desde otros dispositivos en la misma red:** 
- Encuentra tu IP local con `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
- Ejemplo: http://192.168.1.100:3000

## 🌐 Deployment Online (Internet)

### Opción 1: Servicios de Hosting Gratuitos

#### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Railway
1. Visita https://railway.app
2. Conecta tu repositorio de GitHub
3. Railway detectará automáticamente tu configuración

### Opción 2: VPS (Servidor Propio)

1. Conéctate a tu VPS vía SSH
2. Clona tu repositorio
3. Instala Node.js si no está instalado
4. Ejecuta los comandos de deployment
5. Configura PM2 para mantener el servidor activo:

```bash
npm install -g pm2
pm2 start server.js --name monopoly
pm2 startup
pm2 save
```

### Opción 3: Docker (Incluido Dockerfile)

```bash
docker build -t monopoly-game .
docker run -p 3000:3000 monopoly-game
```

## ⚙️ Configuración

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita las variables según necesites:
- `PORT`: Cambia el puerto (default: 3000)
- `NODE_ENV`: production o development
- `HOST`: 0.0.0.0 permite acceso desde la red

## 🔒 Seguridad

Para jugar online de forma segura:

1. **Firewall**: Asegúrate de que solo el puerto necesario esté abierto
2. **HTTPS**: Usa servicios como Cloudflare o Let's Encrypt para SSL
3. **Autenticación**: Considera agregar autenticación si es público

## 🐛 Solución de Problemas

### Puerto ocupado
```bash
# Cambiar puerto en .env
PORT=8080
```

### No se puede acceder desde otros dispositivos
- Verifica que estén en la misma red
- Desactiva temporalmente el firewall para probar
- Asegúrate de usar 0.0.0.0 como HOST

### Error al construir
```bash
# Limpia caché y reinstala
rm -rf node_modules dist
npm install
npm run build
```

## 📞 Soporte

Para problemas específicos, verifica:
1. Los logs del servidor en la consola
2. La consola del navegador (F12)
3. Que todos los archivos estén en su lugar

## 🎮 Jugar en Línea

Una vez desplegado, comparte la URL con tus amigos para jugar juntos. Recuerda que este es un juego **multijugador local** (todos usan la misma pantalla), no un juego en red con sincronización entre clientes.

Para convertirlo en un juego online real con múltiples clientes, necesitarías:
- WebSockets (Socket.io)
- Sincronización de estado
- Backend para gestión de salas

¡Disfruta del juego! 🎲🎉
