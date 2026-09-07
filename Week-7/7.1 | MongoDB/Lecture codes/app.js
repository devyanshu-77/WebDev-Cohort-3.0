import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User, Todo } from "./models.js";
import { JWT_SECRET, auth } from "./auth.js";

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password all three are required",
      });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.cookie("token", token);

    res.status(201).json({
      success: false,
      message: "User signup successfull",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password both are required for signin",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Wrong email or password" });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Wrong email or password",
      });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.cookie("token", token);

    res.status(200).json({
      success: false,
      message: "Fetched one user",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.post("/todo", auth, async (req, res) => {
  const { title, done = false } = req.body;
  if (!title) {
    return res.status(422).json({
      success: false,
      message: "Title is required",
    });
  }
  if (title.length < 5) {
    return res.status(422).json({
      success: false,
      message: "Title must contain altleast 5 characters",
    });
  }

  const userId = req.userId;
  const newTodo = await Todo.create({
    title,
    done,
    userId,
  });

  res.status(201).json({
    success: true,
    message: "Created new todo",
    todo: newTodo,
  });
});
app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;

  const todos = await Todo.find({ userId });
  if (todos.length === 0) {
    return res.status(404).json({
      success: true,
      message: "You don't have any todos",
      todos: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Fetched all todos",
    todos,
  });
});
app.get("/mark/:todoId", auth, async (req, res) => {
  const todoId = req.params.todoId;
  if (!todoId) {
    return res.status(422).json({
      success: false,
      message: "Todo id is required",
    });
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: todoId },
    [{ $set: { done: { $not: "$done" } } }],
    { updatePipeline: true, returnDocument: "after" },
  );

  if (!updatedTodo) {
    return res
      .status(404)
      .json({ success: false, message: "No todo exists with the given id" });
  }

  res
    .status(200)
    .json({ success: true, message: `Marked todo as ${updatedTodo.done}` });
});

export default app;
