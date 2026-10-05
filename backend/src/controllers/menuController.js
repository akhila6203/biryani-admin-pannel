const pool = require("../config/db");


/* =========================================
   FORMAT MENU ITEM
========================================= */

const formatMenuItem = (item) => {
  return {
    id: item.id,

    name:
      item.name,

    amount:
      Number(item.amount),

    created_at:
      item.created_at || null,

    updated_at:
      item.updated_at || null,
  };
};


/* =========================================
   VALIDATE MENU INPUT

   Portion removed.
   Only:
   - name
   - amount
========================================= */

const validateMenuInput = (
  name,
  amount
) => {
  const menuName =
    String(name || "").trim();

  const numericAmount =
    Number(amount);


  /* =====================================
     MENU NAME VALIDATION
  ===================================== */

  if (!menuName) {
    return {
      error:
        "Menu name is required.",
    };
  }


  /* =====================================
     AMOUNT VALIDATION
  ===================================== */

  if (
    !Number.isFinite(
      numericAmount
    ) ||
    numericAmount <= 0
  ) {
    return {
      error:
        "Please enter a valid amount.",
    };
  }


  return {
    menuName,
    numericAmount,
  };
};


/* =========================================
   PUBLIC MENU

   GET /api/menu
========================================= */

const getPublicMenu =
  async (req, res, next) => {
    try {
      const [rows] =
        await pool.query(`
          SELECT
            id,
            name,
            amount
          FROM menu_items
          WHERE is_active = 1
          ORDER BY id DESC
        `);


      return res
        .status(200)
        .json({
          success: true,

          data:
            rows.map(
              formatMenuItem
            ),
        });

    } catch (error) {
      console.error(
        "GET PUBLIC MENU ERROR:",
        error
      );

      next(error);
    }
  };


/* =========================================
   ADMIN MENU

   GET /api/menu/admin
========================================= */

const getAdminMenu =
  async (req, res, next) => {
    try {
      const [rows] =
        await pool.query(`
          SELECT
            id,
            name,
            amount,
            created_at,
            updated_at
          FROM menu_items
          WHERE is_active = 1
          ORDER BY id DESC
        `);


      return res
        .status(200)
        .json({
          success: true,

          data:
            rows.map(
              formatMenuItem
            ),
        });

    } catch (error) {
      console.error(
        "GET ADMIN MENU ERROR:",
        error
      );

      next(error);
    }
  };


/* =========================================
   GET PORTIONS

   Portion functionality is no longer used.

   We keep this controller function only
   because your existing menu route may still
   contain /api/menu/portions.

   This prevents existing route code from
   breaking.

   GET /api/menu/portions
========================================= */

const getPortions =
  async (req, res, next) => {
    try {
      return res
        .status(200)
        .json({
          success: true,
          data: [],
        });

    } catch (error) {
      console.error(
        "GET PORTIONS ERROR:",
        error
      );

      next(error);
    }
  };


/* =========================================
   CREATE MENU

   POST /api/menu

   Request:
   {
     "name": "Chicken Biryani",
     "amount": 400
   }
========================================= */

const createMenu =
  async (req, res, next) => {
    try {
      const {
        name,
        amount,
      } = req.body;


      /* =====================================
         VALIDATE
      ===================================== */

      const validation =
        validateMenuInput(
          name,
          amount
        );


      if (validation.error) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              validation.error,
          });
      }


      const {
        menuName,
        numericAmount,
      } = validation;


      /* =====================================
         INSERT MENU

         portion_type kept as empty string
         internally for compatibility with
         existing database structure.

         Portion is NOT required from frontend.
      ===================================== */

      const [result] =
        await pool.query(
          `
            INSERT INTO menu_items
            (
              name,
              portion_type,
              amount,
              is_active
            )
            VALUES (?, ?, ?, 1)
          `,
          [
            menuName,
            "",
            numericAmount,
          ]
        );


      /* =====================================
         GET CREATED MENU
      ===================================== */

      const [rows] =
        await pool.query(
          `
            SELECT
              id,
              name,
              amount,
              created_at,
              updated_at
            FROM menu_items
            WHERE id = ?
            LIMIT 1
          `,
          [
            result.insertId,
          ]
        );


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Menu added successfully.",

          data:
            formatMenuItem(
              rows[0]
            ),
        });

    } catch (error) {
      console.error(
        "CREATE MENU ERROR:",
        error
      );

      next(error);
    }
  };


