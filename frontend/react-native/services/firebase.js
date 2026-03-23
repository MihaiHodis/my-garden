// Import necessary functions
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ▼▼▼ YOUR NEW firebaseConfig OBJECT GOES HERE ▼▼▼
// Copy this from your new project in the Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyDSQS2santRhXXikgw5Zs10uBs97wLp4tM",
  authDomain: "my-garden-56897.firebaseapp.com",
  projectId: "my-garden-56897",
  storageBucket: "my-garden-56897.firebasestorage.app",
  messagingSenderId: "223563983740",
  appId: "1:223563983740:web:b6127f59b33fcce44452f9",
  measurementId: "G-KYQ44Q505N"
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