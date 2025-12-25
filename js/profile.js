// ...existing code...
import {
  auth,
  db,
  doc,
  getDoc,
  updateDoc,
  updateEmail,
  updatePassword,
  onAuthStateChanged
} from "./firebase.js";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // ✅ If Firebase email is verified, sync it to Firestore + UI
  if (user.emailVerified) {
    await updateDoc(doc(db, "users", user.uid), {
      email: user.email
    });

    profileEmail.textContent = user.email;
  }
});


onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (snap.exists()) {
    const data = snap.data();

    if (data.profileImg && profilePicture) {
      profilePicture.src = data.profileImg + "?t=" + Date.now();
    }
  }
});



// Firebase Storage imports
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// --------------------------------------
// SELECT DOM ELEMENTS
// --------------------------------------
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePicture = document.getElementById("profile-picture");

// NAME POPUP ELEMENTS
const canameOverlay = document.querySelector(".caname-overlay");
const canameBox = document.querySelector(".caname-box");
const canameButton = document.querySelector(".twocaname-btn");
const closeNameButton = document.querySelector(".close");
const saveNameButton = document.getElementById("save-name-btn");
const currentNameSpan = document.getElementById("current-name");
const newNameInput = document.getElementById("new-name");

// EMAIL POPUP
const camailOverlay = document.querySelector(".camail-overlay");
const camailBox = document.querySelector(".camail-box");
const camailButton = document.querySelector(".twocamail-btn");
const closeMailButton = document.querySelector(".mailclose");
const saveMailButton = document.getElementById("save-mail-btn");
const currentMailInput = document.getElementById("current-mail");
const newMailInput = document.getElementById("new-mail");
const confirmMailInput = document.getElementById("cnew-mail");

// PASSWORD POPUP ELEMENTS
const capassOverlay = document.querySelector(".capass-overlay");
const capassBox = document.querySelector(".capass-box");
const capassButton = document.querySelector(".twocapass-btn");
const closePassButton = document.querySelector(".passclose");
const savePassButton = document.getElementById("save-pass-btn");
const currentPassInput = document.getElementById("current-mail-pass");
const newPassInput = document.getElementById("new-pass");
const cnewPassInput = document.getElementById("cnew-pass");

// IMAGE POPUP
const caimgOverlay = document.querySelector(".caimg-overlay");
const caimgBox = document.querySelector(".caimg-box");
const caimgButton = document.querySelector(".imgtwo");
const closeImgButton = document.querySelector(".imgclose");
const saveImgButton = document.getElementById("save-img-btn");
const newImgInput = document.getElementById("new-img");

// --------------------------------------
// LOAD USER PROFILE
// --------------------------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    profileName.textContent = data.name || "Not provided";
    profileEmail.textContent = data.email || "Not provided";

    // Show profile image:
    // - If stored value is a data URL (starts with "data:") use as-is.
    // - If stored value is an http(s) URL, append cache-busting query param.
    if (data.profileImg) {
      if (typeof data.profileImg === "string" && data.profileImg.startsWith("data:")) {
        profilePicture.src = data.profileImg;
      } else {
        profilePicture.src = data.profileImg + "?t=" + new Date().getTime();
      }
    } else {
      profilePicture.src = "assests/Deafult PFP .jpeg";
    }
  }
});

// --------------------------------------
// CHANGE NAME
// --------------------------------------
canameButton.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  currentNameSpan.textContent = snap.exists() ? snap.data().name : "Not provided";

  canameOverlay.style.display = "block";
  canameBox.style.display = "block";
});

closeNameButton.addEventListener("click", () => {
  canameOverlay.style.display = "none";
  canameBox.style.display = "none";
});

saveNameButton.addEventListener("click", async () => {
  const newName = newNameInput.value.trim();
  if (!newName) return alert("Enter a valid name");

  await updateDoc(doc(db, "users", auth.currentUser.uid), { name: newName });
  profileName.textContent = newName;

  alert("Name updated!");
  canameOverlay.style.display = "none";
  canameBox.style.display = "none";
});