/* =========================================
   UPDATE MENU

   PUT /api/menu/:id

   Request:
   {
     "name": "Chicken Biryani",
     "amount": 450
   }
========================================= */

const updateMenu =
  async (req, res, next) => {
    try {
      const id =
        Number(
          req.params.id
        );


      /* =====================================
         VALIDATE MENU ID
      ===================================== */

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid menu id.",
          });
      }


      const {
        name,
        amount,
      } = req.body;


      /* =====================================
         VALIDATE MENU DATA
      ===================================== */

      const validation =
        validateMenuInput(
          name,
          amount
        );


      if (validation.error) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              validation.error,
          });
      }


      const {
        menuName,
        numericAmount,
      } = validation;


      /* =====================================
         UPDATE MENU

         Do NOT update portion_type.

         This keeps old database records safe
         while Portion is no longer used by
         the application.
      ===================================== */

      const [result] =
        await pool.query(
          `
            UPDATE menu_items
            SET
              name = ?,
              amount = ?
            WHERE
              id = ?
              AND is_active = 1
          `,
          [
            menuName,
            numericAmount,
            id,
          ]
        );


      /* =====================================
         NOT FOUND
      ===================================== */

      if (
        result.affectedRows === 0
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Menu item not found.",
          });
      }


      /* =====================================
         GET UPDATED MENU
      ===================================== */

      const [rows] =
        await pool.query(
          `
            SELECT
              id,
              name,
              amount,
              created_at,
              updated_at
            FROM menu_items
            WHERE
              id = ?
              AND is_active = 1
            LIMIT 1
          `,
          [id]
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Menu updated successfully.",

          data:
            formatMenuItem(
              rows[0]
            ),
        });

    } catch (error) {
      console.error(
        "UPDATE MENU ERROR:",
        error
      );

      next(error);
    }
  };


/* =========================================
   DELETE MENU
========================================= */

const deleteMenu =
  async (req, res, next) => {
    try {
      const id =
        Number(
          req.params.id
        );


      /* =====================================
         VALIDATE MENU ID
      ===================================== */

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid menu id.",
          });
      }


      /* =====================================
         SOFT DELETE

         Existing functionality unchanged.
      ===================================== */

      const [result] =
        await pool.query(
          `
            UPDATE menu_items
            SET is_active = 0
            WHERE
              id = ?
              AND is_active = 1
          `,
          [id]
        );


      /* =====================================
         MENU NOT FOUND
      ===================================== */

      if (
        result.affectedRows === 0
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Menu item not found.",
          });
      }


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Menu deleted successfully.",
        });

    } catch (error) {
      console.error(
        "DELETE MENU ERROR:",
        error
      );

      next(error);
    }
  };


/* =========================================
   EXPORTS
========================================= */

module.exports = {
  getPublicMenu,
  getAdminMenu,
  getPortions,
  createMenu,
  updateMenu,
  deleteMenu,
};







// const pool = require("../config/db");


// /* =========================================
//    FORMAT MENU ITEM
// ========================================= */

// const formatMenuItem = (item) => {
//   return {
//     id: item.id,

//     name:
//       item.name,

//     portion:
//       item.portion_type,

//     amount:
//       Number(item.amount),

//     created_at:
//       item.created_at || null,

//     updated_at:
//       item.updated_at || null,
//   };
// };


// /* =========================================
//    VALIDATE MENU INPUT
// ========================================= */

// const validateMenuInput = (
//   name,
//   portion,
//   amount
// ) => {
//   const menuName =
//     String(name || "").trim();

//   const portionName =
//     String(portion || "").trim();

//   const numericAmount =
//     Number(amount);


