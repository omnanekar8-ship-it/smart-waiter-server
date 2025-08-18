// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Store table status (true = pressed/red, false = idle/green)
let tableStatus = { table1: false, table2: false };

// Store orders
let orders = [];

// ---------- API ENDPOINTS ----------

// Get status of tables
app.get("/status", (req, res) => {
  res.json(tableStatus);
});

// ESP8266 updates table button press
app.get("/button", (req, res) => {
  const table = req.query.table;
  const pressed = req.query.pressed === "true";

  if (tableStatus[`table${table}`] !== undefined) {
    tableStatus[`table${table}`] = pressed;
    console.log(`✅ Table ${table} button updated: ${pressed}`);
    res.send(`Table ${table} status updated`);
  } else {
    res.status(400).send("❌ Invalid table");
  }
});

// Send robot
app.get("/send", (req, res) => {
  const table = req.query.table;
  console.log(`🤖 Send robot to Table ${table}`);
  res.send(`Robot sent to Table ${table}`);
});

// Call robot
app.get("/call", (req, res) => {
  const table = req.query.table;
  console.log(`📢 Call robot from Table ${table}`);
  res.send(`Robot called from Table ${table}`);
});

// ESP32 updates order list
app.post("/orders", (req, res) => {
  orders = req.body;
  console.log("📝 Orders updated:", orders);
  res.send("Orders updated");
});

// Website/app fetches orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// ---------- START SERVER ----------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
