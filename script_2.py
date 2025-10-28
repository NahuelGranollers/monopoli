
# Crear package.json actualizado con las dependencias necesarias para el servidor

package_json_updated = '''{
  "name": "monopoly-online-en-español",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node server.js",
    "deploy": "npm run build && npm start"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "immer": "^10.2.0",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}'''

with open('package_updated.json', 'w', encoding='utf-8') as f:
    f.write(package_json_updated)

print("✅ Archivo package.json actualizado creado")
print("\n📦 Nueva dependencia agregada:")
print("  - express: ^4.18.2 (servidor web)")
print("\n🚀 Nuevos scripts agregados:")
print("  - npm start: Inicia el servidor en producción")
print("  - npm run deploy: Construye y despliega en un solo comando")
