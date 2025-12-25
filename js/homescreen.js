// Import Firestore
// ---------------------------
// IMPORT FIREBASE
// ---------------------------
import { db, auth } from "./firebase.js";

import { 
    collection, 
    addDoc, 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ---------------------------
// LOAD PROFILE IMAGE IN NAVBAR
// ---------------------------
const homeProfilePic = document.getElementById("profile-pic");

async function loadHomeProfileImg() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();

        if (data.profileImg) {
            homeProfilePic.src = data.profileImg;  // Load saved image
        }
    }
}

// Wait for Firebase Auth to detect logged-in user
auth.onAuthStateChanged(() => {
    loadHomeProfileImg();
});


// ---------------------------
// POPUP FOR ADD TASK
// ---------------------------
var popupoverlay = document.querySelector(".popup-overlay");
var popupbox = document.querySelector(".popup-box");
var addpopbutton = document.querySelector(".addnav-btn");

addpopbutton.addEventListener("click", function () {
    popupoverlay.style.display = "block";
    popupbox.style.display = "block";
});

var cancelbutton = document.getElementById("cancel-popup");
cancelbutton.addEventListener("click", function (event) {
    event.preventDefault();
    popupoverlay.style.display = "none";
    popupbox.style.display = "none";
});


// ---------------------------
// FORM INPUTS
// ---------------------------
var addtask = document.getElementById("add-task");
var tasktitleinput = document.getElementById("task-title-input");
var tasklevelinput = document.getElementById("task-level-input");
var taskdateinput = document.getElementById("task-date-input");
var taskdescriptioninput = document.getElementById("task-description-input");


// ---------------------------
// ADD TASK TO FIRESTORE
// ---------------------------
addtask.addEventListener("click", async function(event) {
    event.preventDefault();

    try {
        await addDoc(collection(db, "tasks"), {
            title: tasktitleinput.value,
            level: tasklevelinput.value,
            date: taskdateinput.value,
            description: taskdescriptioninput.value,
            createdAt: Date.now()
        });

        alert("Task added successfully!");

        popupbox.style.display = "none";
        popupoverlay.style.display = "none";
    } 
    catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task.");
    }
});
