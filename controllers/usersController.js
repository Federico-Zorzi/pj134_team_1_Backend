//connessione al db
const connection = require("../db_connection");

//index
function index(req, res) {
  const sql = "SELECT * FROM users";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
}

//show
function show(req, res) {
  const { id } = req.params;
  const sql = "SELECT * FROM users WHERE id = ?;";

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
}

//store
function store(req, res) {
  const { email, name, surname, telephone } = req.body;

  console.log(email, name, surname, telephone);

  //controllo parametri essenziali
  if (!name || !surname || !email) {
    return res.status(400).json({ error: "Mancano parametri essenziali" });
  }

  //controllo che il numero di telefono sia un numero
  if (telephone && isNaN(telephone)) {
    return res
      .status(400)
      .json({ error: "il numero di telefono deve essere un numero" });
  }

  //controllo se la mail esiste già
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  connection.query(checkEmailSql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ error: "L'email è già registrata" });
    }
    //controllo di validità della mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: "L'email inserita è invalida" });
    }

    const sql =
      "INSERT INTO users(email, name, surname, telephone) VAlUES (?,?,?,?)";
    connection.query(sql, [email, name, surname, telephone], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "Utente aggiunto con successo!" });
    });
  });
}

module.exports = { index, show, store };
