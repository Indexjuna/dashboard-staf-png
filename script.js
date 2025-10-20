<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
  import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDSzHJuO14PSmoTtd5_HLUbjqc9X2YpXuM",
    authDomain: "all-staf-png.firebaseapp.com",
    projectId: "all-staf-png",
    storageBucket: "all-staf-png.firebasestorage.app",
    messagingSenderId: "884607713731",
    appId: "1:884607713731:web:61840654c5ac8f14893d76",
    measurementId: "G-SRKHS2BQHX"
  };

  // Init
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Simple auth listener
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log("✅ User login:", user.email);
    } else {
      console.log("🚪 Belum login");
    }
  });

  // Contoh tambah staff ke Firestore
  async function tambahStaff() {
    await addDoc(collection(db, "staff"), {
      nama: "Contoh Nama",
      inisial: "CN",
      join: "2025-10-20",
      createdAt: serverTimestamp()
    });
    alert("Data staff tersimpan");
  }

  window.tambahStaff = tambahStaff; // bisa dipanggil dari tombol HTML
</script>
