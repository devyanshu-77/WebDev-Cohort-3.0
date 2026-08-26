import express from "express";
const app = express();

app.use(express.json({ limit: "16kb" }));

let todos = [];

app.post("/add", (req, res) => {
  const { title, description } = req.body;
  const newTodo = {
    id: crypto.randomUUID(),
    title,
    description,
  };
  todos.push(newTodo);
  res.status(201).json({
    success: true,
    data: newTodo,
    message: "Created new todo",
  });
});
app.get("/todos", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fetched all todos",
    data: todos,
  });
});
app.get("/todo/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id == id);
  res.status(200).json({
    success: true,
    message: "Fetched one todo",
    data: todo,
  });
});
app.patch("/todo/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id == id);
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "No todo found with given id",
    });
  }
  const { title, description } = req.body;
  let updatedTodo = null;
  todos = todos.map((t) => {
    if (t.id == id) {
      updatedTodo = {
        id: t.id,
        title: title ? title : t.title,
        description: description ? description : t.description,
      };
      return updatedTodo;
    }
    return t;
  });

  res.status(200).json({
    success: false,
    message: "Updated todo successfully",
    data: updatedTodo,
  });
});
app.delete("/todos", (req, res) => {
  todos = [];
  res.status(200).json({
    success: true,
    message: "Deleted all todos",
  });
});
app.delete("/todo/:id", (req, res) => {
  const id = req.params.id;
  todos = todos.filter((t) => t.id != id);
  res.status(200).json({
    success: true,
    message: "Deleted single todo",
  });
});

app.listen(8080);
