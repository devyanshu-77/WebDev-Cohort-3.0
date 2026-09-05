const authFormWrapper = document.querySelector("#auth-form-wrapper");
const authHeading = document.querySelector("#auth-heading");
const authForm = document.querySelector("#auth-form");
const authErrMsg = document.querySelector("#err-msg");
const authFormSubmitBtn = document.querySelector("#auth-submit-btn");
const authSubmitBtn = document.querySelector("#auth-submit-btn");
const authChangeMsg = document.querySelector("#auth-change-msg");
let authTypeSpan = document.querySelector("#auth-type");

// Todo section
const todoWrapper = document.querySelector("#todo-wrapper");
const todoInput = document.querySelector("#todo-input");
const addTodoBtn = document.querySelector("#add-todo-btn");
const todoDisplay = document.querySelector("#todo-display");
const todoErrMsg = document.querySelector("#todo-err-msg");
const logoutBtn = document.querySelector("#logout-btn");

authChangeMsg.addEventListener("click", (e) => {
  if (e.target.id === "auth-type") {
    changeAuth(e);
  }
});
function changeAuth(e) {
  const currentType = authTypeSpan.dataset.authType;
  if (currentType === "signup") {
    authHeading.textContent = "Signin";
    authSubmitBtn.textContent = "Signin";
    const textNode = document.createTextNode("Don't have an account? ");
    const newSpan = document.createElement("span");

    newSpan.id = "auth-type";
    newSpan.dataset.authType = "signin";
    newSpan.style.color = "blue";
    newSpan.style.cursor = "pointer";
    newSpan.textContent = "sign up";

    authChangeMsg.innerHTML = "";
    authChangeMsg.append(textNode, newSpan);

    authTypeSpan = newSpan;
  } else {
    authHeading.textContent = "Signup";
    authSubmitBtn.textContent = "Signup";
    const textNode = document.createTextNode("Already have an accoun? ");
    const newSpan = document.createElement("span");

    newSpan.id = "auth-type";
    newSpan.dataset.authType = "signup";
    newSpan.style.color = "blue";
    newSpan.style.cursor = "pointer";
    newSpan.textContent = "sign in";

    authChangeMsg.innerHTML = "";
    authChangeMsg.append(textNode, newSpan);

    authTypeSpan = newSpan;
  }
}
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authErrMsg.textContent = "";
  const currentAuthType = authTypeSpan.dataset.authType;
  if (currentAuthType === "signup") {
    const formData = new FormData(authForm);
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      authErrMsg.textContent =
        "Both username and password are required for signup";
    }
    if (3 > username.length || 8 > password.length) {
      authErrMsg.textContent =
        "Username must be at least 3 characters and password at least 8 characters.";
    }

    await signup(username, password);
  } else {
    const formData = new FormData(authForm);
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      authErrMsg.textContent =
        "Both username and password are required for signup";
    }
    if (3 > username.length || 8 > password.length) {
      authErrMsg.textContent =
        "Username must be at least 3 characters and password at least 8 characters.";
    }

    await signin(username, password);
  }
});
async function signup(username, password) {
  try {
    await axios.post("http://localhost:8080/signup", {
      username,
      password,
    });

    todoWrapper.style.display = "block";
    authFormWrapper.style.display = "none";
  } catch (err) {
    if (err.response?.data?.message) {
      authErrMsg.textContent = err.response.data.message;
    } else {
      authErrMsg.textContent = "Something went wrong try again later!";
    }
  }
}
async function signin(username, password) {
  try {
    await axios.post("http://localhost:8080/signin", {
      username,
      password,
    });

    todoWrapper.style.display = "block";
    authFormWrapper.style.display = "none";
  } catch (err) {
    if (err.response?.data?.message) {
      authErrMsg.textContent = err.response.data.message;
    } else {
      authErrMsg.textContent = "Something went wrong try again later!";
    }
  }
}

addTodoBtn.addEventListener("click", () => {
  if (addTodoBtn.dataset.type === "add") {
    const todo = todoInput.value;
    addTodo(todo);
  }
});
async function addTodo(todo) {
  if (!todo) {
    todoErrMsg.textContent = "Todo is required";
    return;
  }

  if (5 > todo.length) {
    todoErrMsg.textContent = "Todo length must be altest 5 characters";
    return;
  }

  try {
    const res = await axios.post("http://localhost:8080/todo", {
      todo,
    });
    todoInput.value = "";
    const newTodo = document.createElement("div");
    const textNode = document.createTextNode(res.data.todo.todo);
    const btnsDiv = document.createElement("div");
    const updateBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    newTodo.className = "todo";
    newTodo.id = res.data.todo.id;

    updateBtn.className = "update-todo-btn";
    deleteBtn.className = "delete-todo-btn";
    updateBtn.textContent = "UPDATE";
    deleteBtn.textContent = "DELETE";

    btnsDiv.append(updateBtn, deleteBtn);
    newTodo.append(textNode, btnsDiv);

    todoDisplay.append(newTodo);
  } catch (err) {
    console.log("Create todo res: \n", err);
    if (err.response?.data?.message) {
      todoErrMsg.textContent = err.response.data.message;
    } else {
      todoErrMsg.textContent = "Something went wrong";
    }
  }
}

