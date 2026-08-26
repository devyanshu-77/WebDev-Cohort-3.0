// Assignment - Trying to code a filesystem based todo app

import fs from "node:fs";
import express from "express";
const app = express();

app.use(express.json({ limit: "16kb" }));

app.post("/todo", (req, res) => {
  fs.readFile("./todos.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
    const arrData = JSON.parse(data);
    const { title, description } = req.body;
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      description,
    };
    arrData.push(newTodo);
    fs.writeFileSync("./todos.json", JSON.stringify(arrData));
    res.status(201).json({
      success: true,
      message: "Created new todo",
      data: newTodo,
    });
  });
});
app.get("/todos", (req, res) => {
  fs.readFile("./todos.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
    const arrData = JSON.parse(data);
    res.status(200).json({
      success: true,
      message: "Fetched all todos",
      data: arrData,
    });
  });
});
app.get("/todo/:id", (req, res) => {
  fs.readFile("./todos.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    const id = req.params.id;
    const arrData = JSON.parse(data);
    const todo = arrData.find((t) => t.id == id);
    res.status(200).json({
      success: true,
      message: "Fetched one todo",
      data: todo,
    });
  });
});
app.patch("/todo/:id", (req, res) => {
  fs.readFile("./todos.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).message({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
    const id = req.params.id;
    const { title, description } = req.body;
    const arrData = JSON.parse(data);
    let updatedTodo = null;
    const newData = arrData.map((t) => {
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
    fs.writeFileSync("./todos.json", JSON.stringify(newData), "utf8");
    res.status(200).json({
      success: true,
      message: "Successfully updated todo",
      data: updatedTodo,
    });
  });
});
app.delete("/todo/:id", (req, res) => {
  fs.readFile("./todos.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
    const id = req.params.id;
    const arrData = JSON.parse(data);
    const newData = arrData.filter((t) => t.id != id);
    fs.writeFileSync("./todos.json", JSON.stringify(newData), "utf8");
    res.status(200).json({
      success: true,
      message: "Deleted one todo successfully",
      data: null,
    });
  });
});
app.delete("/todos", (req, res) => {
  fs.readFile("./todos.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
    fs.writeFileSync("./todos.json", "[]", "utf8");
    res
      .status(200)
      .json({ success: false, message: "Deleted all todos", data: null });
  });
});
app.listen(8080);
