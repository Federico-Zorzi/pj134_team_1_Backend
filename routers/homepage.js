// * EXPRESS SETUP
const express = require("express");

// * ROUTER SETUP
const router = express.Router();
const homepageController = require("../controllers/homepageController");

// * ROUTERS MIDDLEWARE

// * ROUTER
router.get("/", homepageController.index);

router.get("/:id", homepageController.show);

router.post("/", homepageController.store);

router.put("/:id", homepageController.update);

router.patch("/:id", homepageController.modify);

router.delete("/:id", homepageController.destroy);

// * EXPORT ROUTER
module.exports = router;