// --------------------------------------
// CHANGE EMAIL
// --------------------------------------

// ...existing code...
// --------------------------------------
// CHANGE EMAIL
// --------------------------------------

camailButton.addEventListener("click", () => {
  camailOverlay.style.display = "block";
  camailBox.style.display = "block";
});

closeMailButton.addEventListener("click", () => {
  camailOverlay.style.display = "none";
  camailBox.style.display = "none";
});

saveMailButton.addEventListener("click", async () => {
  const currentPass = document.getElementById("current-pass").value.trim();
  const newEmail = document.getElementById("new-mail").value.trim();
  const confirmEmail = document.getElementById("cnew-mail").value.trim();

  if (!currentPass || !newEmail || !confirmEmail) {
    alert("Fill all fields");
    return;
  }

  if (newEmail !== confirmEmail) {
    alert("Emails do not match");
    return;
  }

  const user = auth.currentUser;

  try {
    // 🔐 Step 1: Reauthenticate
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPass
    );
    await reauthenticateWithCredential(user, credential);

    // 📩 Step 2: Verify new email
    await verifyBeforeUpdateEmail(user, newEmail);

    alert(
      "Verification email sent!\n\n" +
      "Please open your new email and verify to complete the change."
    );

    camailOverlay.style.display = "none";
    camailBox.style.display = "none";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

// --------------------------------------
// CHANGE PASSWORD (with REAUTH)
// --------------------------------------
capassButton.addEventListener("click", () => {
  capassOverlay.style.display = "block";
  capassBox.style.display = "block";
});

closePassButton.addEventListener("click", () => {
  capassOverlay.style.display = "none";
  capassBox.style.display = "none";
});

savePassButton.addEventListener("click", async () => {
  const currentPass = currentPassInput.value.trim();
  const newPass = newPassInput.value.trim();
  const confirmPass = cnewPassInput.value.trim();

  if (!currentPass || !newPass || !confirmPass)
    return alert("Fill all fields");

  if (newPass !== confirmPass)
    return alert("Passwords do not match");

  const user = auth.currentUser;

  try {
    // login again (Firebase requirement)
    const cred = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, cred);

    // update password
    await updatePassword(user, newPass);

    alert("Password updated successfully!");
    capassOverlay.style.display = "none";
    capassBox.style.display = "none";
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// ---------------------------
// CHANGE PROFILE IMAGE
// --------------------------


caimgButton.addEventListener("click", () => { 
  caimgOverlay.style.display = "block"; 
  caimgBox.style.display = "block"; 
  newImgInput.value = ""; 
  // Reset file input
 }); 
closeImgButton.addEventListener("click", () => { 
  caimgOverlay.style.display = "none"; 
  caimgBox.style.display = "none"; }
);


saveImgButton.addEventListener("click", async () => {
  const file = newImgInput.files[0];

  if (!file) {
    alert("Please select an image");
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image too large (max 5MB)");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not authenticated");
    return;
  }

  saveImgButton.disabled = true;
  saveImgButton.textContent = "Uploading...";

  try {
    const storage = getStorage();
    const imgRef = storageRef(
      storage,
      `profileImages/${user.uid}`
    );

    // upload
    await uploadBytes(imgRef, file);

    // get URL
    const downloadURL = await getDownloadURL(imgRef);

    // save to Firestore
    await updateDoc(doc(db, "users", user.uid), {
      profileImg: downloadURL
    });

    // ✅ update profile page immediately
    if (profilePicture) {
      profilePicture.src = downloadURL + "?t=" + Date.now();
    }

    // ✅ update homescreen image if exists
    const homeImg = document.getElementById("homeProfileImg");
    if (homeImg) {
      homeImg.src = downloadURL + "?t=" + Date.now();
    }

    caimgOverlay.style.display = "none";
    caimgBox.style.display = "none";

    alert("Profile image updated successfully");

  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    saveImgButton.disabled = false;
    saveImgButton.textContent = "Save";
  }
});


