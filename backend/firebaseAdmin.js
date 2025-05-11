// backend/firebaseAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "claimxpert-508d6.appspot.com"
});

export const db = admin.firestore();
export const auth = admin.auth();
