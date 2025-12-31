// js/calendar.js
import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

const currentYear = new Date().getFullYear();
const calendarContainer = document.getElementById("calendar-container");


// ----------- FIREBASE HELPERS -------------
async function loadTask(date) {
  const ref = doc(db, "calendarTasks", date);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().task : null;
}

async function saveTask(date, task) {
  await setDoc(doc(db, "calendarTasks", date), { task });
}

async function deleteTask(date) {
  await deleteDoc(doc(db, "calendarTasks", date));
}



// ----------- BUILD CALENDAR -------------
async function generateCalendar() {
  for (let index = 0; index < months.length; index++) {
    const month = months[index];

    const monthDiv = document.createElement("div");
    monthDiv.classList.add("month");

    const monthHeader = document.createElement("h2");
    monthHeader.textContent = `${month} ${currentYear}`;
    monthDiv.appendChild(monthHeader);

    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar");

    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
      const header = document.createElement("div");
      header.classList.add("header");
      header.textContent = day;
      calendarGrid.appendChild(header);
    });

    const firstDay = new Date(currentYear, index, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("day");
      calendarGrid.appendChild(emptyDiv);
    }

    const totalDays = daysInMonth(index + 1, currentYear);
    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");

      const dateKey = `${month}-${day}-${currentYear}`;
      const button = document.createElement("button");
      button.classList.add("day-button");
      button.textContent = day;

      // Load stored task from Firestore
      loadTask(dateKey).then(storedTask => {
        if (storedTask) {
          button.classList.add("has-task");
        }
      });

      button.onclick = () => addTask(dateKey, button);

      dayDiv.appendChild(button);
      calendarGrid.appendChild(dayDiv);
    }

    monthDiv.appendChild(calendarGrid);
    calendarContainer.appendChild(monthDiv);
  }
}



// ----------- MODAL HANDLING -------------
const taskModal = document.getElementById("task-modal");
const confirmModal = document.getElementById("confirm-modal");
const alertModal = document.getElementById("alert-modal");

const taskInput = document.getElementById("task-input");
const taskModalTitle = document.getElementById("task-modal-title");

const alertMessage = document.getElementById("alert-message");
const confirmMessage = document.getElementById("confirm-message");

const saveTaskBtn = document.getElementById("save-task-btn");
const openDeleteBtn = document.getElementById("open-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

const closeTaskModal = document.querySelector("#task-modal .close-modal");
const closeConfirmModal = document.querySelector("#confirm-modal .close-modal");
const closeAlertModal = document.querySelector("#alert-modal .close-modal");
const closeAlertBtn = document.getElementById("close-alert-btn");

let currentTaskDate = null;
let currentTaskButton = null;


function openConfirmModal(date, button) {
  currentTaskDate = date;
  currentTaskButton = button;
  confirmMessage.textContent = `Delete the task for ${date}?`;
  confirmModal.style.display = "block";
}

function openAlertModal(msg) {
  alertMessage.textContent = msg;
  alertModal.style.display = "block";
}

function closeModal(modal) {
  modal.style.display = "none";
}

closeTaskModal.onclick = () => closeModal(taskModal);
closeConfirmModal.onclick = () => closeModal(confirmModal);
closeAlertModal.onclick = () => closeModal(alertModal);
closeAlertBtn.onclick = () => closeModal(alertModal);
cancelDeleteBtn.onclick = () => closeModal(confirmModal);


// ----- SAVE TASK -----
saveTaskBtn.onclick = async () => {
  const task = taskInput.value.trim();
  if (!task) {
    openAlertModal("Task cannot be empty");
    return;
  }
    await saveTask(currentTaskDate, task); // Firebase save
    const dayNumber=currentTaskDate.split("-")[1];
    currentTaskButton.textContent=dayNumber;
    currentTaskButton.classList.add("has-task");
    closeModal(taskModal);
};


// ----- DELETE TASK -----
openDeleteBtn.onclick = () => {
  closeModal(taskModal);
  confirmModal.style.display = "block";
};


confirmDeleteBtn.onclick = async () => {
  await deleteTask(currentTaskDate); // Firebase delete
  
  const dayNumber=currentTaskDate.split("-")[1];
  currentTaskButton.textContent=dayNumber;
  currentTaskButton.classList.remove("has-task");
  closeModal(confirmModal);
  openAlertModal(`Task for ${currentTaskDate} deleted.`);
};

cancelDeleteBtn.onclick = () => {
  closeModal(confirmModal);
  taskModal.style.display = "block";
};


// ----- Add/Delete Dispatcher -----
async function addTask(date, button) {
  currentTaskDate = date;
  currentTaskButton = button;
  const existingTask = await loadTask(date);
  taskModalTitle.textContent = `Task for ${date}`;
  taskInput.value = existingTask || "";
  openDeleteBtn.style.display = existingTask ? "inline-block" : "none";
  taskModal.style.display = "block";
}


// back button
document.querySelector(" .calendar-header  button").onclick = () => {
  window.location.href = document.referrer || "homescreen.html";
};


// Generate calendar after DOM loads
generateCalendar();
