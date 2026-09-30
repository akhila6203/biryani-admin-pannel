const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const pool =
  require("../config/db");


/* =========================================
   ADMIN LOGIN
========================================= */

const adminLogin =
  async (req, res, next) => {
    try {

      const {
        email,
        password,
      } = req.body;


      /* =====================================
         VALIDATION
      ===================================== */

      if (
        !email ||
        !email.trim() ||
        !password
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Email and password are required.",
          });
      }


      const normalizedEmail =
        email
          .trim()
          .toLowerCase();


      /* =====================================
         GET ADMIN
      ===================================== */

      const [rows] =
        await pool.query(
          `
          SELECT
            id,
            name,
            username,
            email,
            password_hash
          FROM admins
          WHERE email = ?
          LIMIT 1
          `,
          [
            normalizedEmail,
          ]
        );


      /* =====================================
         ADMIN NOT FOUND
      ===================================== */

      if (
        rows.length === 0
      ) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password.",
          });
      }


      const admin =
        rows[0];


      /* =====================================
         CHECK PASSWORD
      ===================================== */

      const passwordMatched =
        await bcrypt.compare(
          password,
          admin.password_hash
        );


      if (
        !passwordMatched
      ) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password.",
          });
      }


      /* =====================================
         CREATE JWT TOKEN
      ===================================== */

      const token =
        jwt.sign(
          {
            id:
              admin.id,

            email:
              admin.email,

            username:
              admin.username,
          },

          process.env.JWT_SECRET,

          {
            expiresIn:
              "1d",
          }
        );


      /* =====================================
         LOGIN RESPONSE
      ===================================== */

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Login successful.",

          data: {

            token,

            admin: {
              id:
                admin.id,

              name:
                admin.name,

              username:
                admin.username,

              email:
                admin.email,
            },
          },
        });

    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );

      next(error);
    }
  };


/* =========================================
   ADMIN LOGOUT
========================================= */

const adminLogout =
  async (req, res, next) => {
    try {

      /*
        JWT token server database/session lo
        store cheyyatledu.

        Logout API success response isthundi.

        Actual token frontend lo remove
        cheyyabaduthundi.
      */

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Logout successful.",
        });

    } catch (error) {

      console.error(
        "Admin logout error:",
        error
      );

      next(error);
    }
  };


/* =========================================
   EXPORT CONTROLLERS
========================================= */

module.exports = {
  adminLogin,
  adminLogout,
};


// const bcrypt =
//   require("bcryptjs");

// const jwt =
//   require("jsonwebtoken");

// const pool =
//   require("../config/db");

// const adminLogin =
//   async (req, res, next) => {
//     try {
//       const {
//         email,
//         password,
//       } = req.body;

//       if (
//         !email ||
//         !email.trim() ||
//         !password
//       ) {
//         return res
//           .status(400)
//           .json({
//             success: false,
//             message:
//               "Email and password are required.",
//           });
//       }

//       const normalizedEmail =
//         email
//           .trim()
//           .toLowerCase();

//       const [rows] =
//         await pool.query(
//           `
//           SELECT
//             id,
//             name,
//             username,
//             email,
//             password_hash
//           FROM admins
//           WHERE email = ?
//           LIMIT 1
//           `,
//           [
//             normalizedEmail,
//           ]
//         );

//       if (
//         rows.length === 0
//       ) {
//         return res
//           .status(401)
//           .json({
//             success: false,
//             message:
//               "Invalid email or password.",
//           });
//       }

//       const admin =
//         rows[0];

//       const passwordMatched =
//         await bcrypt.compare(
//           password,
//           admin.password_hash
//         );

//       if (
//         !passwordMatched
//       ) {
//         return res
//           .status(401)
//           .json({
//             success: false,
//             message:
//               "Invalid email or password.",
//           });
//       }

//       const token =
//         jwt.sign(
//           {
//             id:
//               admin.id,

//             email:
//               admin.email,

//             username:
//               admin.username,
//           },

//           process.env
//             .JWT_SECRET,

//           {
//             expiresIn:
//               "1d",
//           }
//         );

//       return res
//         .status(200)
//         .json({
//           success: true,

//           message:
//             "Login successful.",

//           data: {
//             token,

//             admin: {
//               id:
//                 admin.id,

//               name:
//                 admin.name,

//               username:
//                 admin.username,

//               email:
//                 admin.email,
//             },
//           },
//         });
//     } catch (error) {
//       next(error);
//     }
//   };

// module.exports = {
//   adminLogin,
// };