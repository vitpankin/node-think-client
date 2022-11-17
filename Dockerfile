# Check out https://hub.docker.com/_/node to select a new base image
FROM node:16.6 as build

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

ENV ENV prod

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN yarn install --silent

# Bundle app source code
COPY --chown=node . .

EXPOSE 80

CMD npx nodemon src/index.js

