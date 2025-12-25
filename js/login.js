import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    doc,
    setDoc
} from "./firebase.js";

console.log("Firebase login script loaded");

// ------------------------
// SIGNUP
// ------------------------
window.saveSignupData = function (event) {
    event.preventDefault();
    console.log("Signup function called");

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    console.log("Signup Name:", name);
    console.log("Signup Email:", email);

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            console.log("Firebase signup success");
            const user = userCredential.user;

            // Save user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email
            });

            console.log("User saved to Firestore");

            alert("Signup Successful!");
            window.location.href = "homescreen.html";
        })
        .catch((error) => {
            console.error("Signup Error:", error.message);
            alert("Error: " + error.message);
        });
};

// ------------------------
// LOGIN
// ------------------------
window.saveLoginData = function (event) {
    event.preventDefault();
    console.log("Login function called");

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("Firebase login success");
            alert("Login Successful!");
            window.location.href = "homescreen.html";
        })
        .catch((error) => {
            console.error("Login Error:", error.message);
            alert("Error: " + error.message);
        });
};
