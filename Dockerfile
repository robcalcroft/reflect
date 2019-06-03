# Add as many build as you want, one for testing, one for production, etc etc
FROM node:10-alpine as builder

COPY package.json yarn.lock ./

RUN npm i yarn -g && \
  yarn

# prod build (needs to cleanup caches and make sure only prod deps are used)
FROM node:10-alpine

RUN mkdir /reflect

WORKDIR /reflect

COPY --from=builder node_modules node_modules

COPY src/ ./

# Run as non root user
USER node

ENTRYPOINT ["node", "./api/index.js"]

# TODO: need to dockarize the front end too
