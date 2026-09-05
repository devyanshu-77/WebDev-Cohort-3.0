import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

app.use(express.static("public"));

const JWT_SECRET = "myJWTsecret";

const users = [];

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }
    req.user = user;
    next();
  });
}

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("SIGNUP DATA: \n", username, password);
  if (!username || !password) {
    return res.status(422).json({
      success: false,
      message: "Both username and password are required for signup",
    });
  }

  if (3 > username.length || 8 > password.length) {
    return res.status(422).json({
      success: false,
      message:
        "Username must be at least 3 characters and password at least 8 characters.",
    });
  }

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: `User already exist with the given user name - ${username}`,
    });
  }

  const newUser = {
    id: crypto.randomUUID(),
    username,
    password,
    todos: [],
  };
  users.push(newUser);
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
  res.cookie("token", token);
  res.status(201).json({
    success: true,
    message: "User signup successful",
    user: newUser,
  });
});
app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({
      success: false,
      message: "Both username and password are required for signup",
    });
  }

  if (3 > username.length || 8 > password.length) {
    return res.status(422).json({
      success: false,
      message:
        "Username must be at least 3 characters and password at least 8 characters.",
    });
  }

  const existingUser = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!existingUser) {
    return res.status(409).json({
      success: false,
      message: `User does not exist with the given user name - ${username}`,
    });
  }

  const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET);
  res.cookie("token", token);
  res.status(200).json({
    success: true,
    message: "User signed up successfully",
    user: {
      id: existingUser.id,
      username: existingUser.username,
      todos: existingUser.todos,
    },
  });
});
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

app.post("/todo", auth, (req, res) => {
  const user = req.user;
  const { todo } = req.body;
  if (!todo) {
    return res.status(422).json({
      success: false,
      message: "Todo is required",
    });
  }

  if (5 > todo.length) {
    return res.status(422).json({
      success: false,
      message: "Todo length must be at least 5 characters long",
    });
  }

  const newTodo = {
    id: crypto.randomUUID(),
    todo,
  };
  user.todos.push(newTodo);
  res.status(201).json({
    success: true,
    message: "Added new todo",
    todo: newTodo,
  });
});
app.patch("/todo/:todoId", auth, (req, res) => {
  const user = req.user;
  const todoId = req.params.todoId;
  if (!todoId) {
    return res
      .status(400)
      .json({ success: false, message: "Todo id is required" });
  }
  const { todo } = req.body;
  if (!todo) {
    return res.status(422).json({
      success: false,
      message: "Updated todo is required",
    });
  }

  if (todo && 5 > todo.length) {
    return res.status(422).json({
      success: false,
      message: "Todo length must be at least 5 characters long",
    });
  }

  const newTodos = user.todos.map((t) => {
    if (t.id === todoId) {
      return {
        id: t.id,
        todo,
      };
    }
    return t;
  });

  user.todos = newTodos;
  res.status(200).json({
    success: true,
    message: "Updated todo successfully",
    todo: { id: todoId, todo },
  });
});
app.delete("/todo/:todoId", auth, (req, res) => {
  const user = req.user;
  const todoId = req.params.todoId;
  if (!todoId) {
    return res.status(400).json({
      success: false,
      message: "Todo id is required",
    });
  }

  const todo = user.todos.find((t) => t.id === todoId);
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: `No todo exists with the given id: ${todoId}`,
    });
  }

  user.todos = user.todos.filter((t) => t.id !== todoId);
  res.status(200).json({
    success: true,
    message: "Deleted todo successfully",
  });
});
app.get("/todos", auth, (req, res) => {
  const user = req.user;
  if (0 === user.todos.length) {
    return res
      .status(404)
      .json({ success: false, message: "You don't have any todos", todos: [] });
  }
  res
    .status(200)
    .json({ success: true, message: "Fetched all todos", todos: user.todos });
});

app.listen(8080, () => {
  console.log("Server is listening on PORT: 8080");
});
