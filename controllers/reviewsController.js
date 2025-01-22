//connessione al db
const connection = require("../db_connection");

//index
function index(req, res) {
  const { id } = req.params;
  const sql =
    "SELECT reviews.id,name,content,living_days,vote,check_in,vote FROM reviews JOIN properties ON reviews.property_id = properties.id WHERE property_id = ?";
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

  const { name, content, check_in, living_days, vote } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "Id inserito non valido" });
  }

  if (!name || !content || !check_in || !living_days || !vote) {
    return res
      .status(400)
      .json({ error: "Mancano parametri essenziali alla richiesta" });
  }

  if (isNaN(vote) || vote > 5 || vote < 1) {
    return res.status(400).json({ error: "Il voto è invalido" });
  }
  //trasformo left in in una data
  const left_inDate = new Date(check_in);
  //controllo la validità
  if (isNaN(left_inDate.getTime())) {
    return res.status(400).json({ error: "La data è invalida" });
  }

  if (isNaN(living_days)) {
    return res
      .status(400)
      .json({ error: "I giorni vissuti inseriti sono invalidi" });
  }

  const sql =
    "INSERT INTO reviews (property_id, name, content, check_in, living_days, vote) VALUES (?, ?, ?, ?, ?, ?);";
  connection.query(
    sql,
    [id, name, content, check_in, living_days, vote],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "Recensione aggiunta con successo!" });
    }
  );
}

//update
function update(req, res) {
  const { id } = req.params;

  const fetchSql = "SELECT * FROM reviews WHERE id = ?";
  connection.query(fetchSql, [id], (fetchErr, fetchResults) => {
    if (fetchErr)
      return res
        .status(500)
        .json({ error: "Failed to fetch existing property data" });
    if (fetchResults.length === 0)
      return res.status(404).json({ error: "Recensione non trovata" });
    const existingData = fetchResults[0];
    const {
      name = existingData.name,
      content = existingData.content,
      living_days = existingData.living_days,
      vote = existingData.vote,
      check_in = existingData.check_in,
    } = req.body;

    //controllo che le variabili numeriche siano numeri
    if (isNaN(living_days)) {
      return res
        .status(400)
        .json({ error: "I giorni di permanenza devono essere un numero" });
    }
    if (isNaN(vote)) {
      return res.status(400).json({ error: "Il voto deve essere un numero" });
    }
    const updateSql =
      "UPDATE reviews SET name = ?, content = ?, check_in = ?, living_days = ?, vote = ? WHERE id = ?";
    connection.query(
      updateSql,
      [name, content, check_in, living_days, vote, id],
      (updateErr, updateResults) => {
        if (updateErr)
          return res.status(500).json({ error: "Database update failed" });
        res.json({ message: "Recensione modificata con successo!" });
      }
    );
  });
}

//delete
function destroy(req, res) {
  //L'ID DELLA REVIEW DA CANCELLARE VA INVIATO NEL BODY
  const { id } = req.params;
  const sql = "DELETE FROM reviews WHERE id = ? ";
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "Id inserito non valido" });
  }
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length < 1) {
      return res.status(404).json({ error: "Id non trovato" });
    }
    res.status(200).json({ error: "Recensione cancellata con successo!" });
  });
}

module.exports = { index, store, destroy, update };
