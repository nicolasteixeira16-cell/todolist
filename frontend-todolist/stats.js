const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const tasksChartEl = document.getElementById("tasksChart");

let tasksChart = null;

function createChart() {
  if (!tasksChartEl) return;

  tasksChart = new Chart(tasksChartEl, {
    type: "doughnut",
    data: {
      labels: ["Terminées", "À faire"],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ["#4CAF50", "#FF9800"],
          borderColor: ["#ffffff", "#ffffff"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: context => `${context.label} : ${context.parsed}`,
          },
        },
      },
    },
  });
}

function updateChart(completed, pending) {
  if (!tasksChart) {
    createChart();
  }
  if (!tasksChart) return;

  tasksChart.data.datasets[0].data = [completed, pending];
  tasksChart.update();
}

function updateStats(todos) {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.is_complete).length;
  const pendingTasks = totalTasks - completedTasks;

  totalTasksEl.textContent = `Nombre total de tâches : ${totalTasks}`;
  completedTasksEl.textContent = `Nombre de tâches terminées : ${completedTasks}`;
  pendingTasksEl.textContent = `Nombre de tâches à faire : ${pendingTasks}`;
  updateChart(completedTasks, pendingTasks);
}

function loadStats() {
  fetch("http://localhost:3000/todos")
    .then(response => response.json())
    .then(data => {
      const todos = data[0].todolist;
      updateStats(todos);
    })
    .catch(error => {
      totalTasksEl.textContent = "Impossible de charger les statistiques.";
      completedTasksEl.textContent = "";
      pendingTasksEl.textContent = "";
      console.error(error);
    });
}

loadStats();
setInterval(loadStats, 5000);
window.addEventListener("storage", event => {
  if (event.key === "todosUpdatedAt") {
    loadStats();
  }
});
