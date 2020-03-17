FROM node:12-alpine
COPY package*.json ./

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm ci --only=production \
    && apk del build-dependencies

COPY . .
EXPOSE 8000
