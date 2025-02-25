FROM node:20.16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

RUN mkdir -p /var/lib/nginx/tmp/uploads && \
    chmod 700 /var/lib/nginx/tmp/uploads

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]