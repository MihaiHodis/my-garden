// Import necessary functions
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ▼▼▼ YOUR NEW firebaseConfig OBJECT GOES HERE ▼▼▼
// Copy this from your new project in the Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyD_re7NcESffl84d9FYkruV6LHce-GM1mM",
  authDomain: "smart-greenhouse-auth.firebaseapp.com",
  projectId: "smart-greenhouse-auth",
  storageBucket: "smart-greenhouse-auth.firebasestorage.app",
  messagingSenderId: "142275968821",
  appId: "1:142275968821:web:bd8e1112a4bd54d07fd67c",
  measurementId: "G-7F8D32W99D"
};
// ▲▲▲ END OF YOUR NEW CONFIG ▲▲▲


// Initialize Firebase with your new config
const app = initializeApp(firebaseConfig); //

// ✅ This part is crucial for React Native to remember the user's login
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
}); //

// Export the auth module for use in other parts of your app
export { auth }; //