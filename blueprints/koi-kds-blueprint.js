/**
 * =============================================================================
 * taller.sh — Open Production Blueprint #02: KOI Kitchen & POS Queue Rig
 * Stack: Node.js · better-sqlite3 (WAL + Idempotent Queue) · Express · SSE
 * License: MIT / Open Proof of Iron — Turnkey setup & care: https://taller.sh
 * =============================================================================
 *
 * Quick start:
 *   npm init -y && npm install express better-sqlite3
 *   PORT=3040 WEBHOOK_TOKEN=replace-me node koi-kds-blueprint.js
 */

const express = require("express");
const Database = require("better-sqlite3");

const app = express();
app.use(express.json());

const db = new Database(process.env.DB_PATH || "./kitchen_queue.sqlite");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    items_json TEXT NOT NULL,
    total_eur REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    estimated_wait_minutes INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Connected iPad / tablet Kitchen Display SSE clients
const sseClients = new Set();

function broadcastQueueSnapshot() {
  const activeOrders = db
    .prepare(
      "SELECT * FROM orders WHERE status IN ('pending', 'preparing') ORDER BY created_at ASC"
    )
    .all();
  const payload = `data: ${JSON.stringify({ orders: activeOrders })}\n\n`;
  for (const res of sseClients) {
    res.write(payload);
  }
}

// 1. Live SSE stream for Kitchen Tablets (zero polling, instant ticket cards)
app.get("/api/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  sseClients.add(res);
  broadcastQueueSnapshot();

  req.on("close", () => sseClients.delete(res));
});

// 2. Idempotent POS / SumUp / Shopify Order Webhook Receiver
app.post("/api/webhooks/pos-order", (req, res) => {
  const token = req.headers["x-workshop-token"];
  if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ error: "Unauthorized webhook signature" });
  }

  const { orderId, customerName = "Counter Guest", customerPhone = "", items = [], total = 0 } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
  }

  // Race-free queue wait calculation (+8 mins per active ticket ahead, floor 10m)
  const queueLoad = db
    .prepare("SELECT COUNT(*) AS count FROM orders WHERE status IN ('pending', 'preparing')")
    .get();
  const estimatedWait = Math.max(10, (queueLoad.count + 1) * 8);

  // INSERT OR IGNORE guarantees duplicate POS webhook retries never double-print tickets
  const result = db
    .prepare(
      `INSERT OR IGNORE INTO orders
        (order_id, customer_name, customer_phone, items_json, total_eur, estimated_wait_minutes)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(orderId, customerName, customerPhone, JSON.stringify(items), total, estimatedWait);

  if (result.changes > 0) {
    broadcastQueueSnapshot();
  }

  return res.json({
    accepted: true,
    duplicateIgnored: result.changes === 0,
    orderId,
    estimatedWaitMinutes: estimatedWait
  });
});

// 3. Kitchen Staff Bump Endpoint (pending -> preparing -> ready)
app.patch("/api/orders/:orderId/status", (req, res) => {
  const { status } = req.body;
  if (!["pending", "preparing", "ready", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.prepare("UPDATE orders SET status = ? WHERE order_id = ?").run(status, req.params.orderId);
  broadcastQueueSnapshot();
  return res.json({ ok: true, orderId: req.params.orderId, status });
});

const PORT = process.env.PORT || 3040;
app.listen(PORT, () => {
  console.log(`[taller.sh // koi-kds] Kitchen queue listening on port ${PORT}`);
});
