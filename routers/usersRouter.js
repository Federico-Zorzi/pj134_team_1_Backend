//Inizializzazione express
const express = require("express");
//Permessi di routing da express
const usersRouter = express.Router();

//connessione al db
const connection = require("../db_connection");

//import del controller
const usersController = require("../controllers/usersController");

//* USERS CRUD
//index
usersRouter.get("/", usersController.index);

//show
usersRouter.get("/:id", usersController.show);

//email index
usersRouter.get("/emails");

//store
usersRouter.post("/add", usersController.store);

module.exports = usersRouter;
