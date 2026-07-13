console.log("tasks.js chargé");

const firstname = localStorage.getItem("firstname");
const welcome = document.getElementById("welcome");
const todoList = document.getElementById("todoList");
const newTaskForm = document.getElementById("newTaskForm");
const newTaskText = document.getElementById("newTaskText");
const formMessage = document.getElementById("formMessage");

welcome.textContent = `Bonjour ${firstname}`;

function renderTodos(todos) {
  todoList.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    const statusText = todo.is_complete ? "Terminé" : "À faire";
    const statusClass = todo.is_complete ? "status-complete" : "status-pending";

    li.innerHTML = `
      <div class="task-content">
        <span class="task-title">${todo.text}</span>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      <a href="detail.html?id=${todo.id}">
        Voir les détails
      </a>
    `;

    todoList.appendChild(li);
  });
}

function loadTodos() {
  fetch("http://localhost:3000/todos")
    .then(response => response.json())
    .then(data => {
      const todos = data[0].todolist;
      renderTodos(todos);
      formMessage.textContent = "";
    })
    .catch(error => {
      formMessage.textContent = "Impossible de charger les tâches.";
      console.error(error);
    });
}

newTaskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = newTaskText.value.trim();
  if (!text) {
    formMessage.textContent = "Veuillez saisir une tâche.";
    return;
  }

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      Tags: [],
      is_complete: false
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("La tâche n'a pas pu être ajoutée.");
      }
      return response.json();
    })
    .then(() => {
      newTaskText.value = "";
      formMessage.textContent = "Tâche ajoutée avec succès.";
      loadTodos();
    })
    .catch(error => {
      formMessage.textContent = error.message;
      console.error(error);
    });
});

loadTodos();