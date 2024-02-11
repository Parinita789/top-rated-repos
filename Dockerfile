FROM node:18-alpine as base

FROM base as dev
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts --only=development

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]