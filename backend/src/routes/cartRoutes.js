const express =
  require("express");

const {
  createCart,
  getCart,
} = require(
  "../controllers/cartController"
);

const router =
  express.Router();


/* CREATE CART */

router.post(
  "/",
  createCart
);


/* GET CART */

router.get(
  "/:id",
  getCart
);


module.exports = router;