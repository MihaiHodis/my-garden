// config/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Citește fișierul JSON manual
let serviceAccount;
try {
  const filePath = path.join(__dirname, "serviceAccountKey.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Firebase serviceAccountKey.json not found at ${filePath}`);
  }
  serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (error) {
  console.error("❌ CRITICAL: Failed to load Firebase Service Account Key:", error.message);
  process.exit(1); // Stop the server if Firebase can't be initialized
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized successfully");
} catch (error) {
  console.error("❌ CRITICAL: Failed to initialize Firebase Admin:", error.message);
  process.exit(1);
}

export default admin;
