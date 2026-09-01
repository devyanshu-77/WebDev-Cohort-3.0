import express from "express";
const app = express();
import jwt from "jsonwebtoken";

app.use(express.json());

const JWT_SECRET = "myJWTsecreT";

const users = [];

// function generateToken() {
//   let options = [
//     "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o",
//     "p","q","r","s","t","u","v","w","x","y","z","A","B","C","D",
//     "E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S",
//     "T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7",
//     "8","9",
//   ];
//
//   let token = "";
//   for (let i = 0; i < 32; i++) {
//     // use a simple function here
//     token += options[Math.floor(Math.random() * options.length)];
//   }
//   return token;
// }
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    res.json({ message: "User already exist please sign in" });
    return;
  }
  users.push({ username, password });
  res.json({
    message: "You are signed up",
  });
  console.log("/signup Users: \n", users);
});
app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    res.json({ message: "Wrong username or password" });
  }
  const token = jwt.sign({ username }, JWT_SECRET);
  res.send(token);
  console.log("/signin Users: \n", users);
});
app.get("/me", (req, res) => {
  const token = req.headers.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded) {
    res.json({ message: "Invalid token" });
  }
  const user = users.find((u) => u.username === decoded.username);
  if (user) {
    res.json({
      username: user.username,
      password: user.password,
    });
  } else {
    res.send("Invalid token");
  }
  console.log("/me Users: \n", users);
});

app.listen(8080, () => {
  console.log("Server is listening on PORT: 8080");
});
