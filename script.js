
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const htmlEl = document.documentElement;

  const inputEl = $('#todo-input');
  const addBtn = $('#add-task-btn');
  const listEl = $('#todo-list');

  const filterButtons = $$('.filter-btn');
  const searchInput = $('#search-input');

  const toggleAllBtn = $('#toggle-all-btn');
  const clearCompletedBtn = $('#clear-completed-btn');

  const itemsLeftEl = $('#items-left');

  const themeToggleBtn = $('#theme-toggle');


  const STORAGE_KEYS = {
    tasks: 'todo:tasks',
    theme: 'todo:theme',
    filter: 'todo:filter',
  };

  let tasks = [];
  let currentFilter = loadFilter() || 'all';
  let searchQuery = '';

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.tasks);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map((t, idx) => ({
        id: String(t.id || uid()),
        title: String(t.title || '').trim(),
        completed: Boolean(t.completed),
        createdAt: Number(t.createdAt || Date.now()),
        order: typeof t.order === 'number' ? t.order : idx,
      }));
    } catch {
      return [];
    }
  }

  function saveFilter(f) {
    localStorage.setItem(STORAGE_KEYS.filter, f);
  }

  function loadFilter() {
    return localStorage.getItem(STORAGE_KEYS.filter);
  }

  function pluralize(n, word) {
    return `${n} ${word}${n === 1 ? '' : 's'}`;
  }

  function debounce(fn, wait = 200) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }


  function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    let theme = stored;
    if (!theme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme);
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-pressed', String(isDark));
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }

  function toggleTheme() {
    const current = htmlEl.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

 
  function filteredTasks() {
    let list = [...tasks];

 
    if (currentFilter === 'active') list = list.filter(t => !t.completed);
    else if (currentFilter === 'completed') list = list.filter(t => t.completed);

  
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }

    
    list.sort((a, b) => (a.order - b.order) || (a.createdAt - b.createdAt));
    return list;
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = task.completed ? 'completed' : '';
    li.setAttribute('draggable', 'true');

  
    const handle = document.createElement('button');
    handle.className = 'drag-handle secondary-btn';
    handle.type = 'button';
    handle.title = 'Drag to reorder';
    handle.setAttribute('aria-label', 'Drag to reorder');
    handle.textContent = '⋮⋮';

 
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle';
    checkbox.checked = !!task.completed;
    checkbox.setAttribute('aria-label', 'Mark complete');

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;
    title.setAttribute('tabindex', '0');
    title.setAttribute('role', 'textbox');
    title.setAttribute('aria-readonly', 'true');


    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn edit-btn';
    editBtn.type = 'button';
    editBtn.title = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.textContent = '✏️';

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn delete-btn danger';
    delBtn.type = 'button';
    delBtn.title = 'Delete';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.textContent = '🗑️';

    actions.append(editBtn, delBtn);
    li.append(handle, checkbox, title, actions);
    return li;
  }

  function render() {
    const prevFocusId = document.activeElement && document.activeElement.closest('li')?.dataset.id;
    const prevSelStart = getCaretIndex(document.activeElement);
    const prevSelIsTitle = document.activeElement?.classList?.contains('task-title');

    
    listEl.innerHTML = '';

    const items = filteredTasks();
    for (const task of items) {
      const el = createTaskElement(task);
      listEl.appendChild(el);
    }


    for (const btn of filterButtons) {
      const isActive = btn.dataset.filter === currentFilter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    }

  
    const left = tasks.filter(t => !t.completed).length;
    itemsLeftEl.textContent = `${pluralize(left, 'item')} left`;


    if (prevFocusId && prevSelIsTitle) {
      const el = listEl.querySelector(`li[data-id="${prevFocusId}"] .task-title`);
      if (el) setCaretIndex(el, prevSelStart);
    }
  }

  function addTaskFromInput() {
    const title = (inputEl.value || '').trim();
    if (!title) return;
    const maxOrder = tasks.reduce((max, t) => Math.max(max, typeof t.order === 'number' ? t.order : 0), 0);
    const task = {
      id: uid(),
      title,
      completed: false,
      createdAt: Date.now(),
      order: maxOrder + 1,
    };
    tasks.push(task);
    saveTasks();
    inputEl.value = '';
    inputEl.focus();
    render();


    const li = listEl.querySelector(`li[data-id="${task.id}"]`);
    if (li) {
      li.classList.add('enter');
      setTimeout(() => li.classList.remove('enter'), 250);
    }
  }

  function toggleTask(id, completed) {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    t.completed = completed;
    saveTasks();
    render();
  }

  function deleteTask(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks.splice(idx, 1);
    saveTasks();
    render();
  }

  function startEditing(li) {
    const titleEl = li.querySelector('.task-title');
    if (!titleEl) return;
    li.classList.add('editing');
    titleEl.setAttribute('contenteditable', 'true');
    titleEl.setAttribute('aria-readonly', 'false');
  
    requestAnimationFrame(() => {
      titleEl.focus();
      selectAllText(titleEl);
    });
  }

  function commitEditing(li) {
    const id = li.dataset.id;
    const titleEl = li.querySelector('.task-title');
    if (!titleEl) return;
    const newText = titleEl.textContent.trim();
    const oldTask = tasks.find(t => t.id === id);
    if (!oldTask) return;

    if (!newText) {
      deleteTask(id);
      return;
    }
    if (newText !== oldTask.title) {
      oldTask.title = newText;
      saveTasks();
    }
    stopEditing(li);
    render();

    const titleElNew = listEl.querySelector(`li[data-id="${id}"] .task-title`);
    if (titleElNew) titleElNew.focus();
  }

  function cancelEditing(li) {
    const id = li.dataset.id;
    const titleEl = li.querySelector('.task-title');
    const task = tasks.find(t => t.id === id);
    if (!titleEl || !task) return;
    titleEl.textContent = task.title;
    stopEditing(li);
  }

  function stopEditing(li) {
    const titleEl = li.querySelector('.task-title');
    if (titleEl) {
      titleEl.removeAttribute('contenteditable');
      titleEl.setAttribute('aria-readonly', 'true');
    }
    li.classList.remove('editing');
  }

  function setFilter(nextFilter) {
    currentFilter = nextFilter;
    saveFilter(nextFilter);
    render();
  }

  function toggleAll() {
    const anyActive = tasks.some(t => !t.completed);
    for (const t of tasks) t.completed = anyActive;
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
  }

  function initDragAndDrop() {
    listEl.addEventListener('dragstart', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      li.classList.add('dragging');
      li.setAttribute('aria-grabbed', 'true');
      e.dataTransfer.effectAllowed = 'move';
      try {
        e.dataTransfer.setData('text/plain', li.dataset.id);
      } catch {}
    });

    listEl.addEventListener('dragend', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      li.classList.remove('dragging');
      li.removeAttribute('aria-grabbed');
    });

    listEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterEl = getDragAfterElement(listEl, e.clientY);
      const dragging = listEl.querySelector('.dragging');
      if (!dragging) return;
      if (afterEl == null) {
        listEl.appendChild(dragging);
      } else {
        listEl.insertBefore(dragging, afterEl);
      }
    });

    listEl.addEventListener('drop', (e) => {
      e.preventDefault();
      persistOrderFromDOM();
    });
  }

  function getDragAfterElement(container, y) {
    const els = [...container.querySelectorAll('li:not(.dragging)')];
    return els.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
  }

  function persistOrderFromDOM() {
    const idsInOrder = $$('#todo-list li').map(li => li.dataset.id);
    const orderMap = new Map(idsInOrder.map((id, idx) => [id, idx]));
    for (const t of tasks) {
      if (orderMap.has(t.id)) {
        t.order = orderMap.get(t.id);
      }
    }
    saveTasks();
  }

  function selectAllText(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function getCaretIndex(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.startContainer)) return null;
    const preRange = range.cloneRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  }

  function setCaretIndex(el, index) {
    if (!el || typeof index !== 'number') return;
    const text = el.textContent || '';
    const clamped = clamp(index, 0, text.length);
    el.focus();
    const sel = window.getSelection();
    const range = document.createRange();

    let remaining = clamped;
    function place(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const len = node.nodeValue.length;
        if (remaining <= len) {
          range.setStart(node, remaining);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          return true;
        } else {
          remaining -= len;
        }
      } else {
        for (const child of node.childNodes) {
          if (place(child)) return true;
        }
      }
      return false;
    }
    if (!place(el)) {
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }


  function bindEvents() {

    addBtn.addEventListener('click', addTaskFromInput);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addTaskFromInput();
      }
    });

    for (const btn of filterButtons) {
      btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
      });
    }

    // Search
    const onSearch = debounce((e) => {
      searchQuery = e.target.value || '';
      render();
    }, 120);
    searchInput.addEventListener('input', onSearch);

    // Toggle all, clear completed
    toggleAllBtn.addEventListener('click', toggleAll);
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Theme
    themeToggleBtn.addEventListener('click', toggleTheme);

    // List delegated handlers
    listEl.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const id = li.dataset.id;

      // Checkbox toggle
      if (e.target.matches('input.toggle')) {
        toggleTask(id, e.target.checked);
        return;
      }

      // Delete
      if (e.target.closest('.delete-btn')) {
        deleteTask(id);
        return;
      }

      // Edit
      if (e.target.closest('.edit-btn')) {
        if (!li.classList.contains('editing')) startEditing(li);
        return;
      }
    });

    // Double-click to edit
    listEl.addEventListener('dblclick', (e) => {
      const titleEl = e.target.closest('.task-title');
      if (!titleEl) return;
      const li = titleEl.closest('li');
      if (!li) return;
      if (!li.classList.contains('editing')) startEditing(li);
    });

    // Contenteditable commit/cancel
    listEl.addEventListener('keydown', (e) => {
      const titleEl = e.target.closest('.task-title');
      if (!titleEl) return;
      const li = titleEl.closest('li');
      if (!li || !li.classList.contains('editing')) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        commitEditing(li);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEditing(li);
      }
    });

    listEl.addEventListener('blur', (e) => {
      const titleEl = e.target.closest('.task-title');
      if (!titleEl) return;
      const li = titleEl.closest('li');
      if (!li || !li.classList.contains('editing')) return;
      // Commit on blur
      commitEditing(li);
    }, true);

    // Prevent rich text paste
    listEl.addEventListener('paste', (e) => {
      const titleEl = e.target.closest('.task-title[contenteditable="true"]');
      if (!titleEl) return;
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });

    // Keyboard toggle via title space/enter
    listEl.addEventListener('keydown', (e) => {
      const titleEl = e.target.closest('.task-title');
      if (!titleEl) return;
      const li = titleEl.closest('li');
      if (!li || li.classList.contains('editing')) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const checkbox = li.querySelector('input.toggle');
        checkbox.checked = !checkbox.checked;
        toggleTask(li.dataset.id, checkbox.checked);
      }
    });
  }

  // ---------- Init ----------
  function init() {
    initTheme();
    tasks = loadTasks();
    // Apply persisted filter state to UI
    for (const btn of filterButtons) {
      const isActive = btn.dataset.filter === currentFilter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    }
    bindEvents();
    initDragAndDrop();
    render();
  }

  // Run
  document.addEventListener('DOMContentLoaded', init);
})();