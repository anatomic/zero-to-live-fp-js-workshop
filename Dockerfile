FROM node:alpine

RUN mkdir /code
WORKDIR /code

COPY src/packages src/packages/
COPY src/services src/services/
COPY src/proxy.js src/proxy.js
COPY services.config.js .
COPY docker.config.js .
COPY package.json .

# We're only exposing three services at the moment
EXPOSE 8000 8001 8002

RUN yarn
CMD ["yarn", "start"]
