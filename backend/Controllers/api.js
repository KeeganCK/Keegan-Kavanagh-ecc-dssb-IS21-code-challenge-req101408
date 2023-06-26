const fs = require("fs");
const HttpError = require("../http-error");
const uuid = require("uuid");
const myJsonSchema = require("../Schema.json");
const { Draft07 } = require("json-schema-library");

const jsonSchema = new Draft07(myJsonSchema);

// Check if server is working, will show green in top right of frontend app if good, red if bad
const healthEndpoint = async (req, res, next) => {
  res.status(200).json({
    message: 'Server is healthy'
  });
}

// Get all products
const getProducts = async (req, res, next) => {
  let data = [];
  try {
    const readData = await fs.readFileSync("./projects.json", "utf8");
    obj = JSON.parse(readData);
    data = obj.projectsArray;
  } catch (err) {
    const error = new HttpError("Can not get products, please try again", 500);
    return next(error);
  }

  res.status(200).json({
    data: data.reverse(),
  });
};

// Get products for a certain scrum master
const getscrumMasterProducts = async (req, res, next) => {
  let name = req.params.name;
  console.log(name);
  if (!name) {
    const error = new HttpError("Need to enter a name", 400);
    return next(error);
  }
  let data = [];

  // Get data from json file and check name given to all scrum master names, if equal add to list to send back
  try {
    const readData = await fs.readFileSync("./projects.json", "utf8");
    obj = JSON.parse(readData);
    for (let i = 0; i < obj.projectsArray.length; i++) {
      name = name.toLowerCase();
      scrumMaster = obj.projectsArray[i].scrumMasterName.toLowerCase();
      if (name === scrumMaster) {
        data.push(obj.projectsArray[i]);
      }
    }
  } catch (err) {
    const error = new HttpError("Can not get products, please try again", 500);
    return next(error);
  }

  res.status(200).json({
    // Reverse to get newest at the top (bottom of projects.json) same for all products arrays sent back
    data: data.reverse(),
  });
};

// Get products for a certain developer
const getdeveloperProducts = async (req, res, next) => {
  let name = req.params.name;
  if (!name) {
    const error = new HttpError("Need to enter a name", 400);
    return next(error);
  }

  let data = [];
  try {
    const readData = await fs.readFileSync("./projects.json", "utf8");
    obj = JSON.parse(readData);
    //Check all entries in projects json and then check all developers to see if it matches provided name
    for (let i = 0; i < obj.projectsArray.length; i++) {
      let inDevArray = false;
      for (let j = 0; j < obj.projectsArray[i].Developers.length; j++) {
        if (
          name.toLowerCase() ===
          obj.projectsArray[i].Developers[j].toLowerCase()
        ) {
          inDevArray = true;
        }
      }
      if (inDevArray) {
        data.push(obj.projectsArray[i]);
      }
    }
  } catch (err) {
    const error = new HttpError("Can not get products, please try again", 500);
    return next(error);
  }

  res.status(200).json({
    data: data.reverse(),
  });
};

//Add a product
const addProduct = async (req, res, next) => {
  // If body is empty, throw an error
  if (!req.body) {
    const error = new HttpError("Request Body not found", 400);
    return next(error);
  }

  const {
    productName,
    productOwnerName,
    Developers,
    scrumMasterName,
    startDate,
    methodology,
    location
  } = req.body;
  
  if (Developers.length === 0) {
    const error = new HttpError(
      "Need to have at least one developer, please try again",
      400
    );
    return next(error);
  }

  if(!productName || !productOwnerName || !scrumMasterName || !startDate || !methodology || !location) {
    const error = new HttpError(
      "Need fill out all required inputs, please try again",
      400
    );
    return next(error);
  }

  let newRecord;
  try {
    const readData = fs.readFileSync("./projects.json", "utf8");
    obj = JSON.parse(readData);
    tempObject = {
      productId: uuid.v4(),
      productName,
      productOwnerName,
      Developers,
      scrumMasterName,
      startDate,
      methodology,
      location
    };
    newRecord = tempObject;
    const isValid = jsonSchema.isValid(tempObject);
    if (!isValid) {
      const error = new HttpError(
        "Input did not meet Schema, please try again",
        400
      );
      return next(error);
    }
    obj.projectsArray.push(tempObject);
    json = JSON.stringify(obj); 
    fs.writeFileSync("./projects.json", json, "utf8");
  } catch (err) {
    console.log("err: ", err);
    const error = new HttpError(
      "Could not create product, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "Product Succesfully Added",
    record: newRecord,
  });
};

// edit project
const editProduct = async (req, res, next) => {
  // If body is empty, throw an error
  if (!req.body) {
    const error = new HttpError("Request Body not found", 400);
    return next(error);
  }

  const {
    productId,
    productName,
    productOwnerName,
    Developers,
    scrumMasterName,
    methodology,
    location
  } = req.body;
  console.log(req.body);

  // Checks to ensure at least on developer is there
  if (Developers.length === 0) {
    const error = new HttpError(
      "Need to have at least one developer, please try again",
      400
    );
    return next(error);
  }

  try {
    let wantedProduct;
    const readData = fs.readFileSync("./projects.json", "utf8");
    obj = JSON.parse(readData);

    let index = 0;
    // Find product, if not found return an error
    for (let i = 0; i < obj.projectsArray.length; i++) {
      if (obj.projectsArray[i].productId === productId) {
        wantedProduct = obj.projectsArray[i];
        index = i;
      }
    }
    if (!wantedProduct) {
      const error = new HttpError(
        "Can not find product, please try again",
        500
      );
      return next(error);
    }

    // Set object and reset to wantedProduct original values if none provided
    tempObject = {
      productId: productId,
      productName: productName ? productName : wantedProduct.productName,
      productOwnerName: productOwnerName
        ? productOwnerName
        : wantedProduct.productOwnerName,
      Developers: Developers.length > 0 ? Developers : wantedProduct.Developers,
      scrumMasterName: scrumMasterName
        ? scrumMasterName
        : wantedProduct.scrumMasterName,
      startDate: wantedProduct.startDate,
      methodology: methodology ? methodology : wantedProduct.methodology,
      location: location ? location : wantedProduct.location,
    };
    const isValid = jsonSchema.isValid(tempObject);
    if (!isValid) {
      const error = new HttpError(
        "Input did not meet Schema, please try again",
        400
      );
      return next(error);
    }
    obj.projectsArray[index] = tempObject;
    json = JSON.stringify(obj);
    fs.writeFileSync("./projects.json", json, "utf8");
  } catch (err) {
    const error = new HttpError("Can not edit product, please try again", 500);
    return next(error);
  }

  res.status(200).json({
    message: "Product Succesfully Edited",
  });
};

exports.healthEndpoint = healthEndpoint;
exports.getProducts = getProducts;
exports.addProduct = addProduct;
exports.editProduct = editProduct;
exports.getscrumMasterProducts = getscrumMasterProducts;
exports.getdeveloperProducts = getdeveloperProducts;
