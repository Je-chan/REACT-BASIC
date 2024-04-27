FROM node:20-alpine
LABEL authors="je"
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "run", "start"
