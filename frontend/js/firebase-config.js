import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAepH5x1sYNRml9DuG09SIPJ9QX-MT5GIw",
  authDomain: "claimxpert-508d6.firebaseapp.com",
  databaseURL: "https://claimxpert-508d6-default-rtdb.firebaseio.com",
  projectId: "claimxpert-508d6",
  storageBucket: "claimxpert-508d6.appspot.com",
  messagingSenderId: "678030673221",
  appId: "1:678030673221:web:584368f5a22b23f25cea2c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestoreDB = getFirestore(app);     // Firestore
export const db = getDatabase(app);               // Realtime DB
export const storage = getStorage(app);
  