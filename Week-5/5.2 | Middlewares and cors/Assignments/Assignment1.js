// Create a middleware function that logs each incoming request’s
// HTTP method, URL, and timestamp to the console

import express from "express";
const app = express();

function logRequest(req, res, next) {
  const date = new Date().toLocaleString();
  console.log(`Method: ${req.method} URL: ${req.url} Timestamp: ${date} `);
  next();
}

app.use(logRequest);

app.get("/sum", function (req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  res.json({
    ans: a + b,
  });
});
app.get("/multiply", function (req, res) {
  const a = req.query.a;
  const b = req.query.b;
  res.json({
    ans: a * b,
  });
});
app.get("/divide", function (req, res) {
  const a = req.query.a;
  const b = req.query.b;
  res.json({
    ans: a / b,
  });
});
app.get("/subtract", function (req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  res.json({
    ans: a - b,
  });
});

app.listen(8080);
