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
    const readData = fs.readFileSync("./projects.json", "utf8");
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

  if(!productName || !productOwnerName || !scrumMasterName || !methodology || !location) {
    const error = new HttpError(
      "Need fill out all required inputs, please try again",
      400
    );
    return next(error);
  }

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
