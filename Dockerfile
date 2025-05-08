FROM node:18 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm start

FROM nginx:1.19

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/product-management-frontend/ /usr/share/nginx/html
