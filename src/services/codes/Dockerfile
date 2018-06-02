FROM node:alpine

RUN mkdir /src
WORKDIR /src

COPY src/packages packages/
COPY src/services services/
COPY package.json .

ENV NODE_ENV production
ENV LOG_LEVEL NOTICE

EXPOSE 8000

RUN yarn
CMD ["node_modules/.bin/pm2-runtime", "services/codes/index.js"]
