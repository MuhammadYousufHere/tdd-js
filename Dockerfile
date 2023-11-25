FROM node:20.9-alpine3.18 AS development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

RUN yarn run build

FROM node:20.9-alpine3.18 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install --prod 

COPY ecosystem.config.json .
COPY .env .
COPY .babelrc .


COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn","start"]