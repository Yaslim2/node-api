FROM node:14
WORKDIR /usr/workspace/clean-node-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start