// Récupère les paramètres présents dans l'URL.
// Exemple : detail.html?id=3
const params = new URLSearchParams(window.location.search);

// Récupère la valeur du paramètre "id".
// Si l'URL est detail.html?id=3, id contiendra "3".
const id = params.get("id");

// Récupère l'élément HTML qui affichera les informations de la tâche.
const taskDetails = document.getElementById("taskDetails");

// Récupère l'élément HTML qui affichera les messages de succès ou d'erreur.
const messageEl = document.getElementById("message");

// Récupère le bouton permettant de terminer une tâche.
const completeBtn = document.getElementById("completeBtn");

// Récupère le bouton permettant de rouvrir une tâche.
const reopenBtn = document.getElementById("reopenBtn");

// Récupère le bouton permettant de supprimer une tâche.
const deleteBtn = document.getElementById("deleteBtn");


// ======================================================================
// Fonction qui affiche un message à l'utilisateur
// ======================================================================

// text : texte à afficher
// isError : vaut false par défaut.
// Si true, le message sera rouge, sinon vert.
function showMessage(text, isError = false) {

    // Modifie le texte contenu dans l'élément HTML.
    messageEl.textContent = text;

    // Opérateur ternaire :
    // Si isError vaut true -> rouge
    // Sinon -> vert
    messageEl.style.color = isError ? "red" : "green";
}


// ======================================================================
// Active ou désactive les boutons selon l'état de la tâche
// ======================================================================

function setButtonState(todo) {

    // Si aucune tâche n'est disponible
    if (!todo) {

        // Désactive tous les boutons.
        completeBtn.disabled = true;
        reopenBtn.disabled = true;
        deleteBtn.disabled = true;

        // Quitte immédiatement la fonction.
        return;
    }

    // Si la tâche est déjà terminée,
    // le bouton "Terminer" devient inactif.
    completeBtn.disabled = todo.is_complete;

    // Si la tâche n'est pas terminée,
    // le bouton "Réouvrir" devient inactif.
    reopenBtn.disabled = !todo.is_complete;
}


// ======================================================================
// Formate les tags pour l'affichage
// ======================================================================

function formatTags(tags) {

    // Vérifie que tags est bien un tableau
    // ET qu'il contient au moins un élément.
    return Array.isArray(tags) && tags.length > 0

        // Si oui :
        // transforme le tableau en chaîne de caractères.
        // Exemple :
        // ["JS","Node"] devient
        // "JS, Node"
        ? tags.join(", ")

        // Sinon
        : "Aucun tag";
}


// ======================================================================
// Formate la date
// ======================================================================

function formatDate(value) {

    // Si aucune date n'existe
    if (!value)
        return "Date inconnue";

    // Transforme la chaîne de caractères en objet Date.
    const date = new Date(value);

    // Vérifie si la date est valide.
    return isNaN(date.getTime())

        // Si invalide, affiche la valeur d'origine.
        ? value

        // Sinon affiche la date au format français.
        : date.toLocaleString("fr-FR");
}


// ======================================================================
// Charge une tâche depuis l'API
// ======================================================================

function loadTask() {

    // Vérifie que l'id est présent dans l'URL.
    if (!id) {

        // Affiche un message d'erreur.
        taskDetails.innerHTML =
            "<p>ID de tâche manquant dans l'URL.</p>";

        // Désactive les boutons.
        setButtonState(null);

        return;
    }

    // Envoie une requête GET vers l'API.
    fetch(`http://localhost:3000/todos/${id}`)

        // Lorsque le serveur répond...
        .then(response => {

            // Si la réponse n'est pas correcte
            // (404, 500...)
            if (!response.ok) {

                // Déclenche une erreur.
                throw new Error("Tâche introuvable");
            }

            // Convertit la réponse JSON en objet JavaScript.
            return response.json();
        })

        // Le todo correspond à la tâche récupérée.
        .then(todo => {

            // Affiche les informations de la tâche.
            taskDetails.innerHTML = `
                <h2>${todo.text}</h2>
                <p>ID : ${todo.id}</p>
                <p>Date : ${formatDate(todo.created_at)}</p>
                <p>Tags : ${formatTags(todo.Tags)}</p>
                <p>État : ${todo.is_complete ? "Terminée" : "En cours"}</p>
            `;

            // Met à jour l'état des boutons.
            setButtonState(todo);

            // Vide le message précédent.
            showMessage("");
        })

        // Si une erreur survient
        .catch(error => {

            // Affiche l'erreur.
            taskDetails.innerHTML =
                `<p>Erreur : ${error.message}</p>`;

            // Désactive les boutons.
            setButtonState(null);

            // Affiche un message en rouge.
            showMessage("Impossible de charger la tâche.", true);
        });
}


// ======================================================================
// Met à jour une tâche (PUT)
// ======================================================================

// payload : données envoyées au serveur.
// message : message affiché après succès.
function updateTask(payload, message) {

    // Envoie une requête PUT.
    fetch(`http://localhost:3000/todos/${id}`, {

        // Méthode HTTP.
        method: "PUT",

        // Type des données envoyées.
        headers: {
            "Content-Type": "application/json"
        },

        // Transforme l'objet JavaScript en JSON.
        body: JSON.stringify(payload)
    })

        // Attend la réponse.
        .then(response => {

            // Vérifie si la mise à jour a réussi.
            if (!response.ok) {
                throw new Error("La mise à jour a échoué.");
            }

            // Convertit la réponse JSON.
            return response.json();
        })

        // Une fois la mise à jour terminée...
        .then(() => {

            // Affiche un message.
            showMessage(message);

            // Recharge la tâche pour mettre l'affichage à jour.
            loadTask();
        })

        // Si erreur.
        .catch(error => {

            // Affiche l'erreur en rouge.
            showMessage(error.message, true);
        });
}

// Gestion du bouton "Terminer"


// Écoute le clic sur le bouton.
completeBtn.addEventListener("click", () => {

    // Passe is_complete à true.
    updateTask(
        { is_complete: true },
        "Tâche marquée comme terminée."
    );
});

// Gestion du bouton "Réouvrir"
reopenBtn.addEventListener("click", () => {

    // Passe is_complete à false.
    updateTask(
        { is_complete: false },
        "Tâche réouverte."
    );
});

// Gestion du bouton "Supprimer"
deleteBtn.addEventListener("click", () => {

    // Envoie une requête DELETE.
    fetch(`http://localhost:3000/todos/${id}`, {

        method: "DELETE"
    })

        // Attend la réponse.
        .then(response => {

            // Vérifie si la suppression a réussi.
            if (!response.ok) {
                throw new Error("La suppression a échoué.");
            }

            // Redirige vers la liste des tâches.
            window.location.href = "tasks.html";
        })

        // Si erreur.
        .catch(error => {

            // Affiche l'erreur.
            showMessage(error.message, true);
        });
});


// Lance le chargement de la tâche dès l'ouverture de la page.
loadTask();
    