// script.js
const API_URL = "http://localhost:8000";
let token = localStorage.getItem("token");

//==================== UI HELPERS ====================

function showApp() {
  document.getElementById("loginPanel").style.display = "none";
  document.getElementById("signupPanel").style.display = "none";
  document.getElementById("appUI").style.display = "grid";
}

function showLogin() {
  document.getElementById("appUI").style.display = "none";
  document.getElementById("signupPanel").style.display = "none";
  document.getElementById("loginPanel").style.display = "block";
}

if (token) showApp();
else showLogin();

//==================== AUTH FUNCTIONS ====================

// LOGIN
document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
  });

  if (res.ok) {
    const data = await res.json();
    token = data.access_token;
    localStorage.setItem("token", token);
    showApp();
    loadEmployees();
    loadTasks();
    alert("Login successful!");
  } else {
    alert("Invalid username or password");
  }
};

// SIGNUP
document.getElementById("signupForm").onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUser").value.trim();
  const password = document.getElementById("signupPass").value.trim();

  const res = await fetch(`${API_URL}/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    alert("Signup successful! Now login.");
    showLogin();
  } else {
    const txt = await res.text();
    alert("Signup failed. " + txt);
  }
};

// Toggle login/signup
document.getElementById("signupToggle").onclick = () => {
  document.getElementById("loginPanel").style.display = "none";
  document.getElementById("signupPanel").style.display = "block";
};

document.getElementById("loginToggle").onclick = () => {
  document.getElementById("signupPanel").style.display = "none";
  document.getElementById("loginPanel").style.display = "block";
};

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  token = null;
  showLogin();
}
window.logout = logout;

//==================== AUTH FETCH WRAPPER ====================

async function fetchWithAuth(endpoint, options = {}) {
  if (!token) return alert("Please log in first");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`${API_URL}${endpoint}`, options);

  if (res.status === 401) {
    logout();
    alert("Session expired. Please log in again.");
  }

  return res;
}

//==================== EMPLOYEES ====================

document.getElementById("employeeForm").onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value.trim();

  if (!name || !email) return alert("Name and email are required");

  const res = await fetchWithAuth(`/employees/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role }),
  });

  if (res && res.ok) {
    alert("Employee added!");
    document.getElementById("employeeForm").reset();
    loadEmployees();
  } else {
    alert("Failed to add employee");
  }
};

async function loadEmployees() {
  const res = await fetchWithAuth(`/employees/`);
  if (!res || !res.ok) return;
  const employees = await res.json();
  const list = document.getElementById("employeeList");
  const search = document.getElementById("searchEmployee").value.toLowerCase();
  list.innerHTML = "";

  employees
    .filter(emp => emp.name.toLowerCase().includes(search))
    .forEach(emp => {
      const li = document.createElement("li");
      li.className = "p-3 bg-gray-50 rounded border";
      li.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <strong>${emp.name}</strong> <br>
            <span class="text-gray-600 text-sm">${emp.email}</span><br>
            <span class="text-gray-600 text-sm">Role: ${emp.role || "-"}</span>
          </div>
          <div class="text-sm text-right space-y-1">
            <div><span class="text-blue-600 font-bold">${emp.tasks ? emp.tasks.length : 0}</span> Tasks</div>
            <div class="mt-2">
              <button data-id="${emp.id}" class="edit-emp px-2 py-1 rounded border text-sm mr-2">Edit</button>
              <button data-id="${emp.id}" class="del-emp px-2 py-1 rounded border text-sm text-red-600">Delete</button>
            </div>
          </div>
        </div>
      `;
      list.appendChild(li);
    });

  // attach handlers
  document.querySelectorAll(".edit-emp").forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      // fetch current data
      const r = await fetchWithAuth(`/employees/${id}`);
      if (!r || !r.ok) return alert("Failed to fetch employee");
      const emp = await r.json();
      const name = prompt("Name", emp.name);
      if (name === null) return; // cancelled
      const email = prompt("Email", emp.email);
      if (email === null) return;
      const role = prompt("Role", emp.role || "");
      if (role === null) return;

      const upd = await fetchWithAuth(`/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      if (upd && upd.ok) {
        alert("Employee updated");
        loadEmployees();
      } else {
        alert("Failed to update employee");
      }
    };
  });

  document.querySelectorAll(".del-emp").forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Delete this employee? This will also remove their tasks.")) return;
      const r = await fetchWithAuth(`/employees/${id}`, { method: "DELETE" });
      if (r && r.ok) {
        alert("Deleted");
        loadEmployees();
        loadTasks(); // refresh tasks because of cascade delete
      } else {
        alert("Failed to delete");
      }
    };
  });
}

