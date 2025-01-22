//* INDEX PROPERTIES : host/properties
//* INDEX FILTRATO : host/properties/filtered
//* SHOW PROPERTY : host/properties/:id
//* STORE PROPERTY : host/properties/add
//* DELETE PROPERTY : host/properties/:id/delete :
//* ADD LIKE : host/properties/:id/addlike

//* INDEX REVIEWS : host/properties/:id/reviews
//* STORE REVIEW : host/properties/:id/addreview
//* DELETE REVIEW: host/properties/deletereview/:id

//Inizializzazione express
const express = require("express");
//Permessi di routing da express
const propertiesRouter = express.Router();

//connessione al db
const connection = require("../db_connection");

//import dei controller
const propertiesController = require("../controllers/propertiesController");

const reviewsController = require("../controllers/reviewsController");

//*PROPERTY CRUD

//index
propertiesRouter.get("/", propertiesController.index);

//index filtrato
propertiesRouter.get("/filtered", (req, res) => {
  const { city, address, n_Rooms, n_Beds, property_type } = req.query;

  // base query
  let query = "SELECT * FROM properties WHERE 1=1";
  const params = [];

  // Filtri dinamici
  if (city) {
    query += " AND city LIKE ?";
    params.push(`${city.toLowerCase()}%`);
  }
  if (address) {
    query += " AND address LIKE ?";
    params.push(`${address.toLowerCase()}%`);
  }
  if (n_Rooms && !isNaN(n_Rooms)) {
    query += " AND n_Rooms >= ?";
    params.push(n_Rooms);
  }
  if (n_Beds && !isNaN(n_Beds)) {
    query += " AND n_Beds >= ?";
    params.push(n_Beds);
  }
  if (property_type) {
    query += " AND property_type = ?";
    params.push(property_type);
  }

  //ordinati per gradimento
  query += " ORDER BY likes DESC";

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
});

//show
propertiesRouter.get("/:id", propertiesController.show);

//store
propertiesRouter.post("/add", propertiesController.store);

//add like update
propertiesRouter.patch("/:id/addlike", (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE properties SET likes = likes + 1 WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json("Like aggiunto con successo");
  });
});

propertiesRouter.delete("/:id/delete", propertiesController.destroy);

//*REVIEWS CRUD

//index
propertiesRouter.get("/:id/reviews", reviewsController.index);

//store
propertiesRouter.post("/:id/addreview", reviewsController.store);

//delete
propertiesRouter.delete("/deletereview/:id", reviewsController.destroy);

module.exports = propertiesRouter;
