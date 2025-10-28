
# Crear archivo docker-compose.yml para facilitar deployment

docker_compose_content = '''version: '3.8'

services:
  monopoly-game:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: monopoly-online
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
    restart: unless-stopped
    networks:
      - monopoly-network

networks:
  monopoly-network:
    driver: bridge
'''

with open('docker-compose.yml', 'w', encoding='utf-8') as f:
    f.write(docker_compose_content)

print("✅ docker-compose.yml creado")
print("\n🐳 Comandos Docker Compose:")
print("  docker-compose up -d          # Iniciar en background")
print("  docker-compose down           # Detener")
print("  docker-compose logs -f        # Ver logs")
