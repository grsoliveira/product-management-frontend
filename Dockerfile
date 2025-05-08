FROM node:18 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run prod

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/product-management-frontend/ /usr/share/nginx/html
