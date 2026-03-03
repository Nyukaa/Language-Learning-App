FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# ---------- Build stage ----------
# FROM node:20 AS build
# WORKDIR /app

# COPY frontend/package*.json ./
# RUN npm install

# COPY frontend/ .
# RUN npm run build

# # ---------- Production stage ----------
# FROM nginx:1.25-alpine

# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]