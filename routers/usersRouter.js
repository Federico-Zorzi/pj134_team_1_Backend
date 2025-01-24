//* INDEX USERS : host/users/
//* SHOW USER : host/users/:id
//* SHOW USER BY EMAIL : host/users/:email
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
usersRouter.get("/:id", usersController.show);

//show by mail
usersRouter.get("/:email", (req, res) => {
  const { email } = req.params;

  //controllo di validità della mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "L'email inserita è invalida" });
  }

  const sql = "SELECT * FROM users WHERE email = ?;";

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length < 1) {
      return res.status(404).json({ error: "Email non trovata" });
    }
    res.json(results);
  });
});

//store
usersRouter.post("/add", usersController.store);

module.exports = usersRouter;
