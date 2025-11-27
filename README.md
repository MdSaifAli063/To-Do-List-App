# ✅ To‑Do List App

A clean, fast, and accessible to‑do list built with vanilla web technologies.  
Organize your tasks, filter, search, drag to reorder, and toggle themes — all without dependencies.

<p align="center">
  <a href="#"><img alt="Built with HTML" src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white"></a>
  <a href="#"><img alt="Styled with CSS" src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white"></a>
  <a href="#"><img alt="Vanilla JS" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000"></a>
  <a href="#"><img alt="License" src="https://img.shields.io/badge/License-MIT-22c55e"></a>
  <a href="#"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-6366f1"></a>
</p>

- Preview

 ![image](https://github.com/Mdsaif4363/To-Do-List-App/blob/1a47697c0e2f0e68ce41b16d79dec944cd5194ba/Screenshot%202025-08-25%20161715.png)

---

## ✨ Features

- 🌗 Theme toggle (Light/Dark)
- ➕ Add tasks quickly
- ✅ Mark complete / ⏳ Keep active
- 🧰 Bulk actions: Toggle all • Clear completed
- 🧭 Filters: All • Active • Completed
- 🔎 Instant search
- ✏️ Inline edit (double‑click to rename)
- ↕️ Drag to reorder
- 🔔 Live updates with ARIA announcements
- 💨 Zero dependencies — just open and use

---

## 🚀 Getting Started

- Option A: Open `index.html` directly in your browser.
- Option B: Serve locally (recommended for best dev experience):
  - Using Node:
    - npx serve .
  - Using Python:
    - python3 -m http.server 5173
    - Open http://localhost:5173

No build step needed.

---

## 🧭 Usage

- Type in “Add a new task…” and press Enter or click “Add Task”.
- Click a task’s checkbox to toggle completion.
- Double‑click a task label to edit; press Enter to save, Esc to cancel.
- Use filters to view All / Active / Completed.
- Use the search box to quickly find tasks.
- “Toggle All” switches all tasks between active/completed.
- “Clear Completed” removes only completed tasks.
- Click the moon/sun button to switch themes.

Tip: Drag a task to reorder it.

---

## ♿ Accessibility

- Roles and ARIA:
  - Filter tabs use role="tab" with proper aria-selected.
  - List updates announced via aria-live="polite".
  - Buttons and inputs include accessible labels.
- Keyboard:
  - Enter to add or confirm edits.
  - Esc to cancel edits.
  - Tab/Shift+Tab for navigation across interactive elements.

---

## 🧱 Project Structure

. ├─ index.html 
# App markup and metadata 
├─ style.css 
# Styles, light/dark themes, layout, animations └─ script.js 
# App logic: CRUD, filters, search, drag/reorder, a11y

---

## 🔧 Configuration

- Theme: Controlled via the root html[data-theme] attribute and the Theme Toggle button.
- Search: Matches task text as you type.
- Filters: Managed via data-filter attributes on filter buttons.

---

## 🧪 Ideas & Roadmap

- 💾 Persist tasks and theme to localStorage
- 📱 Mobile gesture enhancements
- 🌐 i18n support
- ⌨️ More keyboard shortcuts (e.g., Ctrl+Enter to add)

---

## 🤝 Contributing

- Fork the repo
- Create a feature branch
- Commit with clear messages
- Open a PR — PRs welcome!
- Made in India!

---

## 📄 License

MIT License. Do anything, just include the license and attribution.

---

## 🙌 Acknowledgements

- Emojis for delightful icons
- Vanilla web platform FTW 🎉
