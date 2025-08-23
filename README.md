# To‑Do List App

A lightweight, accessible, and responsive to‑do app built with vanilla HTML, CSS, and JavaScript. It supports filtering, searching, drag‑and‑drop reordering, in‑place editing, bulk actions, and a light/dark theme toggle.

Tip in the UI: “Drag to reorder • Double‑click to edit”

## Features

- Add new tasks quickly
- Edit tasks in place (double‑click to edit)
- Mark tasks as completed/active
- Filter by All, Active, Completed
- Search tasks by text
- Bulk actions: Toggle All, Clear Completed
- Drag and drop to reorder tasks
- Light/Dark theme toggle (persists via `data-theme` on the `<html>` element)
- 100% client‑side, no backend required
- Accessible HTML with ARIA roles and live region updates

## Demo

- Local: see Quick Start below
- Hosted: add your deployment URL here (e.g., GitHub Pages, Netlify, Vercel)

## Tech Stack

- HTML5 (semantic structure, ARIA)
- CSS3 (responsive layout, theming)
- JavaScript (vanilla, no frameworks)

## Quick Start

Option A — Just open the file:

1. Clone or download this repo
2. Open `index.html` in a modern browser

Option B — Serve locally (recommended for consistent dev experience):

- Using Node.js (npx):
  ```bash
  npx serve .
  # then open the printed URL (e.g., http://localhost:3000)
  ```

Copy

Insert

Using Python:

# Python 3

python3 -m http.server 5173

# Python 2

python -m SimpleHTTPServer 5173

# then visit http://localhost:5173

Copy

Insert

Usage
Add a task: type in “Add a new task…” and click “Add Task” (Enter in the input often works as well)
Toggle theme: click the moon/sun button in the header
Mark complete: use the task’s complete toggle (e.g., checkbox or control in the list)
Edit: double‑click a task, make changes, then confirm (usually Enter or blur to save, Esc to cancel if implemented)
Reorder: drag a task and drop it in the desired position
Filter: use the All / Active / Completed tabs
Search: type in the “Search tasks…” box to filter by text
Bulk:
Toggle All: toggle all tasks between active/completed
Clear Completed: remove all completed tasks
Items left: see the counter in the footer for remaining active tasks
Project Structure
.
├── index.html # App markup and theme meta
├── style.css # UI styles and theme variables
└── script.js # App logic: state, events, filtering, drag-and-drop, etc.

Copy

Insert

You may add assets under an assets/ or public/ directory if needed.

Accessibility
Uses appropriate roles and attributes:
Filter buttons grouped as a role="tablist" with aria-selected
Live updates announced via aria-live="polite" on the to‑do list
Keyboard and screen reader friendly structure
Color‑contrast friendly theming; customize in style.css if needed
If you find any accessibility issues, please open an issue or PR.

Theming
The root <html> element uses data-theme="light" or data-theme="dark"
The theme toggle button (#theme-toggle) flips the theme and may persist the choice (implementation in script.js)
The <meta name="theme-color"> sets the browser UI color; keep it in sync with your theme brand color
Persistence
This app is fully client‑side and can store data in the browser (e.g., localStorage) so no server is required
Check script.js for the exact persistence approach and key names
Browser Support
Latest versions of Chrome, Edge, Firefox, and Safari
No Internet Explorer support
Development Notes
No build step required
Modify styles in style.css; update interactions and state handling in script.js
If you add dependencies or tooling later, document them here
Troubleshooting
Nothing happens when clicking “Add Task”:
Open DevTools console for errors
Ensure script.js is loading (check 200 response in Network tab)
Drag and drop feels off:
Confirm that pointer events are not blocked by CSS
Check your browser and try a fresh reload without extensions
Theme doesn’t persist:
Verify script.js logic and storage writes
Clear site data and try again
Roadmap Ideas
Task due dates and reminders
Subtasks / checklists
Multi‑list support (projects)
Import/export tasks (JSON)
Unit tests and CI
Contributing
Contributions are welcome! Please:

Fork the repo
Create a feature branch
Commit with clear messages
Open a pull request with a concise summary and screenshots (if UI changes)
License
Add your preferred license here (e.g., MIT). If you choose MIT, create a LICENSE file with the MIT terms.
