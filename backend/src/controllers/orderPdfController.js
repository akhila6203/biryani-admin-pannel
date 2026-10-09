const PDFDocument = require("pdfkit");
const db = require("../config/db");

const BRAND_RED = "#bf0000";

const cleanText = (value) =>
  String(value ?? "").trim();

const formatAmount = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function drawOrderDetails(doc, order) {
  const left = 45;
  const width = doc.page.width - 90;
  const labelWidth = 145;

  const ensureSpace = (height) => {
    if (doc.y + height > doc.page.height - 55) {
      doc.addPage();
    }
  };

  ensureSpace(50);

  const headerY = doc.y;

  doc.rect(left, headerY, width, 30)
    .fill(BRAND_RED);

  doc.fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(
      `Order #${order.id}`,
      left + 10,
      headerY + 9
    );

  doc.y = headerY + 30;

  const fields = [
    ["Order ID", order.id],
    ["Customer", order.customer_name],
    ["Mobile", order.mobile],
    ["Location", order.location],
    ["Order Item", order.orderItems],
    ["Total Amount", formatAmount(order.total_amount)],
    ["Order Date", formatDate(order.created_at)],
  ];

  fields.forEach(([label, value]) => {
    const text = cleanText(value) || "-";
    const valueWidth = width - labelWidth - 20;

    const valueHeight = doc.heightOfString(text, {
      width: valueWidth,
      fontSize: 9,
    });

    const rowHeight = Math.max(27, valueHeight + 14);

    ensureSpace(rowHeight);

    const y = doc.y;

    doc.rect(left, y, labelWidth, rowHeight)
      .fill("#f3f5f7");

    doc.rect(
      left + labelWidth,
      y,
      width - labelWidth,
      rowHeight
    ).fill("#ffffff");

    doc.rect(left, y, width, rowHeight)
      .lineWidth(0.5)
      .stroke("#d6dce2");

    doc.moveTo(left + labelWidth, y)
      .lineTo(left + labelWidth, y + rowHeight)
      .stroke("#d6dce2");

    doc.fillColor("#334155")
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(label, left + 8, y + 8, {
        width: labelWidth - 15,
      });

    doc.fillColor("#334155")
      .font("Helvetica")
      .fontSize(9)
      .text(text, left + labelWidth + 8, y + 8, {
        width: valueWidth,
      });

    doc.y = y + rowHeight;
  });

  doc.moveDown(1.3);
}

exports.downloadOrdersPdf = async (req, res) => {
  try {
    const rawIds = req.body?.orderIds;

    if (!Array.isArray(rawIds) || rawIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one order.",
      });
    }

    const orderIds = [...new Set(rawIds.map(Number))];

    if (
      orderIds.length > 500 ||
      orderIds.some(
        (id) => !Number.isSafeInteger(id) || id <= 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order selection.",
      });
    }

    const placeholders = orderIds.map(() => "?").join(",");

    // Adapt db import/execute to your existing MySQL pool
    // if its exported interface is different.
    const [orders] = await db.execute(
      `SELECT
         id,
         customer_name,
         mobile,
         location,
         total_amount,
         created_at
       FROM orders
       WHERE id IN (${placeholders})
         AND payment_status = 'paid'`,
      orderIds
    );

    if (orders.length !== orderIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more selected orders are unavailable or unpaid.",
      });
    }

    const [items] = await db.execute(
      `SELECT
         oi.order_id,
         oi.quantity,
         oi.portion_type,
         mi.name AS item_name
       FROM order_items oi
       LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id IN (${placeholders})
       ORDER BY oi.order_id, oi.id`,
      orderIds
    );

    const itemMap = new Map();

    items.forEach((item) => {
      const id = Number(item.order_id);

      if (!itemMap.has(id)) itemMap.set(id, []);

      const name = cleanText(item.item_name) || "Item";
      const size = cleanText(item.portion_type);
      const quantity = Number(item.quantity || 0);

      itemMap.get(id).push(
        `${name}${size ? ` (${size})` : ""}-${quantity}`
      );
    });

    const orderMap = new Map(
      orders.map((order) => [Number(order.id), order])
    );

    const selectedOrders = orderIds.map((id) => {
      const order = orderMap.get(id);

      return {
        ...order,
        orderItems: (itemMap.get(id) || []).join(", ") || "-",
      };
    });

    const doc = new PDFDocument({
      size: "A4",
      margin: 45,
      bufferPages: true,
    });

    const filename =
      `biryani-orders-${new Date().toISOString().slice(0, 10)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    doc.pipe(res);

    doc.fillColor(BRAND_RED)
      .font("Helvetica-Bold")
      .fontSize(19)
      .text("Biryani House - Order Details");

    doc.moveDown(0.3);

    doc.fillColor("#64748b")
      .font("Helvetica")
      .fontSize(9)
      .text(
        `Generated: ${formatDate(new Date())}    |    Orders: ${selectedOrders.length}`
      );

    doc.moveDown(1.5);

    selectedOrders.forEach((order) => {
      drawOrderDetails(doc, order);
    });

    doc.end();
  } catch (error) {
    console.error("Download orders PDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate orders PDF.",
      });
    }

    res.destroy(error);
  }
};