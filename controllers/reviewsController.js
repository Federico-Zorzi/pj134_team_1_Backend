//connessione al db
const connection = require("../db_connection");

//index
function index(req, res) {
  const { id } = req.params;
  const sql =
    "SELECT reviews.id,name,content,living_days,vote,left_in,vote FROM reviews JOIN properties ON reviews.property_id = properties.id WHERE property_id = ?";
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "Id inserito non valido" });
  }
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
}

//* NELLA BUILD FINALE LE RECENSIONI ANDRANNO ACCETTATE PRIMA DI ESSERE PUBBLICATE
//store
function store(req, res) {
  const { id } = req.params;

  const { name, content, left_in, living_days, vote } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "Id inserito non valido" });
  }

  if (!name || !content || !left_in || !living_days || !vote) {
    return res
      .status(400)
      .json({ error: "Mancano parametri essenziali alla richiesta" });
  }

  if (isNaN(vote) || vote > 5 || vote < 1) {
    return res.status(400).json({ error: "Il voto è invalido" });
  }

  //TODO controllo che left_in  sia una data

  if (isNaN(living_days)) {
    return res
      .status(400)
      .json({ error: "I giorni vissuti inseriti sono invalidi" });
  }

  const sql =
    "INSERT INTO reviews (property_id, name, content, left_in, living_days, vote) VALUES (?, ?, ?, ?, ?, ?);";
  connection.query(
    sql,
    [id, name, content, left_in, living_days, vote],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "Recensione aggiunta con successo!" });
    }
  );
}

//delete
function destroy(req, res) {
  const { reviewId } = req.body;
  const sql = "DELETE FROM reviews WHERE id = ? ";
}

module.exports = { index, store };
