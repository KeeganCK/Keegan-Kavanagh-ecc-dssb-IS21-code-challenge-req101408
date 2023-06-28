# Keegan-Kavanagh-ecc-dssb-IS21-code-challenge-req101408

## Introduction
This repository is for the BC government code challenge "ecc-dssb-IS21-code-challenge-req101408". The backend has been done in Node with Express and the frontend has been done in React with TypeScript.

## Cloning the Repository

* In your terminal run ```git clone https://github.com/KeeganCK/Keegan-Kavanagh-ecc-dssb-IS21-code-challenge-req101408.git```
* After that is done, type in ```cd Keegan-Kavanagh-ecc-dssb-IS21-code-challenge-req101408``` and you'll be in your newly created folder (app)

## Getting the App Started
### Start the App Using Docker

* This is the simplest way to start this application. 
* From the applications home directory run ```docker-compose up --build``` to build the images. Once docker is finished building, you can open up the app by going to (http://localhost:3001). 
* The backend should start on port 3000 (http://localhost:3000) and the frontend should start on port 3001 (http://localhost:3001). 
* To stop the docker container hit ```ctrlC``` in the terminal and to re-start the app again run ```docker-compose up```

### How to Start the Backend Without Docker

* The backend should be started first to ensure it gets port 3000. 
* Change into the backend directory using ```cd backend```, then run ```npm install``` to install all dependencies. 
* Lastly, run ```node index.js``` to start the server on port 3000 (http://localhost:3000).

### How to Start Frontend Without Docker

* The frontend should always be started second so React can ask you to start the app on a different port from 3000, which the backend will be using. 
* First, open up another terminal. Once in the projects main directory, change into the frontend directory using ```cd frontend```, then run ```npm install```. 
* Lastly, run ```npm start``` to start up the app. When it prompts you to pick a different port besides 3000, say yes and it should start on port 3001 (http://localhost:3001).

## Swagger

* Swagger docs can be found at http://localhost:3000/api/api-docs