FROM node:21-alpine3.18 as builder

WORKDIR /app

COPY package.json .

RUN npm install 

COPY ./src .

EXPOSE 9111

CMD [ "npm", 'run', 'start' ]