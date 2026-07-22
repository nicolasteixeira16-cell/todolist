// ======================================================================
// Récupération des éléments HTML
// ======================================================================

// Élément qui affichera le nombre total de tâches.
const totalTasksEl = document.getElementById("totalTasks");

// Élément qui affichera le nombre de tâches terminées.
const completedTasksEl = document.getElementById("completedTasks");

// Élément qui affichera le nombre de tâches restantes.
const pendingTasksEl = document.getElementById("pendingTasks");

// Élément <canvas> qui accueillera le graphique Chart.js.
const tasksChartEl = document.getElementById("tasksChart");


// ======================================================================
// Variable qui contiendra le graphique Chart.js
// ======================================================================

// Au départ aucun graphique n'existe.
let tasksChart = null;


// ======================================================================
// Création du graphique
// ======================================================================

function createChart() {

  // Vérifie que l'élément canvas existe dans la page.
  // Si ce n'est pas le cas, on quitte la fonction.
  if (!tasksChartEl) return;

  // Création d'un nouveau graphique Chart.js.
  tasksChart = new Chart(tasksChartEl, {

    // Type de graphique : anneau (camembert avec un trou au centre).
    type: "doughnut",

    // Données du graphique.
    data: {

      // Les deux catégories affichées.
      labels: ["Terminées", "À faire"],

      // Les jeux de données du graphique.
      datasets: [

        {
          // Valeurs initiales.
          // Elles seront remplacées plus tard.
          data: [0, 0],

          // Couleur de chaque partie.
          // Vert = terminées
          // Orange = à faire
          backgroundColor: ["#4CAF50", "#FF9800"],

          // Couleur des bordures.
          borderColor: ["#ffffff", "#ffffff"],

          // Épaisseur de la bordure.
          borderWidth: 2,
        },
      ],
    },

    // Options du graphique.
    options: {

      // Le graphique s'adapte automatiquement à la taille de la fenêtre.
      responsive: true,

      // Autorise le graphique à remplir librement son conteneur.
      maintainAspectRatio: false,

      // Configuration des plugins Chart.js.
      plugins: {

        // Configuration de la légende.
        legend: {

          // Place la légende sous le graphique.
          position: "bottom",
        },

        // Configuration des info-bulles.
        tooltip: {

          callbacks: {

            // Personnalise le texte affiché au survol.
            // Exemple :
            // Terminées : 5
            label: context => `${context.label} : ${context.parsed}`,
          },
        },
      },
    },
  });
}


// ======================================================================
// Met à jour le graphique
// ======================================================================

// completed = nombre de tâches terminées
// pending = nombre de tâches restantes
function updateChart(completed, pending) {

  // Si le graphique n'existe pas encore,
  // on le crée.
  if (!tasksChart) {
    createChart();
  }

  // Si malgré tout le graphique n'existe toujours pas,
  // on quitte la fonction.
  if (!tasksChart) return;

  // Remplace les anciennes valeurs.
  tasksChart.data.datasets[0].data = [

    completed,
    pending
  ];

  // Demande à Chart.js de redessiner le graphique.
  tasksChart.update();
}


// ======================================================================
// Met à jour les statistiques affichées
// ======================================================================

function updateStats(todos) {

  // Nombre total de tâches.
  const totalTasks = todos.length;

  // Conserve uniquement les tâches terminées.
  // Puis compte leur nombre.
  const completedTasks =
    todos.filter(todo => todo.is_complete).length;

  // Les tâches restantes correspondent au total
  // moins les tâches terminées.
  const pendingTasks =
    totalTasks - completedTasks;

  // Met à jour le texte affiché dans la page.
  totalTasksEl.textContent =
    `Nombre total de tâches : ${totalTasks}`;

  completedTasksEl.textContent =
    `Nombre de tâches terminées : ${completedTasks}`;

  pendingTasksEl.textContent =
    `Nombre de tâches à faire : ${pendingTasks}`;

  // Met également à jour le graphique.
  updateChart(
    completedTasks,
    pendingTasks
  );
}


// ======================================================================
// Charge les statistiques depuis l'API
// ======================================================================

function loadStats() {

  // Envoie une requête GET au serveur.
  fetch("http://localhost:3000/todos")

    // Attend la réponse.
    .then(response =>

      // Transforme le JSON reçu en objet JavaScript.
      response.json()
    )

    // Les données sont maintenant disponibles.
    .then(data => {

      // Le tableau des tâches est stocké
      // dans le premier élément de la réponse.
      const todos = data[0].todolist;

      // Met à jour les statistiques.
      updateStats(todos);
    })

    // Si une erreur survient...
    .catch(error => {

      // Affiche un message d'erreur.
      totalTasksEl.textContent =
        "Impossible de charger les statistiques.";

      // Vide les autres statistiques.
      completedTasksEl.textContent = "";
      pendingTasksEl.textContent = "";

      // Affiche l'erreur dans la console du navigateur.
      console.error(error);
    });
}


// ======================================================================
// Chargement initial
// ======================================================================

// Charge immédiatement les statistiques
// lors de l'ouverture de la page.
loadStats();


// ======================================================================
// Actualisation automatique
// ======================================================================

// Toutes les 5 secondes (5000 millisecondes),
// recharge les statistiques.
setInterval(loadStats, 5000);


// ======================================================================
// Synchronisation entre plusieurs onglets
// ======================================================================

// Écoute les modifications du localStorage.
window.addEventListener("storage", event => {

  // Si la clé "todosUpdatedAt" est modifiée,
  // cela signifie qu'une tâche a changé.
  if (event.key === "todosUpdatedAt") {

    // Recharge immédiatement les statistiques.
    loadStats();
  }
});