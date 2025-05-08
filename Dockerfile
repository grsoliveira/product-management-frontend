# Etapa de build
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de produção (NGINX)
FROM nginx:alpine

# Remove o default.conf se quiser configurar o seu
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia a sua configuração customizada do NGINX (opcional)
# COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos buildados
COPY --from=builder /app/build /usr/share/nginx/html

# Exponha a porta padrão
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
