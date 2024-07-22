document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const prioritySelect = document.getElementById("priority-select");
  const dueDate = document.getElementById("due-date");
  const taskList = document.getElementById("task-list");
  const totalTasks = document.getElementById("total-tasks");
  const completedTasks = document.getElementById("completed-tasks");
  const searchInput = document.getElementById("search-input");
  const filterPriority = document.getElementById("filter-priority");
  const toggleDarkMode = document.getElementById("toggle-dark-mode");

  // Load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task ${task.priority} ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
                <span>${task.text}</span>
                <button class="remove-button"><i class="fas fa-trash-alt"></i></button>
            `;
      taskList.appendChild(li);
    });
    updateStats();
  }

  // Save tasks to localStorage
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach((task) => {
      tasks.push({
        text: task.querySelector("span").textContent,
        priority: task.classList[1],
        completed: task.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update statistics
  function updateStats() {
    const tasks = document.querySelectorAll("#task-list li");
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = document.querySelectorAll("#task-list li.completed").length;
  }

  // Show notification
  function showNotification(taskText, dueDate) {
    if (Notification.permission === "granted") {
      new Notification("Pengingat Tugas", {
        body: `Tugas: ${taskText}\nTanggal Jatuh Tempo: ${dueDate}`,
      });
    }
  }

  // Request notification permission
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Add task
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDateValue = dueDate.value;

    if (taskText === "") return; // Prevent adding empty tasks

    const li = document.createElement("li");
    li.className = `task ${priority}`;
    li.innerHTML = `
            <span>${taskText}</span>
            <button class="remove-button"><i class="fas fa-trash-alt"></i></button>
        `;
    taskList.appendChild(li);
    taskInput.value = "";
    dueDate.value = "";

    // Show notification
    showNotification(taskText, dueDateValue);
    saveTasks();
    updateStats();
  });

  // Remove or mark task as completed
  taskList.addEventListener("click", function (e) {
    if (e.target.closest(".remove-button")) {
      // Remove task
      e.target.closest("li").remove();
      saveTasks();
      updateStats();
    } else if (e.target.tagName === "SPAN") {
      // Mark task as completed
      e.target.parentElement.classList.toggle("completed");
      saveTasks();
      updateStats();
    }
  });

  // Search tasks
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const tasks = document.querySelectorAll("#task-list li");

    tasks.forEach((task) => {
      const taskText = task.querySelector("span").textContent.toLowerCase();
      task.style.display = taskText.includes(searchTerm) ? "" : "none";
    });
  });

  // Filter tasks by priority
  filterPriority.addEventListener("change", function () {
    const selectedPriority = filterPriority.value;
    const tasks = document.querySelectorAll("#task-list li");

    tasks.forEach((task) => {
      const taskPriority = task.classList[1];
      task.style.display = selectedPriority === "all" || taskPriority === selectedPriority ? "" : "none";
    });
  });

  // Toggle dark mode
  toggleDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });

  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  // Initial load of tasks
  loadTasks();
});