todoDisplay.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-todo-btn")) {
    const todoDiv = e.target.closest(".todo");
    const todoId = todoDiv.id;
    deleteTodo(todoId, todoDiv);
  } else if (e.target.classList.contains("update-todo-btn")) {
    const todoDiv = e.target.closest(".todo");
    const todoId = todoDiv.id;
    addTodoBtn.dataset.type = "update";
    todoInput.focus();
    addTodoBtn.textContent = "UPDATE";
    if (addTodoBtn.dataset.type === "update") {
      addTodoBtn.addEventListener("click", async () => {
        await updateTodo(todoId, todoDiv);
        addTodoBtn.textContent = "ADD TODO";
        addTodoBtn.dataset.type = "add";
      });
    }
  }
});

async function deleteTodo(todoId, todoDiv) {
  try {
    await axios.delete(`http://localhost:8080/todo/${todoId}`);
    todoDiv.remove();
  } catch (err) {
    if (err.response?.data?.message) {
      todoErrMsg.textContent = err.message.data.message;
    } else {
      todoErrMsg.textContent = "something went wrong";
    }
  }
}
async function updateTodo(todoId, todoDiv) {
  const todo = todoInput.value;
  if (!todo) {
    todoErrMsg.textContent = "Todo is required";
    return;
  }
  if (5 > todo.length) {
    todoErrMsg.textContent = "Todo length must be altest 5 characters";
    return;
  }

  try {
    const res = await axios.patch(`http://localhost:8080/todo/${todoId}`, {
      todo,
    });
    todoDiv.remove();
    const newTodo = document.createElement("div");
    const textNode = document.createTextNode(res.data.todo.todo);
    const btnsDiv = document.createElement("div");
    const updateBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    newTodo.className = "todo";
    newTodo.id = res.data.todo.id;

    updateBtn.className = "update-todo-btn";
    deleteBtn.className = "delete-todo-btn";
    updateBtn.textContent = "UPDATE";
    deleteBtn.textContent = "DELETE";

    btnsDiv.append(updateBtn, deleteBtn);
    newTodo.append(textNode, btnsDiv);

    todoDisplay.append(newTodo);
  } catch (err) {
    addTodoBtn.textContent = "ADD TODO";
    addTodoBtn.dataset.type = "add";
    if (err.response?.data?.message) {
      todoErrMsg.textContent = err.response.data.message;
    } else {
      todoErrMsg.textContent = "something went wrong";
    }
  }
}

async function checkCookie() {
  const cookie = await cookieStore.get("token");
  if (cookie) {
    authFormWrapper.style.display = "none";
    todoWrapper.style.display = "block";
    await getAllCookies();
  } else {
    todoWrapper.style.display = "none";
    authFormWrapper.style.display = "flex";
  }
}
checkCookie();

async function getAllCookies() {
  try {
    const res = await axios.get("http://localhost:8080/todos");
    res.data.todos.forEach((t) => {
      const newTodo = document.createElement("div");
      const textNode = document.createTextNode(t.todo);
      const btnsDiv = document.createElement("div");
      const updateBtn = document.createElement("button");
      const deleteBtn = document.createElement("button");

      newTodo.className = "todo";
      newTodo.id = t.id;

      updateBtn.className = "update-todo-btn";
      deleteBtn.className = "delete-todo-btn";
      updateBtn.textContent = "UPDATE";
      deleteBtn.textContent = "DELETE";

      btnsDiv.append(updateBtn, deleteBtn);
      newTodo.append(textNode, btnsDiv);

      todoDisplay.append(newTodo);
    });
  } catch (err) {
    console.log(err.response);
    if (err.response?.data?.todos?.length === 0) {
      todoErrMsg.textContent = err.response.data.message;
    }
  }
}

logoutBtn.addEventListener("click", async (e) => {
  await logout();
});
async function logout() {
  try {
    await axios.get("http://localhost:8080/logout");
    todoWrapper.style.display = "none";
    authFormWrapper.style.display = "flex";
  } catch (err) {
    if (err?.response?.data?.message) {
      todoErrMsg.textContent = err.response.dataset.message;
    } else {
      todoErrMsg.textContent = "Something went wrong";
    }
  }
}
