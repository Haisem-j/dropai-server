import admin from "firebase-admin";
import path from "path";
import { getFirestore } from "firebase-admin/firestore";

// Include absolute path to serviceAccoutKey.json
require("dotenv").config();

const serviceAccountKey =
  process.env.PRODUCTION_ENV === "PROD"
    ? require("../serviceAccountKey.json")
    : require("../testAccountServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});
const db = getFirestore();

export { admin, db };
