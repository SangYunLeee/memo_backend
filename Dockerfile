FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN yarn install --frozen-lockfile

COPY . .

ENV HASH_ROUNDS=7
ENV JWT_SECRET=leesecret
ENV SERVER_PORT=3001
ENV BASE_URL=localhost

ENV DB_HOST=www.entto.shop
ENV DB_PORT=30432
ENV DB_TYPE=postgres
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=dltkddbs12
ENV DB_DATABASE=postgres

EXPOSE 3001

CMD ["yarn", "start"]

