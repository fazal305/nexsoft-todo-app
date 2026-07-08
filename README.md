# Nexsoft To-Do App

A responsive dark neon To-Do List Application built for the Nexsoft Solutions Frontend Development Internship.

## Live Links

- GitHub Repository: https://github.com/fazal305/nexsoft-todo-app
- Live Demo: https://fazal305.github.io/nexsoft-todo-app/

## Overview

Nexsoft To-Do App is a browser-based task manager that helps users add, search, filter, sort, complete, and delete tasks.

The project uses `localStorage` so tasks stay saved after page refresh. It was built as an internship project and polished as part of the Fazal Labs portfolio ecosystem.

## Features

- Add tasks dynamically
- Delete tasks
- Mark tasks as completed
- Mark all tasks complete
- Mark all tasks active
- Clear completed tasks
- Store tasks in localStorage
- Filter by all, active, completed, and high priority
- Search tasks instantly
- Priority levels: low, medium, high
- Due date support
- Overdue task warning
- Due today indicator
- Sort by newest, oldest, priority, and due date
- Live task statistics
- Persistent filter and sort settings
- Responsive dark neon UI

## Tech Stack

- HTML5
- CSS3
- JavaScript
- jQuery 3.7.1
- Bootstrap 5
- localStorage
- GitHub Pages
  Folder Structure
  nexsoft-todo-app/
  index.html
  styles.css
  script.js
  README.md
  LICENSE
  .gitignore
  Getting Started

Clone the repository:

git clone https://github.com/fazal305/nexsoft-todo-app.git

Open the folder:

cd nexsoft-todo-app

Open index.html in your browser.

No installation or build tools are required.

localStorage Implementation

Tasks are stored in the browser using localStorage.

Storage keys:

nexsoft-tasks
nexsoft-filter
nexsoft-sort

Example task object:

{
id: 1720000000000.123,
text: "Complete internship task",
completed: false,
priority: "high",
dueDate: "2026-06-15",
createdAt: 1720000000000
}
Architecture Notes

The project is split into three main files:

index.html contains the app layout and form controls.
styles.css handles the dark neon interface, responsive layout, task cards, and focus states.
script.js handles task creation, deletion, completion, filtering, searching, sorting, localStorage, and rendering.

Task cards are generated dynamically with jQuery DOM methods instead of injecting raw user text into HTML templates.

Accessibility

Accessibility support includes:

Semantic main, section, and article elements
Labels for form inputs
Button type="button" attributes
Accessible labels for delete and complete buttons
Visible focus states
aria-live validation message
Keyboard-friendly form submission with Enter key
Performance

Performance notes:

Static frontend app
No backend required
Lightweight localStorage persistence
Small JavaScript file
No build process
GitHub Pages compatible
Testing Checklist

Before final submission:

Add a task
Add empty task and check validation
Mark a task complete
Delete a task
Add low, medium, and high priority tasks
Add due date and check display
Test overdue and due today states
Test all filters
Test search
Test sorting
Test clear completed
Refresh page and confirm tasks persist
Run JavaScript syntax check:
node --check script.js
Lessons Learned
Managing task state with JavaScript arrays
Saving and loading data with localStorage
Rendering dynamic UI with jQuery
Creating filters, search, and sort logic
Improving form accessibility
Preparing a small productivity app for portfolio use
Future Improvements
Add edit task feature
Add drag-and-drop reordering
Add categories or tags
Add dark/light theme toggle
Add export/import JSON backup
Add productivity dashboard charts
Add PWA offline installation support
