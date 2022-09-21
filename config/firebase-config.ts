import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Include absolute path to serviceAccoutKey.json

const serviceAccountKey = require("/Users/haisemjemal/Desktop/dropaiserver/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});
const db = getFirestore();

export { admin, db };