//   if (!menuName) {
//     return {
//       error:
//         "Menu name is required.",
//     };
//   }


//   if (!portionName) {
//     return {
//       error:
//         "Portion is required.",
//     };
//   }


//   if (
//     portionName.length > 50
//   ) {
//     return {
//       error:
//         "Portion name is too long.",
//     };
//   }


//   if (
//     !Number.isFinite(
//       numericAmount
//     ) ||
//     numericAmount <= 0
//   ) {
//     return {
//       error:
//         "Please enter a valid amount.",
//     };
//   }


//   return {
//     menuName,
//     portionName,
//     numericAmount,
//   };
// };


// /* =========================================
//    PUBLIC MENU

//    GET /api/menu
// ========================================= */

// const getPublicMenu =
//   async (req, res, next) => {
//     try {
//       const [rows] =
//         await pool.query(`
//           SELECT
//             id,
//             name,
//             portion_type,
//             amount
//           FROM menu_items
//           WHERE is_active = 1
//           ORDER BY id DESC
//         `);


//       return res
//         .status(200)
//         .json({
//           success: true,

//           data:
//             rows.map(
//               formatMenuItem
//             ),
//         });

//     } catch (error) {
//       console.error(
//         "GET PUBLIC MENU ERROR:",
//         error
//       );

//       next(error);
//     }
//   };


// /* =========================================
//    ADMIN MENU

//    GET /api/menu/admin
// ========================================= */

// const getAdminMenu =
//   async (req, res, next) => {
//     try {
//       const [rows] =
//         await pool.query(`
//           SELECT
//             id,
//             name,
//             portion_type,
//             amount,
//             created_at,
//             updated_at
//           FROM menu_items
//           WHERE is_active = 1
//           ORDER BY id DESC
//         `);


//       return res
//         .status(200)
//         .json({
//           success: true,

//           data:
//             rows.map(
//               formatMenuItem
//             ),
//         });

//     } catch (error) {
//       console.error(
//         "GET ADMIN MENU ERROR:",
//         error
//       );

//       next(error);
//     }
//   };


// /* =========================================
//    GET PORTIONS

//    GET /api/menu/portions
// ========================================= */

// const getPortions =
//   async (req, res, next) => {
//     try {
//       const [rows] =
//         await pool.query(`
//           SELECT DISTINCT
//             portion_type
//           FROM menu_items
//           WHERE
//             is_active = 1
//             AND portion_type IS NOT NULL
//             AND TRIM(portion_type) <> ''
//           ORDER BY portion_type ASC
//         `);


//       const savedPortions =
//         rows.map(
//           (row) =>
//             row.portion_type
//         );


//       /*
//        * Default portions always
//        * dropdown lo untayi.
//        */

//       const defaultPortions = [
//         "Single",
//         "Double",
//         "Full",
//       ];


//       const portions = [
//         ...new Set([
//           ...defaultPortions,
//           ...savedPortions,
//         ]),
//       ];


//       return res
//         .status(200)
//         .json({
//           success: true,
//           data: portions,
//         });

//     } catch (error) {
//       console.error(
//         "GET PORTIONS ERROR:",
//         error
//       );

//       next(error);
//     }
//   };


// /* =========================================
//    CREATE MENU

//    POST /api/menu
// ========================================= */

// const createMenu =
//   async (req, res, next) => {
//     try {
//       const {
//         name,
//         portion,
//         amount,
//       } = req.body;


//       const validation =
//         validateMenuInput(
//           name,
//           portion,
//           amount
//         );


//       if (validation.error) {
//         return res
//           .status(400)
//           .json({
//             success: false,
//             message:
//               validation.error,
//           });
//       }


//       const {
//         menuName,
//         portionName,
//         numericAmount,
//       } = validation;


//       const [result] =
//         await pool.query(
//           `
//             INSERT INTO menu_items
//             (
//               name,
//               portion_type,
//               amount,
//               is_active
//             )
//             VALUES (?, ?, ?, 1)
//           `,
//           [
//             menuName,
//             portionName,
//             numericAmount,
//           ]
//         );


