# Use a smaller base image for the builder stage
FROM node:20.5.0-alpine as builder

LABEL author='Muhammad Yousuf'
LABEL application='Auth Service'

WORKDIR /app

COPY package.json ./
COPY tsconfig*.json ./
COPY src ./src

# Runtime environmental variables
ENV NODE_ENV=development
ENV PORT=4001
ENV DB_PASSWORD=
ENV DB_USER=
ENV DB_NAME=
ENV DB_URL=
ENV DB_PORT=
ENV DB_TIMEOUT=
ENV BASE_PATH='/api/v1/auth'
ENV JWT_SECRET=
ENV AUTH_COOKIE_NAME=
ENV AUTH_COOKIE_SECRET=
ENV S3_BUCKET=
ENV S3_ACCESS_ID=
ENV S3_ACCESS_KEY=
ENV S3_REGION=us-east-1
ENV CLOUDFRONT_URL=

# Build time environmental variables
ENV NODE_ENV=${NODE_ENV}
ENV PORT=4001
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_USER=${DB_USER}
ENV DB_NAME=${DB_NAME}
ENV DB_URL=${DB_URL}
ENV DB_PORT=3306
ENV DB_TIMEOUT=50000
ENV BASE_PATH='/api/v1/auth'
ENV JWT_SECRET=${JWT_SECRET}
ENV AUTH_COOKIE_NAME=${AUTH_COOKIE_NAME}
ENV AUTH_COOKIE_SECRET=${AUTH_COOKIE_SECRET}
ENV S3_BUCKET=${S3_BUCKET}
ENV S3_ACCESS_ID=${S3_ACCESS_ID}
ENV S3_ACCESS_KEY=${S3_ACCESS_KEY}
ENV S3_REGION=${S3_REGION}
ENV CLOUDFRONT_URL=${CLOUDFRONT_URL}

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
