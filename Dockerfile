FROM node:alpine

RUN mkdir /src
WORKDIR /src

COPY packages packages/
COPY services services/
COPY services.config.js .
COPY package.json .

EXPOSE 8000

RUN yarn
CMD ["yarn", "start"]
