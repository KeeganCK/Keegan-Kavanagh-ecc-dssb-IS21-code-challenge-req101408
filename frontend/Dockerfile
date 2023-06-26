FROM node:18.13.0-alpine
WORKDIR /frontend
COPY ["package.json", "package-lock.json", "./"]
COPY . ./
RUN npm install
EXPOSE 3001
CMD npm run startDocker