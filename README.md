# Nexsoft To-Do App

A responsive dark neon To-Do List Application built for the Nexsoft Solutions internship.

## Live Demo

https://fazal305.github.io/nexsoft-todo-app/

---

## Features

### Nexsoft Requirements

* Add and delete tasks dynamically
* Mark tasks as completed
* Store tasks using localStorage
* Filter tasks by All, Active, Completed, and High Priority
* Responsive and clean user interface

### Extra Features

* Live task statistics
* Search tasks instantly
* Priority levels (Low, Medium, High)
* Due date tracking
* Overdue task warnings
* Due today indicators
* Multiple sorting options
* Clear completed tasks
* Mark all complete
* Mark all active
* Persistent filter selection
* Neon cyberpunk design

---

## Tech Stack

* HTML5
* CSS3
* Bootstrap 5
* jQuery 3.7.1
* Vanilla JavaScript
* localStorage

---

## Project Structure

```text
nexsoft-todo-app/
│
├── index.html
├── styles.css
├── script.js
├── README.md
├── LICENSE
└── .gitignore
```

---

## localStorage Implementation

This project uses browser localStorage to persist tasks after page refreshes.

Tasks are stored under the key:

```javascript
nexsoft-tasks
```

Example task structure:

```javascript
{
  id: Date.now(),
  text: "Complete internship task",
  completed: false,
  priority: "high",
  dueDate: "2026-06-15",
  createdAt: Date.now()
}
```

Tasks are saved using:

```javascript
JSON.stringify(tasks)
```

Tasks are loaded using:

```javascript
JSON.parse(savedTasks)
```

---

## How To Run

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in your browser.

No installation required.

---

## Screenshots

Add screenshots here after deployment.

### Dashboard

```text
assets/screenshots/dashboard.png
```

### Filters

```text
assets/screenshots/filters.png
```

### Mobile View

```text
assets/screenshots/mobile-view.png
```

---

## GitHub Repository

https://github.com/fazal305/nexsoft-todo-app

---

## Internship Submission

Created as part of the Nexsoft Solutions Frontend Development Internship.

---

## Author

Fazal Abbas

GitHub:
https://github.com/fazal305

LinkedIn:
https://www.linkedin.com/in/fazal-abbas-4653dg86
