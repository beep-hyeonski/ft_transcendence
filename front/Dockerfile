FROM node:alpine

WORKDIR /app
COPY package.json /app/
# COPY package-lock.json /app/

RUN apk update && apk add bash
RUN npm install --legacy-peer-deps
COPY . /app/
RUN npm run build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