//       const [rows] =
//         await pool.query(
//           `
//             SELECT
//               id,
//               name,
//               portion_type,
//               amount,
//               created_at,
//               updated_at
//             FROM menu_items
//             WHERE id = ?
//             LIMIT 1
//           `,
//           [
//             result.insertId,
//           ]
//         );


//       return res
//         .status(201)
//         .json({
//           success: true,

//           message:
//             "Menu added successfully.",

//           data:
//             formatMenuItem(
//               rows[0]
//             ),
//         });

//     } catch (error) {
//       console.error(
//         "CREATE MENU ERROR:",
//         error
//       );

//       next(error);
//     }
//   };


// /* =========================================
//    UPDATE MENU

//    PUT /api/menu/:id
// ========================================= */

// const updateMenu =
//   async (req, res, next) => {
//     try {
//       const id =
//         Number(
//           req.params.id
//         );


//       if (
//         !Number.isInteger(id) ||
//         id <= 0
//       ) {
//         return res
//           .status(400)
//           .json({
//             success: false,
//             message:
//               "Invalid menu id.",
//           });
//       }


//       const {
//         name,
//         portion,
//         amount,
//       } = req.body;


//       const validation =
//         validateMenuInput(
//           name,
//           portion,
//           amount
//         );


//       if (validation.error) {
//         return res
//           .status(400)
//           .json({
//             success: false,
//             message:
//               validation.error,
//           });
//       }


//       const {
//         menuName,
//         portionName,
//         numericAmount,
//       } = validation;


//       const [result] =
//         await pool.query(
//           `
//             UPDATE menu_items
//             SET
//               name = ?,
//               portion_type = ?,
//               amount = ?
//             WHERE
//               id = ?
//               AND is_active = 1
//           `,
//           [
//             menuName,
//             portionName,
//             numericAmount,
//             id,
//           ]
//         );


//       if (
//         result.affectedRows === 0
//       ) {
//         return res
//           .status(404)
//           .json({
//             success: false,
//             message:
//               "Menu item not found.",
//           });
//       }


//       const [rows] =
//         await pool.query(
//           `
//             SELECT
//               id,
//               name,
//               portion_type,
//               amount,
//               created_at,
//               updated_at
//             FROM menu_items
//             WHERE
//               id = ?
//               AND is_active = 1
//             LIMIT 1
//           `,
//           [id]
//         );


//       return res
//         .status(200)
//         .json({
//           success: true,

//           message:
//             "Menu updated successfully.",

//           data:
//             formatMenuItem(
//               rows[0]
//             ),
//         });

//     } catch (error) {
//       console.error(
//         "UPDATE MENU ERROR:",
//         error
//       );

//       next(error);
//     }
//   };


// /* =========================================
//    DELETE MENU
// ========================================= */

// const deleteMenu =
//   async (req, res, next) => {
//     try {
//       const id =
//         Number(
//           req.params.id
//         );


//       if (
//         !Number.isInteger(id) ||
//         id <= 0
//       ) {
//         return res
//           .status(400)
//           .json({
//             success: false,
//             message:
//               "Invalid menu id.",
//           });
//       }


//       const [result] =
//         await pool.query(
//           `
//             UPDATE menu_items
//             SET is_active = 0
//             WHERE
//               id = ?
//               AND is_active = 1
//           `,
//           [id]
//         );


//       if (
//         result.affectedRows === 0
//       ) {
//         return res
//           .status(404)
//           .json({
//             success: false,
//             message:
//               "Menu item not found.",
//           });
//       }


//       return res
//         .status(200)
//         .json({
//           success: true,
//           message:
//             "Menu deleted successfully.",
//         });

//     } catch (error) {
//       console.error(
//         "DELETE MENU ERROR:",
//         error
//       );

//       next(error);
//     }
//   };


// module.exports = {
//   getPublicMenu,
//   getAdminMenu,
//   getPortions,
//   createMenu,
//   updateMenu,
//   deleteMenu,
// };