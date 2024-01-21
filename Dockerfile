# Use a smaller base image for the builder stage
FROM node:20.5.0-alpine as builder

LABEL author='Muhammad Yousuf'
LABEL application='Auth Service'

WORKDIR /app

COPY package.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN yarn install --ignore-engines && \
    npm run build && \
    wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && \
    node-prune

# Use a smaller base image for the runner stage
FROM node:20.5.0-alpine as runner

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./

RUN yarn install --prod --ignore-engines 

# Copy only necessary files from the builder stage
COPY --from=builder /app/build ./build

EXPOSE 4001

CMD [ "npm", "run", "start" ]
