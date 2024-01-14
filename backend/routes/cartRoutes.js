const express = require("express");
const Carts = require("../models/Carts");
const router = express.Router();

const cartController = require("../controllers/cartControllers.js");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/", verifyToken, cartController.getCartByEmail);
router.post("/", cartController.addToCart);
router.delete("/:id", cartController.deleteCart);
router.put("/:id", cartController.updateCart);
router.get("/:id", cartController.getSingleCart);

module.exports = router;
