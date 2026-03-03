FROM node:20

WORKDIR /usr/src/app

# Install dependencies
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

# copy source code
COPY --chown=node:node . .

USER node

EXPOSE 4000

CMD ["npm", "start"]
# FROM node:20 AS build-stage

# WORKDIR /usr/src/app

# COPY backend/package*.json ./
# RUN npm install

# COPY backend/ .
# RUN npm run build


# FROM node:20

# WORKDIR /usr/src/app

# COPY backend/package*.json ./
# RUN npm ci --omit=dev

# COPY --from=build-stage /usr/src/app/dist ./dist

# EXPOSE 4000

# CMD ["npm", "run", "start"]

