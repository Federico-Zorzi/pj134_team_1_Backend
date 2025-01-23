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

module.exports = { index, show };
