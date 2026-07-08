let tasks = [];
let activeFilter = "all";
let activeSearch = "";
let activeSort = "newest";

const storageKeys = {
    tasks: "nexsoft-tasks",
    filter: "nexsoft-filter",
    sort: "nexsoft-sort"
};

function generateId() {
    return Date.now() + Math.random();
}

function loadTasks() {
    const savedTasks = localStorage.getItem(storageKeys.tasks);
    const savedFilter = localStorage.getItem(storageKeys.filter);
    const savedSort = localStorage.getItem(storageKeys.sort);

    try {
        tasks = savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
        tasks = [];
        localStorage.removeItem(storageKeys.tasks);
    }

    if (savedFilter) {
        activeFilter = savedFilter;
    }

    if (savedSort) {
        activeSort = savedSort;
        $("#sort-select").val(activeSort);
    }

    setActiveFilterButton();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
}

function saveSettings() {
    localStorage.setItem(storageKeys.filter, activeFilter);
    localStorage.setItem(storageKeys.sort, activeSort);
}

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

function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

function toggleComplete(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

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

function renderTasks() {
    const visibleTasks = applyFiltersAndSort();
    const taskList = $("#task-list");

    taskList.empty();

    visibleTasks.forEach(function (task) {
        const taskElement = buildTaskElement(task);
        taskList.append(taskElement);
        taskElement.slideDown(160);
    });

    $("#empty-state").toggle(visibleTasks.length === 0);

    $("#clear-completed-btn").toggle(tasks.some(function (task) {
        return task.completed;
    }));

    updateStats();
}

function buildTaskElement(task) {
    const dateInfo = formatDate(task.dueDate);
    const completedClass = task.completed ? "completed" : "";
    const checkmark = task.completed ? "✓" : "";

    const taskElement = $("<article>", {
        class: `task-item priority-${task.priority} ${completedClass}`,
        "data-id": task.id
    });

    const taskContent = $("<div>", {
        class: "task-content"
    });

    const checkboxButton = $("<button>", {
        class: `task-checkbox ${completedClass}`,
        type: "button",
        text: checkmark,
        "aria-label": task.completed ? "Mark task as active" : "Mark task as completed"
    });

    const textWrapper = $("<div>");
    const taskText = $("<p>", {
        class: "task-text",
        text: task.text
    });

    const taskMeta = $("<div>", {
        class: "task-meta"
    });

    const priorityPill = $("<span>", {
        class: "priority-pill",
        text: task.priority
    });

    taskMeta.append(priorityPill);

    if (dateInfo.text) {
        taskMeta.append(
            $("<span>", {
                class: dateInfo.className,
                text: dateInfo.text
            })
        );
    }

    const deleteButton = $("<button>", {
        class: "delete-btn",
        type: "button",
        text: "✕",
        "aria-label": "Delete task"
    });

    textWrapper.append(taskText, taskMeta);
    taskContent.append(checkboxButton, textWrapper);
    taskElement.append(taskContent, deleteButton);

    return taskElement;
}

function updateStats() {
    const totalTasks = tasks.length;

    const activeTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    const completedTasks = totalTasks - activeTasks;

    $("#total-count").text(totalTasks);
    $("#active-count").text(activeTasks);
    $("#completed-count").text(completedTasks);
}

function handleAddTask() {
    const taskInput = $("#task-input");
    const taskText = taskInput.val().trim();
    const priority = $("#priority-select").val();
    const dueDate = $("#due-date-input").val();

    if (taskText === "") {
        $("#validation-message").text("Please enter a task first.");
        taskInput.focus();
        return;
    }

    $("#validation-message").text("");

    addTask(taskText, priority, dueDate);

    taskInput.val("");
    $("#priority-select").val("medium");
    $("#due-date-input").val("");
    taskInput.focus();
}

function handleFilter(filterName) {
    activeFilter = filterName;
    setActiveFilterButton();
    saveSettings();
    renderTasks();
}

function setActiveFilterButton() {
    $(".filter-btn").removeClass("active-filter").removeAttr("aria-current");

    $(`.filter-btn[data-filter="${activeFilter}"]`)
        .addClass("active-filter")
        .attr("aria-current", "true");
}

function handleSearch(query) {
    activeSearch = query;
    renderTasks();
}

function handleSort(sortOption) {
    activeSort = sortOption;
    saveSettings();
    renderTasks();
}

function clearCompleted() {
    if (!tasks.some(function (task) {
        return task.completed;
    })) {
        return;
    }

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

function markAll(completed) {
    if (!tasks.length) {
        return;
    }

    tasks = tasks.map(function (task) {
        return {
            ...task,
            completed: completed
        };
    });

    saveTasks();
    renderTasks();
}

function formatDate(dateString) {
    if (!dateString) {
        return {
            text: "",
            className: ""
        };
    }

    const today = new Date();
    const dueDate = new Date(`${dateString}T00:00:00`);

    today.setHours(0, 0, 0, 0);

    const formattedDate = dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    if (dueDate < today) {
        return {
            text: `⚠️ ${formattedDate}`,
            className: "due-date overdue"
        };
    }

    if (dueDate.getTime() === today.getTime()) {
        return {
            text: `🕒 ${formattedDate}`,
            className: "due-date today"
        };
    }

    return {
        text: formattedDate,
        className: "due-date"
    };
}

$(document).ready(function () {
    loadTasks();

    $("#add-btn").on("click", handleAddTask);

    $("#task-input").on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleAddTask();
        }
    });

    $(".filter-btn").on("click", function () {
        handleFilter($(this).data("filter"));
    });

    $("#search-input").on("input", function () {
        handleSearch($(this).val());
    });

    $("#clear-search-btn").on("click", function () {
        $("#search-input").val("").focus();
        handleSearch("");
    });

    $("#sort-select").on("change", function () {
        handleSort($(this).val());
    });

    $("#task-list").on("click", ".delete-btn", function () {
        const taskCard = $(this).closest(".task-item");
        const taskId = Number(taskCard.data("id"));

        taskCard.fadeOut(160, function () {
            deleteTask(taskId);
        });
    });

    $("#task-list").on("click", ".task-checkbox", function () {
        const taskId = Number($(this).closest(".task-item").data("id"));
        toggleComplete(taskId);
    });

    $("#clear-completed-btn").on("click", clearCompleted);

    $("#mark-all-complete-btn").on("click", function () {
        markAll(true);
    });

    $("#mark-all-active-btn").on("click", function () {
        markAll(false);
    });
});