let tasks = [];
let activeFilter = "all";
let activeSearch = "";
let activeSort = "newest";

// Generates a unique ID for every task.
function generateId() {
    return Date.now() + Math.random();
}

// Loads tasks and filter from localStorage.
function loadTasks() {
    const savedTasks = localStorage.getItem("nexsoft-tasks");
    const savedFilter = localStorage.getItem("nexsoft-filter");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    if (savedFilter) {
        activeFilter = savedFilter;
    }

    $(".filter-btn").removeClass("active-filter");
    $(`.filter-btn[data-filter="${activeFilter}"]`).addClass("active-filter");

    renderTasks();
}

// Saves tasks array into localStorage.
function saveTasks() {
    localStorage.setItem("nexsoft-tasks", JSON.stringify(tasks));
}

// Saves the current filter into localStorage.
function saveFilter() {
    localStorage.setItem("nexsoft-filter", activeFilter);
}

// Creates a new task and adds it to the top.
function addTask(text, priority, dueDate) {
    const newTask = {
        id: generateId(),
        text: text,
        completed: false,
        priority: priority,
        dueDate: dueDate,
        createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
}

// Deletes one task by ID.
function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

// Toggles completed status for one task.
function toggleComplete(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Applies filter, search, and sort rules.
function applyFiltersAndSort() {
    let filteredTasks = [...tasks];

    if (activeFilter === "active") {
        filteredTasks = filteredTasks.filter(function (task) {
            return !task.completed;
        });
    }

    if (activeFilter === "completed") {
        filteredTasks = filteredTasks.filter(function (task) {
            return task.completed;
        });
    }

    if (activeFilter === "high-priority") {
        filteredTasks = filteredTasks.filter(function (task) {
            return task.priority === "high";
        });
    }

    if (activeSearch.trim() !== "") {
        filteredTasks = filteredTasks.filter(function (task) {
            return task.text.toLowerCase().includes(activeSearch.toLowerCase());
        });
    }

    if (activeSort === "newest") {
        filteredTasks.sort(function (a, b) {
            return b.createdAt - a.createdAt;
        });
    }

    if (activeSort === "oldest") {
        filteredTasks.sort(function (a, b) {
            return a.createdAt - b.createdAt;
        });
    }

    if (activeSort === "priority") {
        const priorityOrder = {
            high: 3,
            medium: 2,
            low: 1
        };

        filteredTasks.sort(function (a, b) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    if (activeSort === "due-date") {
        filteredTasks.sort(function (a, b) {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }

    return filteredTasks;
}

// Renders all visible tasks on the screen.
function renderTasks() {
    const visibleTasks = applyFiltersAndSort();

    $("#task-list").empty();

    visibleTasks.forEach(function (task) {
        const taskElement = buildTaskElement(task);
        $("#task-list").append(taskElement);
        taskElement.slideDown(180);
    });

    if (visibleTasks.length === 0) {
        $("#empty-state").show();
    } else {
        $("#empty-state").hide();
    }

    updateStats();

    if (tasks.some(function (task) {
        return task.completed;
    })) {
        $("#clear-completed-btn").show();
    } else {
        $("#clear-completed-btn").hide();
    }
}

// Builds one task card element.
function buildTaskElement(task) {
    const dateInfo = formatDate(task.dueDate);
    const completedClass = task.completed ? "completed" : "";
    const checkmark = task.completed ? "✓" : "";

    const taskElement = $(`
        <div class="task-item priority-${task.priority} ${completedClass}" data-id="${task.id}">
            <div class="task-content">
                <button class="task-checkbox ${completedClass}" type="button">
                    ${checkmark}
                </button>

                <div>
                    <p class="task-text">${task.text}</p>

                    <div class="task-meta">
                        <span class="priority-pill">${task.priority}</span>
                        ${dateInfo.html}
                    </div>
                </div>
            </div>

            <button class="delete-btn" type="button">✕</button>
        </div>
    `);

    return taskElement;
}

// Updates the task counter stats.
function updateStats() {
    const totalTasks = tasks.length;

    const activeTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    $("#total-count").text(totalTasks);
    $("#active-count").text(activeTasks);
    $("#completed-count").text(completedTasks);
}

// Reads the form and adds a task.
function handleAddTask() {
    const taskText = $("#task-input").val().trim();
    const priority = $("#priority-select").val();
    const dueDate = $("#due-date-input").val();

    if (taskText === "") {
        $("#validation-message").text("Please enter a task first.");
        return;
    }

    $("#validation-message").text("");

    addTask(taskText, priority, dueDate);

    $("#task-input").val("");
    $("#priority-select").val("medium");
    $("#due-date-input").val("");
    $("#task-input").focus();
}

// Changes the current filter.
function handleFilter(filterName) {
    activeFilter = filterName;

    $(".filter-btn").removeClass("active-filter");
    $(`.filter-btn[data-filter="${filterName}"]`).addClass("active-filter");

    saveFilter();
    renderTasks();
}

// Changes the current search query.
function handleSearch(query) {
    activeSearch = query;
    renderTasks();
}

// Changes the current sort option.
function handleSort(sortOption) {
    activeSort = sortOption;
    renderTasks();
}

// Clears all completed tasks after confirmation.
function clearCompleted() {
    const userConfirmed = confirm("Clear all completed tasks?");

    if (!userConfirmed) {
        return;
    }

    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
}

// Marks all tasks complete or active.
function markAll(completed) {
    tasks = tasks.map(function (task) {
        task.completed = completed;
        return task;
    });

    saveTasks();
    renderTasks();
}

// Formats due date and checks overdue or today.
function formatDate(dateString) {
    if (!dateString) {
        return {
            html: ""
        };
    }

    const today = new Date();
    const dueDate = new Date(dateString + "T00:00:00");

    today.setHours(0, 0, 0, 0);

    const formattedDate = dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    if (dueDate < today) {
        return {
            html: `<span class="due-date overdue">⚠️ ${formattedDate}</span>`
        };
    }

    if (dueDate.getTime() === today.getTime()) {
        return {
            html: `<span class="due-date today">🕒 ${formattedDate}</span>`
        };
    }

    return {
        html: `<span class="due-date">${formattedDate}</span>`
    };
}

$(document).ready(function () {
    loadTasks();

    $("#add-btn").on("click", function () {
        handleAddTask();
    });

    $("#task-input").on("keypress", function (event) {
        if (event.key === "Enter") {
            handleAddTask();
        }
    });

    $(".filter-btn").on("click", function () {
        const filterName = $(this).data("filter");
        handleFilter(filterName);
    });

    $("#search-input").on("input", function () {
        handleSearch($(this).val());
    });

    $("#clear-search-btn").on("click", function () {
        $("#search-input").val("");
        handleSearch("");
    });

    $("#sort-select").on("change", function () {
        handleSort($(this).val());
    });

    $("#task-list").on("click", ".delete-btn", function () {
        const taskCard = $(this).closest(".task-item");
        const taskId = Number(taskCard.data("id"));

        taskCard.fadeOut(180, function () {
            deleteTask(taskId);
        });
    });

    $("#task-list").on("click", ".task-checkbox", function () {
        const taskId = Number($(this).closest(".task-item").data("id"));
        toggleComplete(taskId);
    });

    $("#clear-completed-btn").on("click", function () {
        clearCompleted();
    });

    $("#mark-all-complete-btn").on("click", function () {
        markAll(true);
    });

    $("#mark-all-active-btn").on("click", function () {
        markAll(false);
    });
});