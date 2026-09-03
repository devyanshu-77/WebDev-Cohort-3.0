import express from "express";
const app = express();
import jwt from "jsonwebtoken";

app.use(express.json({ limit: "16kb" }));

const JWT_SECRET = "myJWTsecret";

const users = [];

// http://localhost:8080/index.html
app.use(express.static("public"));

function auth(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      message: "Token is required",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded.username;
    next();
  });
}
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "username and password both are required",
    });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "username length must be at least 3 characters" });
  }

  const user = users.find((u) => u.username === username);

  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "You are signed up" });
});
app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "username and password both are required",
    });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "username length must be at least 3 characters" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET);
  res.status(200).json({ token });
});
app.get("/me", auth, (req, res) => {
  const username = req.user;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    username: user.username,
    password: user.password,
  });
});

app.listen(8080, () => {
  console.log("Server is listening on PORT: 8080");
});
