import fs from "node:fs";
import { program } from "commander";

program.name("Todo app").description("A simple CRUD todo app").version("1.0.0");

program
  .command("Add")
  .description("Add todo ")
  .argument("<todo>", "Todo to be added")
  .argument("<todo id>", "Unique id for todo")
  .action((todo, todoId) => {
    const newTodo = {
      id: todoId,
      todo,
    };
    let fileData = [];
    const data = fs.readFileSync("./todos.json", "utf8");
    const arrData = JSON.parse(data);
    fileData = [...arrData, newTodo];
    fs.writeFileSync("./todos.json", JSON.stringify(fileData));
  });

program
  .command("Show")
  .description("Show all todo")
  .action(() => {
    const data = fs.readFileSync("./todos.json", "utf8");
    const arrData = JSON.parse(data);
    console.log("Your todos \n", arrData);
  });

program
  .command("Update")
  .description("Update a todo")
  .argument("<id>", "Id of todo to be updated")
  .argument("<updated todo>", "Updated todo")
  .action((id, updatedTodo) => {
    const data = fs.readFileSync("./todos.json", "utf8");
    const arrData = JSON.parse(data);
    const newData = arrData.map((d) => {
      if (d.id == id) {
        return { id, updatedTodo };
      }
      return d;
    });
    fs.writeFileSync("./todos.json", JSON.stringify(newData));
  });

program
  .command("Delete")
  .description("Delete one todo")
  .argument("<id>", "Id of todo to be deleted")
  .action((id) => {
    const data = fs.readFileSync("./todos.json", "utf8");
    const arrData = JSON.parse(data);
    const newData = arrData.filter((d) => d.id != id);
    fs.writeFileSync("./todos.json", JSON.stringify(newData));
  });

program.parse();
