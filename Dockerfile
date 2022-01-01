FROM node:16-alpine3.14 AS builder

WORKDIR /build

COPY . .

RUN npm ci
RUN npm run build
RUN npm ci --only=production

FROM node:16-alpine3.14

WORKDIR /app

MAINTAINER Trickfilm400 <info@trickfilm400.de>

COPY --from=builder /build/node_modules /app/node_modules
COPY --from=builder /build/dist /app/dist
COPY --from=builder /build/package*.json /app/
COPY --from=builder /build/lampTypes /app/lampTypes

CMD ["node", "."]
