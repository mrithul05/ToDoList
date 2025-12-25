// firebase.js

// ----------------------------
// IMPORT FIREBASE MODULES
// ----------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateEmail,
    updatePassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { 
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ----------------------------
// FIREBASE CONFIG
// ----------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBOeVlPVxpy5OjwP_TgCQItrqypnf11n_s",
    authDomain: "todolist-df2f9.firebaseapp.com",
    projectId: "todolist-df2f9",
    storageBucket: "todolist-df2f9.firebasestorage.app",
    messagingSenderId: "405645010146",
    appId: "1:405645010146:web:1d2ec8b72a3560043d2abb"
};

// ----------------------------
// INITIALIZE FIREBASE
// ----------------------------
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ----------------------------
// EXPORT EVERYTHING NEEDED
// ----------------------------
export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateEmail,
    updatePassword,
    doc,
    setDoc,
    getDoc,
    updateDoc
};
