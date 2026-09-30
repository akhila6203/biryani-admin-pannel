const express =
  require("express");

const {
  getOrders,
} = require(
  "../controllers/orderController"
);

const {
  protectAdmin,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

router.get(
  "/",
  protectAdmin,
  getOrders
);

module.exports = router;