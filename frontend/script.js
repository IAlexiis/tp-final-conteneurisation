const API_URL = '/api/tasks';

const form = document.getElementById('taskForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('taskTitle');
    const title = input.value.trim();
    if (!title) return;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    if (res.ok) {
      input.value = '';
      showToast('Tâche ajoutée avec succès !');
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');

if (taskList && taskCount) {
  loadTasks();
}

async function loadTasks() {
  if (!taskList) return;

  const res = await fetch(API_URL);
  const tasks = await res.json();

  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState && emptyState.classList.remove('hidden');
    taskCount.textContent = '';
    return;
  }

  emptyState && emptyState.classList.add('hidden');

  const doneCount = tasks.filter(t => t.done).length;
  taskCount.textContent = `${doneCount}/${tasks.length} terminées`;

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');

    const checkLabel = document.createElement('label');
    checkLabel.className = 'task-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;

    const checkmark = document.createElement('span');
    checkmark.className = 'checkmark';

    checkLabel.appendChild(checkbox);
    checkLabel.appendChild(checkmark);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = task.title;
    titleInput.className = 'task-title';

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-icon btn-save';
    saveBtn.title = 'Enregistrer';
    saveBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-icon btn-delete';
    deleteBtn.title = 'Supprimer';
    deleteBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';

    checkbox.addEventListener('change', async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleInput.value, done: checkbox.checked })
      });
      loadTasks();
    });

    saveBtn.addEventListener('click', async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleInput.value, done: checkbox.checked })
      });
      loadTasks();
    });

    deleteBtn.addEventListener('click', async () => {
      await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
      loadTasks();
    });

    actions.appendChild(saveBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkLabel);
    li.appendChild(titleInput);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}
