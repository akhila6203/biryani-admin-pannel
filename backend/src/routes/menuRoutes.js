const express = require("express");

const router = express.Router();

const {
  getPublicMenu,
  getAdminMenu,
  getPortions,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");


/* =========================================
   PUBLIC MENU
   USER SIDE

   GET /api/menu
========================================= */

router.get(
  "/",
  getPublicMenu
);


/* =========================================
   ADMIN MENU

   GET /api/menu/admin
========================================= */

router.get(
  "/admin",
  getAdminMenu
);


/* =========================================
   PORTIONS

   GET /api/menu/portions
========================================= */

router.get(
  "/portions",
  getPortions
);


/* =========================================
   CREATE MENU

   POST /api/menu
========================================= */

router.post(
  "/",
  createMenu
);


/* =========================================
   UPDATE MENU

   PUT /api/menu/:id
========================================= */

router.put(
  "/:id",
  updateMenu
);


/* =========================================
   DELETE MENU

   DELETE /api/menu/:id
========================================= */

router.delete(
  "/:id",
  deleteMenu
);


module.exports = router;