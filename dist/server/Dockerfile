FROM node:16.20.1

ENV PORT 2567
ENV PORT 3000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production

COPY built .

EXPOSE 2567
EXPOSE 3000

CMD [ "node", "server.js" ]
