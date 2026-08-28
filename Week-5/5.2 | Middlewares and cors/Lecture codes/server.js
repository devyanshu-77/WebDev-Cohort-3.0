import express from "express";
const app = express();

let requestCount = 0;

function requestIncreaser(req, res, next) {
  requestCount++;
  console.log(`Total number requests: ${requestCount}`);
  next();
}
app.get("/sum", requestIncreaser, (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  res.status(200).json({
    total: a + b,
  });
});

app.get("/multiply", requestIncreaser, (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  res.status(200).json({
    total: a * b,
  });
});

app.listen(8080);
