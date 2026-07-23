// ======================================================================
// Vérifie dans la console que le fichier JavaScript est bien chargé.
// Ce message apparaît dans l'onglet "Console" des outils de développement.
// ======================================================================
console.log("tasks.js chargé");


// ======================================================================
// Récupération des informations et des éléments HTML
// ======================================================================

// Récupère le prénom enregistré dans le localStorage.
// Cette valeur a normalement été enregistrée lors de la connexion.
const firstname = localStorage.getItem("firstname");

// Récupère l'élément HTML qui affichera le message de bienvenue.
const welcome = document.getElementById("welcome");

// Récupère la liste HTML (<ul> ou <ol>) qui contiendra les tâches.
const todoList = document.getElementById("todoList");

// Récupère le formulaire permettant d'ajouter une nouvelle tâche.
const newTaskForm = document.getElementById("newTaskForm");

// Récupère le champ de saisie où l'utilisateur écrit sa tâche.
const newTaskText = document.getElementById("newTaskText");

// Récupère l'élément HTML qui affichera les messages d'information.
const formMessage = document.getElementById("formMessage");


// ======================================================================
// Affiche un message de bienvenue personnalisé.
// Exemple : Bonjour Nicolas
// ======================================================================
welcome.textContent = `Bonjour ${firstname}`;



// ======================================================================
// Affiche toutes les tâches dans la page
// ======================================================================

// La fonction reçoit en paramètre un tableau de tâches.
function renderTodos(todos) {

  // Vide complètement la liste avant de la reconstruire.
  // Cela évite d'afficher plusieurs fois les mêmes tâches.
  todoList.innerHTML = "";

  // Parcourt chaque tâche du tableau.
  todos.forEach(todo => {

    // Crée un nouvel élément <li>.
    const li = document.createElement("li");

    // Opérateur ternaire :
    // Si la tâche est terminée
    // -> affiche "Terminé"
    // Sinon
    // -> affiche "À faire"
    const statusText =
      todo.is_complete ? "Terminé" : "À faire";

    // Choisit la classe CSS correspondant à l'état de la tâche.
    const statusClass =
      todo.is_complete
        ? "status-complete"
        : "status-pending";

    // Construit le contenu HTML de la tâche.
    li.innerHTML = `

      <div class="task-content">

        <!-- Nom de la tâche -->
        <span class="task-title">
          ${todo.text}
        </span>

        <!-- Badge indiquant l'état -->
        <span class="status-badge ${statusClass}">
          ${statusText}
        </span>

      </div>

      <!-- Lien vers la page détail -->
      <a href="detail.html?id=${todo.id}">
        Voir les détails
      </a>

    `;

    // Ajoute cette tâche à la liste HTML.
    todoList.appendChild(li);
  });
}



// ======================================================================
// Charge toutes les tâches depuis l'API
// ======================================================================

function loadTodos() {

  // Envoie une requête GET au serveur.
  fetch("https://todolist-nu-two-35.vercel.app/todos")

    // Attend la réponse.
    .then(response =>

      // Transforme le JSON reçu en objet JavaScript.
      response.json()
    )

    // Les données sont maintenant disponibles.
    .then(data => {

      // Le tableau des tâches est contenu
      // dans le premier élément de la réponse.
      const todos = data[0].todolist;

      // Affiche toutes les tâches.
      renderTodos(todos);

      // Efface un éventuel ancien message.
      formMessage.textContent = "";
    })

    // Si une erreur survient...
    .catch(error => {

      // Affiche un message d'erreur.
      formMessage.textContent =
        "Impossible de charger les tâches.";

      // Affiche l'erreur dans la console.
      console.error(error);
    });
}



// ======================================================================
// Gestion de l'ajout d'une nouvelle tâche
// ======================================================================

// Écoute l'envoi du formulaire.
newTaskForm.addEventListener("submit", event => {

  // Empêche le rechargement automatique de la page.
  event.preventDefault();

  // Récupère le texte saisi.
  // trim() supprime les espaces avant et après le texte.
  const text = newTaskText.value.trim();

  // Vérifie que le champ n'est pas vide.
  if (!text) {

    // Affiche un message d'erreur.
    formMessage.textContent =
      "Veuillez saisir une tâche.";

    // Quitte la fonction.
    return;
  }

  // Envoie une requête POST au serveur.
  fetch("https://todolist-nu-two-35.vercel.app/todos", {

    // Méthode HTTP utilisée.
    method: "POST",

    // Type de données envoyé.
    headers: {

      "Content-Type": "application/json"
    },

    // Transforme l'objet JavaScript en JSON.
    body: JSON.stringify({

      // Texte de la tâche.
      text,

      // Tableau de tags vide.
      Tags: [],

      // Nouvelle tâche non terminée.
      is_complete: false
    })
  })

    // Attend la réponse du serveur.
    .then(response => {

      // Vérifie si la création a réussi.
      if (!response.ok) {

        throw new Error(
          "La tâche n'a pas pu être ajoutée."
        );
      }

      // Convertit la réponse JSON.
      return response.json();
    })

    // Une fois la tâche ajoutée...
    .then(() => {

      // Vide le champ de saisie.
      newTaskText.value = "";

      // Affiche un message de succès.
      formMessage.textContent =
        "Tâche ajoutée avec succès.";

      // Recharge la liste des tâches.
      loadTodos();
    })

    // Si une erreur survient...
    .catch(error => {

      // Affiche le message d'erreur.
      formMessage.textContent =
        error.message;

      // Affiche également l'erreur dans la console.
      console.error(error);
    });
});



// ======================================================================
// Chargement initial des tâches
// ======================================================================

// Dès que la page est ouverte,
// récupère et affiche toutes les tâches.
loadTodos();