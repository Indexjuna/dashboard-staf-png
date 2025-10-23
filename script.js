// ========== Inisialisasi Firebase (gunakan CDN, bukan module) ==========
const firebaseConfig = {
  apiKey: "AIzaSyClRE2w0JeSj81gkccPC1au3hG8lQYbLzw",
  authDomain: "dashboard-png.firebaseapp.com",
  projectId: "dashboard-png",
  storageBucket: "dashboard-png.firebasestorage.app",
  messagingSenderId: "121187805643",
  appId: "1:121187805643:web:6c67dd587abbe09f782e4e",
  measurementId: "G-N5MV2N5X33"
};

// Pastikan Firebase SDK sudah di-load di index.html sebelum script ini:
// <script src="https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/12.4.0/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore-compat.js"></script>
// <script src="script.js"></script>

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ========== Bagian LOGIN / REGISTER / LOGOUT ==========
function initializeAuth() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";
  }

  function showSuccess(msg) {
    successMessage.textContent = msg;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
  }

  // ===== LOGIN =====
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value.trim();

      // Tetap izinkan login admin lokal
      if (email === "admin@company.com" && password === "admin123") {
        const adminUser = {
          username: "Administrator",
          email: "admin@company.com",
          role: "Administrator",
          avatar: "https://ui-avatars.com/api/?name=Admin&background=0366d6&color=fff",
          canEdit: true
        };
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        showSuccess("Login sebagai Administrator...");
        return setTimeout(() => (window.location.href = "dashboard.html"), 1200);
      }

      try {
        const userCred = await auth.signInWithEmailAndPassword(email, password);
        const user = userCred.user;
        const docSnap = await db.collection("users").doc(user.uid).get();

        if (!docSnap.exists) {
          showError("Data user tidak ditemukan di Firestore.");
          return;
        }

        const userData = docSnap.data();
        localStorage.setItem("currentUser", JSON.stringify({
          username: userData.username,
          email: userData.email,
          role: userData.role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=0366d6&color=fff`
        }));

        showSuccess("Login berhasil!");
        setTimeout(() => (window.location.href = "dashboard.html"), 1200);
      } catch (err) {
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          showError("Email atau password salah.");
        } else {
          showError("Terjadi kesalahan: " + err.message);
        }
      }
    });
  }

  // ===== REGISTER =====
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("registerName").value.trim();
      const email = document.getElementById("registerEmail").value.trim().toLowerCase();
      const password = document.getElementById("registerPassword").value.trim();
      const confirm = document.getElementById("registerConfirmPassword").value.trim();

      if (password !== confirm) return showError("Password tidak cocok");
      if (password.length < 6) return showError("Password minimal 6 karakter");

      try {
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCred.user;

        // Simpan user ke Firestore
        await db.collection("users").doc(user.uid).set({
          uid: user.uid,
          username: name,
          email: email,
          role: "Kasir",
          canEdit: false,
          createdAt: new Date().toLocaleString("id-ID")
        });

        showSuccess("Registrasi berhasil! Silakan login.");
        registerForm.reset();
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          showError("Email sudah terdaftar, silakan login.");
        } else {
          showError("Terjadi kesalahan: " + err.message);
        }
      }
    });
  }
}

// ====== CEK STATUS LOGIN DI DASHBOARD ======
function checkAuthState() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!currentUser) {
    // Tidak ada user aktif, kembali ke halaman login
    window.location.href = "index.html";
  }
}

// ====== LOGOUT ======
function logoutUser() {
  localStorage.removeItem("currentUser");
  auth.signOut().finally(() => {
    window.location.href = "index.html";
  });
}

// ====== INISIALISASI ==========
document.addEventListener("DOMContentLoaded", () => {
  // Jalankan fungsi login/register hanya di halaman login
  if (document.getElementById("loginForm") || document.getElementById("registerForm")) {
    initializeAuth();
  }
  // Jalankan cek auth hanya di dashboard
  if (window.location.pathname.includes("dashboard.html")) {
    checkAuthState();
  }
});
