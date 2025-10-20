import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClRE2w0JeSj81gkccPC1au3hG8lQYbLzw",
  authDomain: "dashboard-png.firebaseapp.com",
  projectId: "dashboard-png",
  storageBucket: "dashboard-png.firebasestorage.app",
  messagingSenderId: "121187805643",
  appId: "1:121187805643:web:6c67dd587abbe09f782e4e",
  measurementId: "G-N5MV2N5X33"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

// toggle form
showRegister.addEventListener("click", () => {
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
});
showLogin.addEventListener("click", () => {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
});

// register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      email,
      role: "staff",
      createdAt: serverTimestamp(),
    });
    alert("Registrasi berhasil!");
    registerForm.reset();
    showLogin.click();
  } catch (err) {
    alert(err.message);
  }
});

// login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

// auto redirect jika sudah login
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = "dashboard.html";
});
