const express = require('express');
const api = require('../Controllers/api');
const router = express.Router();

// Get
router.get('/healthEndpoint', api.healthEndpoint);
router.get('/getProducts', api.getProducts);

// Post
router.post('/addProduct', api.addProduct);
router.post('/editProduct', api.editProduct);

module.exports = router;