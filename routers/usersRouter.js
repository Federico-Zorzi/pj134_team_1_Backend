//Inizializzazione express
const express = require("express");
//Permessi di routing da express
const usersRouter = express.Router();

//import del controller
const usersController = require("../controllers/usersController");

//* USERS CRUD
//index
usersRouter.get("/", usersController.index);

//show
usersRouter.get("/:id", usersController.show);

module.exports = usersRouter;
