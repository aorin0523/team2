# FROM node:24.0.2-alpine3.20
FROM node:22-alpine 

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]