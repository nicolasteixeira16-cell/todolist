const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const taskDetails = document.getElementById("taskDetails");
const messageEl = document.getElementById("message");
const completeBtn = document.getElementById("completeBtn");
const reopenBtn = document.getElementById("reopenBtn");
const deleteBtn = document.getElementById("deleteBtn");

function showMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.style.color = isError ? "red" : "green";
}

function setButtonState(todo) {
    if (!todo) {
        completeBtn.disabled = true;
        reopenBtn.disabled = true;
        deleteBtn.disabled = true;
        return;
    }

    completeBtn.disabled = todo.is_complete;
    reopenBtn.disabled = !todo.is_complete;
}

function formatTags(tags) {
    return Array.isArray(tags) && tags.length > 0 ? tags.join(", ") : "Aucun tag";
}

function formatDate(value) {
    if (!value) return "Date inconnue";
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleString("fr-FR");
}

function loadTask() {
    if (!id) {
        taskDetails.innerHTML = "<p>ID de tâche manquant dans l'URL.</p>";
        setButtonState(null);
        return;
    }

    fetch(`http://localhost:3000/todos/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Tâche introuvable");
            }
            return response.json();
        })
        .then(todo => {
            taskDetails.innerHTML = `
                <h2>${todo.text}</h2>
                <p>ID : ${todo.id}</p>
                <p>Date : ${formatDate(todo.created_at)}</p>
                <p>Tags : ${formatTags(todo.Tags)}</p>
                <p>État : ${todo.is_complete ? "Terminée" : "En cours"}</p>
            `;
            setButtonState(todo);
            showMessage("");
        })
        .catch(error => {
            taskDetails.innerHTML = `<p>Erreur : ${error.message}</p>`;
            setButtonState(null);
            showMessage("Impossible de charger la tâche.", true);
        });
}

function updateTask(payload, message) {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("La mise à jour a échoué.");
            }
            return response.json();
        })
        .then(() => {
            showMessage(message);
            loadTask();
        })
        .catch(error => {
            showMessage(error.message, true);
        });
}

completeBtn.addEventListener("click", () => {
    updateTask({ is_complete: true }, "Tâche marquée comme terminée.");
});

reopenBtn.addEventListener("click", () => {
    updateTask({ is_complete: false }, "Tâche réouverte.");
});

deleteBtn.addEventListener("click", () => {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("La suppression a échoué.");
            }
            window.location.href = "tasks.html";
        })
        .catch(error => {
            showMessage(error.message, true);
        });
});

loadTask();
    