FROM node:22-alpine

WORKDIR /app

# Copiamos primero los manifiestos para no reinstalar dependencias si solo cambia el código
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]
