const pool = require("../config/db");


/* =========================================
   CREATE CART
========================================= */

const createCart = async (
  req,
  res,
  next
) => {
  let connection;

  try {
    const { items } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select at least one item.",
      });
    }

    /* =====================================
       VALIDATE ITEMS
    ===================================== */

    const normalizedItems = [];

    for (const item of items) {
      const menuItemId =
        Number(item.menuItemId);

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(
          menuItemId
        ) ||
        menuItemId <= 0 ||
        !Number.isInteger(
          quantity
        ) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid cart item.",
        });
      }

      normalizedItems.push({
        menuItemId,
        quantity,
      });
    }


    /* =====================================
       GET CONNECTION
    ===================================== */

    connection =
      await pool.getConnection();

    await connection.beginTransaction();


    /* =====================================
       GET REAL MENU DATA FROM DATABASE
    ===================================== */

    const preparedItems = [];

    let grandTotal = 0;

    for (
      const item of
      normalizedItems
    ) {
      const [rows] =
        await connection.query(
          `
          SELECT
            id,
            name,
            portion_type,
            amount
          FROM menu_items
          WHERE id = ?
            AND is_active = 1
          LIMIT 1
          `,
          [item.menuItemId]
        );

      if (rows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          message:
            "One of the selected menu items is unavailable.",
        });
      }

      const menuItem =
        rows[0];

      const unitAmount =
        Number(
          menuItem.amount
        );

      const itemTotal =
        unitAmount *
        item.quantity;

      grandTotal +=
        itemTotal;

      preparedItems.push({
        menuItemId:
          menuItem.id,

        name:
          menuItem.name,

        portion:
          menuItem.portion_type,

        quantity:
          item.quantity,

        unitAmount,

        totalAmount:
          itemTotal,
      });
    }


    /* =====================================
       CREATE CART
    ===================================== */

    const [cartResult] =
      await connection.query(
        `
        INSERT INTO carts
        (
          status,
          total_amount
        )
        VALUES
        (
          'active',
          ?
        )
        `,
        [grandTotal]
      );

    const cartId =
      cartResult.insertId;


    /* =====================================
       INSERT CART ITEMS
    ===================================== */

    for (
      const item of
      preparedItems
    ) {
      await connection.query(
        `
        INSERT INTO cart_items
        (
          cart_id,
          menu_item_id,
          item_name,
          portion_type,
          quantity,
          unit_amount,
          total_amount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          cartId,
          item.menuItemId,
          item.name,
          item.portion,
          item.quantity,
          item.unitAmount,
          item.totalAmount,
        ]
      );
    }


    await connection.commit();


    return res.status(201).json({
      success: true,

      message:
        "Cart saved successfully.",

      data: {
        cartId,
        totalAmount:
          grandTotal,

        items:
          preparedItems,
      },
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Cart rollback error:",
          rollbackError
        );
      }
    }

    next(error);

  } finally {
    if (connection) {
      connection.release();
    }
  }
};


/* =========================================
   GET CART
========================================= */

const getCart = async (
  req,
  res,
  next
) => {
  try {
    const cartId =
      Number(req.params.id);

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid cart id.",
      });
    }

    const [carts] =
      await pool.query(
        `
        SELECT
          id,
          status,
          total_amount,
          created_at,
          updated_at
        FROM carts
        WHERE id = ?
        LIMIT 1
        `,
        [cartId]
      );

    if (carts.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Cart not found.",
      });
    }

    const [items] =
      await pool.query(
        `
        SELECT
          id,
          menu_item_id,
          item_name,
          portion_type AS portion,
          quantity,
          unit_amount,
          total_amount
        FROM cart_items
        WHERE cart_id = ?
        ORDER BY id ASC
        `,
        [cartId]
      );

    return res.status(200).json({
      success: true,

      data: {
        ...carts[0],
        items,
      },
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createCart,
  getCart,
};