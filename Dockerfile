FROM node:16

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build 

EXPOSE 8082
CMD http-server dist --port=8082 --proxy http://34.68.129.82:8082