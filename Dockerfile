# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# 환경 변수 설정
ENV HASH_ROUNDS=7
ENV BACKEND_PORT=3001
ENV BACKEND_URL=localhost


# POD 로 주입
# ENV DB_HOST=www.entto.shop
ENV DB_PORT=30432
ENV DB_TYPE=postgres
ENV DB_USERNAME=postgres
ENV DB_DATABASE=postgres

EXPOSE 3001

CMD ["yarn", "start:prod"]
