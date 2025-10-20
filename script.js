import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase config
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

// Firebase Auth Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadStaffData();
  } else {
    window.location.href = 'index.html';
  }
});

// Login function
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    document.getElementById('errorMessage').textContent = error.message;
  }
});

// Logout function
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

// Load staff data
async function loadStaffData() {
  const querySnapshot = await getDocs(collection(db, 'staff'));
  const staffData = querySnapshot.docs.map(doc => doc.data());
  renderStaffTable(staffData);
}

// Render Staff Table
function renderStaffTable(staffData) {
  const tableBody = document.getElementById('staffTable');
  tableBody.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Inisial</th>
          <th>Date Joined</th>
          <th>Account No</th>
        </tr>
      </thead>
      <tbody>
        ${staffData.map(staff => `
          <tr>
            <td>${staff.name}</td>
            <td>${staff.inisial}</td>
            <td>${staff.dateJoined}</td>
            <td>${staff.accountNo}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
