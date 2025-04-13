# Etapa 1: Construcción de la aplicación
FROM node:18-alpine AS build

WORKDIR /app

# Acepta VITE_SERVER como build arg
ARG VITE_SERVER
ENV VITE_SERVER=$VITE_SERVER

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

# Construye la aplicación con la variable de entorno
RUN pnpm build

# Etapa 2: Servir la aplicación
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
