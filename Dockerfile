FROM node:latest

RUN apt-get update && apt-get install -y graphicsmagick

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/
RUN npm install --legacy-peer-deps

COPY ./ /usr/src/app

