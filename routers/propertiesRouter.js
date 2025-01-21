const express = require("express");
const propertiesRouter = express.Router();

const propertiesController = require("../controllers/propertiesController");

//index
propertiesRouter.get("/properties", propertiesController.index);

module.exports = propertiesRouter;
