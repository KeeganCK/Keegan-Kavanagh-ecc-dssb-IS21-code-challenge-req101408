const express = require("express");
const bodyParser = require('body-parser');
var cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swagger = require('./Swagger.json');

const apiRouter = require('./Routes/apiRoutes.js')
const app = express();

app.use(bodyParser.json());
// Allow cross origin
app.use(cors())
app.use('/api', apiRouter);
// Server swagger to /api/api-docs
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// Return custom http-error.js to frontend
app.use((error, req, res, next) => {
	res.status(error.code || 500);
	res.json({message: error.message || 'An unkown error occured'});
});

app.get("/", (req, res) => {
  res.send("ECC API, visit http://localhost:3000/api/api-docs to learn more");
});

app.listen(process.env.PORT || 3000)
console.log("Server started on port 3000");
