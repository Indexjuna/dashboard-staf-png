import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSzHJuO14PSmoTtd5_HLUbjqc9X2YpXuM",
  authDomain: "all-staf-png.firebaseapp.com",
  projectId: "all-staf-png",
  storageBucket: "all-staf-png.firebasestorage.app",
  messagingSenderId: "884607713731",
  appId: "1:884607713731:web:61840654c5ac8f14893d76",
  measurementId: "G-SRKHS2BQHX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// cek login
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // ambil data staff
  const staffSnapshot = await getDocs(collection(db, "staff"));
  const staffList = staffSnapshot.docs.map(d => d.data());

  const table = document.getElementById("staffTable");
  table.innerHTML = "<table><tr><th>Nama</th><th>Inisial</th><th>Tanggal Join</th></tr>" +
    staffList.map(s => `<tr><td>${s.nama}</td><td>${s.inisial}</td><td>${s.join}</td></tr>`).join('') +
    "</table>";
});

// logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
