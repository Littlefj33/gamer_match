FROM node:19.0
WORKDIR src\app
COPY package*.json ./
#RUN npm install -g node-pre-gyp

COPY . .
RUN apt-get update && apt-get install -y imagemagick
EXPOSE 3000