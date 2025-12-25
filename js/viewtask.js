// js/viewtask.js
// js/viewtask.js (Firestore Version)
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");

  // Modal elements
  const modal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const editTitle = document.getElementById("edit-title");
  const editLevel = document.getElementById("edit-level");
  const editDate = document.getElementById("edit-date");
  const editDesc = document.getElementById("edit-desc");
  const editCancel = document.getElementById("edit-cancel");

  let tasks = []; // will come from Firestore

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => (
      {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]
    ));
  }

  // 1️⃣ Load tasks from Firestore
  async function loadTasks() {
    tasks = [];
    const snapshot = await getDocs(collection(db, "tasks"));

    snapshot.forEach(docSnap => {
      tasks.push({
        id: docSnap.id, // FIRESTORE ID
        ...docSnap.data()
      });
    });

    render();
  }

  // 2️⃣ Render UI
  function render() {
    container.innerHTML = "";

    if (!tasks.length) {
      container.innerHTML = "<p>No tasks found.</p>";
      return;
    }

    tasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = "task-container";
      div.innerHTML = `
        <h2>${esc(task.title)}</h2>
        <h5>${esc(task.level)}</h5>
        <p>${esc(task.date)}</p>
        <p>${esc(task.description)}</p>
        <div class="actions">
          <button class="edit-btn" data-id="${task.id}" data-index="${index}">Edit</button>
          <button class="delete-btn" data-id="${task.id}" data-index="${index}">Delete</button>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // 3️⃣ Delete or Edit buttons (event delegation)
  container.addEventListener("click", async (e) => {
    const el = e.target;

    // DELETE task
    if (el.matches(".delete-btn")) {
      const id = el.dataset.id;
      await deleteDoc(doc(db, "tasks", id));

      await loadTasks();
    }

    // OPEN EDIT MODAL
    if (el.matches(".edit-btn")) {
      const task = tasks[el.dataset.index];

      // Pre-fill modal
      editTitle.value = task.title;
      editLevel.value = task.level;
      editDate.value = /^\d{4}-\d{2}-\d{2}$/.test(task.date) ? task.date : "";
      editDesc.value = task.description;

      // store the doc ID
      modal.dataset.id = task.id;
      modal.hidden = false;
    }
  });

  // 4️⃣ Cancel edit
  editCancel.addEventListener("click", () => {
    modal.hidden = true;
  });

  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) modal.hidden = true;
  });

  // 5️⃣ Save edited task to Firestore
  editForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const id = modal.dataset.id;

    await updateDoc(doc(db, "tasks", id), {
      title: editTitle.value.trim(),
      level: editLevel.value.trim(),
      date: editDate.value,
      description: editDesc.value.trim()
    });

    modal.hidden = true;
    await loadTasks();
  });

  // Load initial tasks
  loadTasks();
});

// Back Button
document.querySelector(".arrow button").onclick = () => {
  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.location.href = "homescreen.html";
  }
};
