//connessione al db
const connection = require("../db_connection");

//index
function index(req, res) {
  const sql = "SELECT * FROM properties";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
}

module.exports = { index };
