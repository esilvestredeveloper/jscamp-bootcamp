FROM node:22-alpine

WORKDIR /app

COPY server.js .

EXPOSE 3000

# Con --watch Node se reinicia solo cuando cambia server.js desde el bind mount
CMD ["node", "--watch", "server.js"]
