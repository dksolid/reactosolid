FROM node:22.14-slim

RUN npm install -g pnpm@10.9.0

WORKDIR /app

COPY .npmrc /app/
COPY pnpm-lock.yaml /app/
COPY package.json /app/

RUN pnpm install --prefer-offline --ignore-scripts

COPY . /app/
COPY example.prod.env /app/.env

# The way to pass env variables on docker build via --build-arg
ARG GIT_COMMIT="default"
ENV GIT_COMMIT=${GIT_COMMIT}

RUN pnpm run build
RUN pnpm prune --prod

ENTRYPOINT pnpm run start
