FROM node:20.5.0 as builder

LABEL author='Muhammad Yousuf'
LABEL application='Auth Service'

WORKDIR /app

COPY package.json ./

COPY tsconfig*.json ./

COPY src ./src

RUN yarn install --ignore-engines

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
ENV CLOUDFRONT_URL=https://dia98v6kyy7tu.cloudfront.net/

# Build time environmental variables
ENV NODE_ENV=development
ENV PORT=4001
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_USER=${DB_USER}
ENV DB_NAME=${DB_NAME}
ENV DB_URL=${DB_URL}
ENV DB_PORT=3306
ENV DB_TIMEOUT=50000
ENV BASE_PATH='/api/v1/auth'
ENV JWT_SECRET=8db8f85991bb28f45ac0107f2a1b349c
ENV AUTH_COOKIE_NAME=-dx2t3el2iak9t0esi
ENV AUTH_COOKIE_SECRET=c358db01-b418-4659-9f2e-739cbe96e73f
ENV S3_BUCKET=${S3_BUCKET}
ENV S3_ACCESS_ID=${S3_ACCESS_ID}
ENV S3_ACCESS_KEY=${S3_ACCESS_KEY}
ENV S3_REGION=us-east-1
ENV CLOUDFRONT_URL=https://dia98v6kyy7tu.cloudfront.net/


RUN npm run build
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

FROM node:20.5.0 as runner
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./



RUN yarn install --prod --ignore-engines

COPY --from=builder /app/build ./build

EXPOSE 4001

CMD [ "npm", "run", "start" ]