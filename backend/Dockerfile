FROM node:18.13.0-alpine
WORKDIR /backend
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]