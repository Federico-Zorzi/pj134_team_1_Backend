//connessione al db
const connection = require("../db_connection");

//index
function index(req, res) {
  const { id } = req.params;
  const sql =
    "SELECT name,content,living_days,vote,left_in,vote FROM reviews JOIN properties ON reviews.property_id = properties.id WHERE property_id = ?";
  if (isNaN(id) || id < 1) {
    const err = new Error("Id inserito invalido");
    err.code = 400;
    throw err;
  }
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
}

module.exports = { index };
