# Build stage — Vite 8 requires Node.js 20+
FROM node:20-alpine AS build
WORKDIR /app

# VITE_API_URL is resolved by Vite from .env.production at build time.
# No Docker ARG needed — Vite reads .env.production automatically
# when NODE_ENV=production (which is the default for npm run build).

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage — serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# React Router: all unknown paths fall back to index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
