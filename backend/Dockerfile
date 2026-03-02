FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build-stage /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["npm", "start"]