FROM node:20-alpine

WORKDIR /user

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV JWT_SECRET=rakib1320 \
    MINIO_ENDPOINT=localhost \
    MINIO_PORT=9000 \
    MINIO_ACCESS_KEY=minioadmin \
    MINIO_SECRET_KEY=minioadmin \
    MINIO_BUCKET_NAME=my-stack-bucket \
    CONNECT_DB=mongodb://localhost:27017/post-service

EXPOSE 3003

CMD ["node", "index.js"]
