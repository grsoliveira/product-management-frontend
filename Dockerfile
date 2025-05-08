# Etapa de build
FROM node:18 AS builder

WORKDIR /app

# Instala as dependências
COPY package*.json ./
RUN npm install

# Copia todo o projeto
COPY . .

# Compila o Angular
RUN npm run build

# Etapa de produção (Nginx)
FROM nginx:alpine

# Copia os arquivos buildados do Angular para o Nginx
COPY --from=builder /app/dist/product-manager-frontend /usr/share/nginx/html

# Exponha a porta padrão do Nginx
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
