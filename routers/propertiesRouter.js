//* INDEX PROPERTIES : host/properties
//* INDEX FILTRATO : host/properties/filtered
//* SHOW PROPERTY : host/properties/:id
//* STORE PROPERTY : host/properties/add
//* DELETE PROPERTY : host/properties/:id/delete
//* ADD LIKE : host/properties/:id/addlike
//* UPDATE PROPERTY : host/properties/:id/update

//* INDEX REVIEWS : host/properties/:id/reviews //  L'ID é DELLA PROPRIETA'
//* STORE REVIEW : host/properties/:id/addreview //  L'ID é DELLA PROPRIETA'
//* DELETE REVIEW : host/properties/deletereview/:id // L'ID é DELLA REVIEW
//* UPDATE REVIEW : host/properties/updatereview/:id // L'ID é DELLA REVIEW

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
  const { city, address, number_of_rooms, number_of_beds, property_type } =
    req.query;

  // base query
  let query = "SELECT * FROM properties WHERE 1=1";
  const params = [];

  // Filtri dinamici
  if (city) {
    query += " AND LOWER(city) LIKE ?";
    params.push(`%${city.toLowerCase()}%`);
  }
  if (address) {
    query += " AND LOWER(address) LIKE ?";
    params.push(`%${address.toLowerCase()}%`);
  }
  if (number_of_rooms && !isNaN(number_of_rooms)) {
    query += " AND number_of_rooms >= ?";
    params.push(number_of_rooms);
  }
  if (number_of_beds && !isNaN(number_of_beds)) {
    query += " AND number_of_beds >= ?";
    params.push(number_of_beds);
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
  const { likes = 1 } = req.body;

  if (isNaN(likes) || likes <= 0) {
    return res.status(400).json({ error: "Non puoi togliere like" });
  }

  const sql = "UPDATE properties SET likes = likes + ? WHERE id = ?";

  connection.query(sql, [likes, id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json({
      message: "Like aggiunto con successo",
      affectedRows: results.affectedRows,
    });
  });
});

propertiesRouter.delete("/:id/delete", propertiesController.destroy);

//update
propertiesRouter.put("/:id/update", propertiesController.update);

//*REVIEWS CRUD

//index
propertiesRouter.get("/:id/reviews", reviewsController.index);

//store
propertiesRouter.post("/:id/addreview", reviewsController.store);

//update
propertiesRouter.put("/updatereview/:id", reviewsController.update);

//delete
propertiesRouter.delete("/deletereview/:id", reviewsController.destroy);

module.exports = propertiesRouter;
