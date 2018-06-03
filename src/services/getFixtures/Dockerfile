FROM node:alpine

RUN mkdir /src
WORKDIR /src

COPY src/packages packages/
COPY src/services services/
COPY package.json .

ENV NODE_ENV production
ENV LOG_LEVEL NOTICE
ENV PORT 8000
ENV TIMEOUT 2000
ENV COMPETITION_ID 467
ENV API_BASE https://api.football-data.org/v1

EXPOSE 8000

RUN yarn
CMD ["node_modules/.bin/pm2-runtime", "services/getFixtures/index.js"]
