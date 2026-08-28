// Create an HTTP server
// It should have 4 routes
// 1. http://localhost:3000/multiply?a=1&b=2
// 2. http://localhost:3000/add?a=1&b=2
// 3. http://localhost:3000/divide?a=1&b=2
// 4. http://localhost:3000/subtract?a=1&b=2

import express from "express";
const app = express();

app.get("/add", (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  res.status(200).json({ sum: a + b });
});

app.get("/subtract", (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  res.status(200).json({ difference: a - b });
});

app.get("/multiply", (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  res.status(200).json({ product: a * b });
});

app.get("/divide", (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  res.status(200).json({ quotient: a / b });
});

app.listen(8080);
