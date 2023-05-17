FROM node:16 as build
WORKDIR /app

COPY package*.json ./
RUN NODE_ENV=production npm ci

COPY . .
RUN npm run build

FROM nginx:alpine as server
WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

COPY --from=build app/dist .

ENTRYPOINT ["nginx", "-g",  "daemon off;"]