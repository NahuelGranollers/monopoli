# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Production
FROM node:18-alpine

WORKDIR /app

# Copiar package.json para producción
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist

# Copiar el servidor
COPY server.js ./

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Comando para iniciar el servidor
CMD ["node", "server.js"]
