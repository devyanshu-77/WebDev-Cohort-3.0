// Assignment
// Can you try creating a middleware called auth that verifies if
// a user is logged in and ends the request early if the user
// isn’t logged in?

import express from "express";
const app = express();
import jwt from "jsonwebtoken";

app.use(express.json({ limit: "16kb" }));

const JWT_SECRET = "myJwtSecret";
const users = [];

function auth(req, res, next) {
  try {
    const token = req.headers.token;
    if (!token) {
      res.status(401).json({ message: "Token is required!" });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.username;
    next();
  } catch (err) {
    console.log("ERROR: ", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({
      message: "username and password both are required",
    });
  }

  if (3 > username.length) {
    return res.status(400).json({
      message: "username must contain atleast 3 chars",
    });
  }

  const existingUser = users.find((u) => u.username == username);
  if (existingUser) {
    return res.status(409).json({
      message: "User already exist with the given username",
    });
  }

  users.push({ username, password });
  res.status(201).json({
    message: "User signed up successfully",
  });
});
app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({
      message: "username and password both are required",
    });
  }

  if (3 > username.length) {
    return res.status(400).json({
      message: "username must contain atleast 3 chars",
    });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: "User does not exist" });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET);
  res.status(200).json({ token });
});
app.get("/me", auth, (req, res) => {
  const username = req.user;

  const user = users.find((u) => u.username === username);
  res.status(200).json({
    username: user.username,
    password: user.password,
  });
});

app.listen(8080, () => {
  console.log("Server is listening on PORT: 8080");
});
