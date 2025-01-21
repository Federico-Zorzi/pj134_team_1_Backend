const express = require("express");
const propertiesRouter = express.Router();

const propertiesController = require("../controllers/propertiesController");

const reviewsController = require("../controllers/reviewsController");

//*PROPERTY CRUD

//index
propertiesRouter.get("/", propertiesController.index);

//show
propertiesRouter.get("/:id", propertiesController.show);

//*REVIEWS CRUD

//index
propertiesRouter.get("/:id/reviews", reviewsController.index);

module.exports = propertiesRouter;
