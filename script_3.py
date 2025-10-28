
# Crear archivo .env de ejemplo para configuración

env_content = '''# Puerto del servidor (por defecto 3000)
PORT=3000

# Modo de producción (true/false)
NODE_ENV=production

# Host (0.0.0.0 permite acceso desde la red local)
HOST=0.0.0.0'''

with open('.env.example', 'w', encoding='utf-8') as f:
    f.write(env_content)

print("✅ Archivo .env.example creado")
print("\n⚙️ Variables de entorno configurables:")
print("  - PORT: Puerto del servidor (default: 3000)")
print("  - NODE_ENV: Modo de ejecución")
print("  - HOST: Dirección de escucha (0.0.0.0 para acceso en red)")
