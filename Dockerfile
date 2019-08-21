FROM node:10-alpine as deps
COPY package.json yarn.lock ./
RUN yarn
RUN yarn install --modules-folder node_modules_prod

# Test
FROM node:10-alpine as test
RUN mkdir /reflect
WORKDIR /reflect
COPY --from=deps node_modules node_modules
COPY ./ ./
RUN yarn test

# Production build (needs to cleanup caches and make sure only prod deps are used)
FROM node:10-alpine
RUN mkdir /reflect
WORKDIR /reflect
COPY --from=deps node_modules_prod node_modules
COPY src/ ./

# Run the app as non root user
USER node
ENTRYPOINT ["node", "./api/index.js"]
