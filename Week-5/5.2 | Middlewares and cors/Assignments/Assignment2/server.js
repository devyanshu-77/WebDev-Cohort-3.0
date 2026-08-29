// Assignment -
// Create a backend server in nonde.js, that returns the sum endpoint
// Write an HTML file, that hits the backend server using the 'fetch' api

import express from "express";
const app = express();

import cors from "cors";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  }),
);

app.post("/sum", (req, res) => {
  const a = parseInt(req.body.a);
  const b = parseInt(req.body.b);

  res.status(200).json({ total: a + b });
});

app.listen(8080);