document.getElementById("searchEmployee").oninput = loadEmployees;

//==================== TASKS ====================

document.getElementById("taskForm").onsubmit = async (e) => {
  e.preventDefault();

  const task = {
    title: document.getElementById("taskTitle").value.trim(),
    description: document.getElementById("taskDesc").value.trim(),
    due_date: document.getElementById("taskDue").value || null,
    employee_id: Number(document.getElementById("taskEmployee").value) || null,
    status: document.getElementById("taskStatus").value,
  };

  if (!task.title) return alert("Task title required");

  const res = await fetchWithAuth(`/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (res && res.ok) {
    alert("Task added!");
    document.getElementById("taskForm").reset();
    loadTasks();
  } else {
    alert("Failed to add task");
  }
};

async function loadTasks() {
  const res = await fetchWithAuth(`/tasks/`);
  if (!res || !res.ok) return;
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  const search = document.getElementById("searchTask").value.toLowerCase();
  list.innerHTML = "";

  const badge = (status) => {
    const colors = {
      pending: "bg-yellow-200 text-yellow-800",
      in_progress: "bg-blue-200 text-blue-800",
      done: "bg-green-200 text-green-800",
    };
    return `<span class="px-2 py-1 rounded text-xs font-bold ${colors[status] || "bg-gray-200 text-gray-800"}">${status}</span>`;
  };

  tasks
    .filter(t => t.title.toLowerCase().includes(search))
    .forEach(t => {
      const li = document.createElement("li");
      li.className = "p-3 bg-gray-50 rounded border";
      li.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <strong>${t.title}</strong> ${badge(t.status)}<br>
            <span class="text-gray-600 text-sm">${t.description || ""}</span><br>
            <span class="text-gray-600 text-sm">Due: ${t.due_date || "-"}</span><br>
            <span class="text-gray-600 text-sm">Assigned: ${t.employee_id || "-"}</span>
          </div>
          <div class="text-sm text-right">
            <button data-id="${t.id}" class="edit-task px-2 py-1 rounded border text-sm mr-2">Edit</button>
            <button data-id="${t.id}" class="del-task px-2 py-1 rounded border text-sm text-red-600">Delete</button>
          </div>
        </div>
      `;
      list.appendChild(li);
    });

  // attach handlers
  document.querySelectorAll(".edit-task").forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      const r = await fetchWithAuth(`/tasks/${id}`);
      if (!r || !r.ok) return alert("Failed to fetch task");
      const t = await r.json();
      const title = prompt("Title", t.title);
      if (title === null) return;
      const description = prompt("Description", t.description || "");
      if (description === null) return;
      const due_date = prompt("Due date (YYYY-MM-DD)", t.due_date || "");
      if (due_date === null) return;
      const employee_id = prompt("Employee ID (leave blank for none)", t.employee_id || "");
      if (employee_id === null) return;
      const status = prompt("Status (pending, in_progress, done)", t.status || "pending");
      if (status === null) return;

      const payload = {
        title,
        description,
        due_date: due_date || null,
        employee_id: employee_id ? Number(employee_id) : null,
        status
      };

      const upd = await fetchWithAuth(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (upd && upd.ok) {
        alert("Task updated");
        loadTasks();
        loadEmployees(); // refresh counts / assignments
      } else {
        alert("Failed to update task");
      }
    };
  });

  document.querySelectorAll(".del-task").forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Delete this task?")) return;
      const r = await fetchWithAuth(`/tasks/${id}`, { method: "DELETE" });
      if (r && r.ok) {
        alert("Deleted");
        loadTasks();
        loadEmployees();
      } else {
        alert("Failed to delete");
      }
    };
  });
}

document.getElementById("searchTask").oninput = loadTasks;

// Reload data if logged in
if (token) {
  loadEmployees();
  loadTasks();
}
