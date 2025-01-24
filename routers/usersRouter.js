//* INDEX USERS : host/users/
//* SHOW USER : host/users/specificuser
//* SHOW PROPERY BY USER ID :
//* INDEX USERS EMAILS : host/users/emails
//* STORE USER : host/users/getproperties/:userid
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

//show properties by id
usersRouter.get("/getproperties/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT properties.* FROM properties JOIN users ON properties.owner_id = users.id WHERE users.id = ?";

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "Id inserito non valido" });
  }

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length < 1) {
      return res.status(404).json({ error: "Id non trovato" });
    }
    res.json(results);
  });
});

//store
usersRouter.post("/add", usersController.store);

module.exports = usersRouter;
