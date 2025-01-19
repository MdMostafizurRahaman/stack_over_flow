FROM node:20-alpine

WORKDIR /user

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3003

CMD ["node", "index.js"]