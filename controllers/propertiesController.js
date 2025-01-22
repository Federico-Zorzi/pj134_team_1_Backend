//connessione al db
const connection = require("../db_connection");

//index
function index(req, res) {
  const sql = "SELECT * FROM properties ORDER BY likes DESC";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
}

//show
function show(req, res) {
  const { id } = req.params;
  const sql = "SELECT * FROM properties WHERE id = ?;";

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
  //destrutturazione del body
  const {
    title,
    n_Rooms,
    n_Beds,
    n_Bathrooms,
    square_meters,
    address,
    reference_email,
    city,
  } = req.body;

  let { property_type, image } = req.body;

  //inizializzazione likes
  const likes = 0;

  //controllo dei parametri nullabili
  if (!property_type) {
    property_type = "apartment";
  }
  if (!image) {
    image = "default.jpg";
  }

  //controllo dei parametri essenziali
  if (
    !title ||
    !n_Rooms ||
    !n_Beds ||
    !n_Bathrooms ||
    !square_meters ||
    !address ||
    !reference_email ||
    !city
  ) {
    return res
      .status(400)
      .json({ error: "Mancano parametri essenziali alla richiesta" });
  }

  //controllo che i metri quadri siano un numero
  if (isNaN(square_meters)) {
    return res
      .status(400)
      .json({ error: "I metri quadri devono essere un numero" });
  }

  const sql =
    "INSERT INTO properties (title,n_Rooms,n_Beds,n_Bathrooms,square_meters,address,reference_email,likes,property_type,image,city) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

  connection.query(
    sql,
    [
      title,
      n_Rooms,
      n_Beds,
      n_Bathrooms,
      square_meters,
      address,
      reference_email,
      likes,
      property_type,
      image,
      city,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "Immobile aggiunto con successo!" });
    }
  );
}

//delete
function destroy(req, res) {
  const { id } = req.params;
  const sqlReviews = "DELETE FROM reviews WHERE property_id = ?";

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "Id inserito non valido" });
  }

  //chiamata per cancellare le review
  connection.query(sqlReviews, [id], (err, results) => {
    const sqlProperties = "DELETE FROM properties WHERE id = ?;";

    //chiamata per cancellare l'immobile
    connection.query(sqlProperties, [id], (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });

      if (results.length < 1) {
        return res.status(404).json({ error: "Id non trovato" });
      }

      res.status(200).json({ error: "Proprietà cancellata con successo!" });
    });
  });
}
module.exports = { index, show, store, destroy };
