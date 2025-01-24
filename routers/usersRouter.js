//* INDEX USERS : host/users/
//* SHOW USER : host/users/specificuser
//* INDEX USERS EMAILS : host/users/emails
//* STORE USER : users/add

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

//email index
usersRouter.get("/emails", (req, res) => {
  const sql = "SELECT email FROM users";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length < 1) {
      return res.status(404).json({ error: "Nessuna mail trovata" });
    }
    res.json(results);
  });
});

//show
usersRouter.get("/specificuser", usersController.show);

//store
usersRouter.post("/add", usersController.store);

module.exports = usersRouter;
