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


const {
  downloadOrdersPdf,
} = require("../controllers/orderPdfController");


const router =
  express.Router();

router.get(
  "/",
  protectAdmin,
  getOrders
);

// router.post("/download-pdf", authMiddleware, downloadOrdersPdf);
router.post("/download-pdf", protectAdmin, downloadOrdersPdf);

module.exports = router;