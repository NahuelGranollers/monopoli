
# Crear el contenido de server.js para servir la aplicación en producción

server_js_content = '''import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware para parsear JSON (si agregas API endpoints en el futuro)
app.use(express.json());

// Ruta para manejar todas las solicitudes y devolver index.html
// Esto es necesario para aplicaciones SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎲 Monopoly Server corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Accesible desde la red local en http://0.0.0.0:${PORT}`);
});'''

# Guardar server.js
with open('server.js', 'w', encoding='utf-8') as f:
    f.write(server_js_content)

print("✅ Archivo server.js creado exitosamente")
print(f"Tamaño: {len(server_js_content)} caracteres")
