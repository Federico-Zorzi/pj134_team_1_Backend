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
    number_of_rooms,
    number_of_beds,
    number_of_bathrooms,
    square_meters,
    address,
    reference_email,
    city,
    owner_id,
    description,
    property_type,
  } = req.body;

  let { image } = req.body;

  //inizializzazione likes
  const likes = 0;

  //controllo dei parametri nullabili

  if (!image) {
    image = "default.jpg";
  }

  //TODO CONTROLLO ESISTENZA DI OWNER ID

  //controllo dei parametri essenziali
  if (
    !title ||
    !number_of_rooms ||
    !number_of_beds ||
    !number_of_bathrooms ||
    !square_meters ||
    !address ||
    !reference_email ||
    !city ||
    !owner_id ||
    !description ||
    !property_type
  ) {
    return res
      .status(400)
      .json({ error: "Mancano parametri essenziali alla richiesta" });
  }

  //controllo le varibili numeriche siano numeri
  if (isNaN(square_meters)) {
    return res
      .status(400)
      .json({ error: "I metri quadri devono essere un numero" });
  }
  if (isNaN(number_of_beds)) {
    return res
      .status(400)
      .json({ error: "Il numero di letti deve essere un numero" });
  }

  if (isNaN(number_of_bathrooms)) {
    return res
      .status(400)
      .json({ error: "Il numero di bagni deve essere un numero" });
  }
  if (isNaN(number_of_rooms)) {
    return res
      .status(400)
      .json({ error: "Il numero di stanze deve essere un numero" });
  }
  if (isNaN(property_type)) {
    return res.status(400).json({ error: "Il property_type è invalido" });
  }

  const sql =
    "INSERT INTO properties (title,description,number_of_rooms,number_of_beds,number_of_bathrooms,square_meters,address,reference_email,likes,property_type,image,city,owner_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

  connection.query(
    sql,
    [
      title,
      description,
      number_of_rooms,
      number_of_beds,
      number_of_bathrooms,
      square_meters,
      address,
      reference_email,
      likes,
      property_type,
      image,
      city,
      owner_id,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "Immobile aggiunto con successo!" });

      const updateUserStatusSql = "UPDATE users SET isOwner = 1 WHERE id = ?";
      connection.query(updateUserStatusSql, [owner_id], (err, res) => {
        if (err)
          return res.status(500).json({ error: "Database query failed" });
        console.log("Users status updated");
      });
    }
  );
}

//update
function update(req, res) {
  const { id } = req.params;

  const fetchSql = "SELECT * FROM properties WHERE id = ?";

  connection.query(fetchSql, [id], (fetchErr, fetchResults) => {
    if (fetchErr)
      return res
        .status(500)
        .json({ error: "Failed to fetch existing property data" });
    if (fetchResults.length === 0)
      return res.status(404).json({ error: "Proprietà non trovata" });

    const existingData = fetchResults[0];

    const {
      title = existingData.title,
      description = existingData.description,
      number_of_rooms = existingData.number_of_rooms,
      number_of_beds = existingData.number_of_beds,
      number_of_bathrooms = existingData.number_of_bathrooms,
      square_meters = existingData.square_meters,
      address = existingData.address,
      reference_email = existingData.reference_email,
      property_type = existingData.property_type,
      image = existingData.image,
      city = existingData.city,
    } = req.body;

    //controllo le varibili numeriche siano numeri
    if (isNaN(square_meters)) {
      return res
        .status(400)
        .json({ error: "I metri quadri devono essere un numero" });
    }
    if (isNaN(number_of_beds)) {
      return res
        .status(400)
        .json({ error: "Il numero di letti deve essere un numero" });
    }

    if (isNaN(number_of_bathrooms)) {
      return res
        .status(400)
        .json({ error: "Il numero di bagni deve essere un numero" });
    }
    if (isNaN(number_of_rooms)) {
      return res
        .status(400)
        .json({ error: "Il numero di stanze deve essere un numero" });
    }
    if (isNaN(property_type)) {
      return res.status(400).json({ error: "Il property_type è invalido" });
    }

    //controllo di validità della mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (reference_email && !emailRegex.test(reference_email)) {
      return res.status(400).json({ error: "L'email inserita è invalida" });
    }

    const updateSql =
      "  UPDATE properties SET title = ?, description = ?,    number_of_rooms = ?,    number_of_beds = ?,   number_of_bathrooms = ?,   square_meters = ?,   address = ?,   reference_email = ?,   property_type = ?,    image = ?,    city = ? WHERE id = ?; ";

    const values = [
      title,
      description,
      number_of_rooms,
      number_of_beds,
      number_of_bathrooms,
      square_meters,
      address,
      reference_email,
      property_type,
      image,
      city,
      id,
    ];

    connection.query(updateSql, values, (updateErr, updateResults) => {
      if (updateErr)
        return res.status(500).json({ error: "Database update failed" });
      res.json({ message: "Proprietà modificata con successo!" });
    });
  });
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
module.exports = { index, show, store, destroy, update };
