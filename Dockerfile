FROM node:21-alpine3.18 as builder

WORKDIR /app

COPY package.json ./

COPY tsconfig*.json ./

RUN npm install 

COPY ./src .

RUN npm run build


FROM node:21-alpine3.18

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json ./

RUN npm install -g pm2 npm@latest

COPY --from=builder /app/build ./build

EXPOSE 1911

CMD [ "npm", 'run', 'start' ]