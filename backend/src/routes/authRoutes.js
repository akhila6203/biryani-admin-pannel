const express =
  require("express");

const {
  adminLogin,
  adminLogout,
} = require(
  "../controllers/authController"
);


const router =
  express.Router();


/* =========================================
   LOGIN
========================================= */

router.post(
  "/login",
  adminLogin
);


/* =========================================
   LOGOUT
========================================= */

router.post(
  "/logout",
  adminLogout
);


module.exports = router;

// const express =
//   require("express");

// const {
//   adminLogin,
// } = require(
//   "../controllers/authController"
// );

// const router =
//   express.Router();

// router.post(
//   "/login",
//   adminLogin
// );

// module.exports = router;