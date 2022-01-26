FROM node:14
WORKDIR /usr/workspace/clean-node-api
COPY ./package.json .
RUN npm install --only=prod
