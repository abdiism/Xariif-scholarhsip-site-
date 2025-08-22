import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Initialize Firebase and Auth with error handling
const initializeApp = async () => {
  try {
    const { initializeFirebase } = await import('./api/firebase.ts')
    const { initializeAuth } = await import('./store/authStore.ts')
    
    initializeFirebase()
    initializeAuth()
    console.log('Firebase initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
    console.error('Please check your Firebase configuration in .env file')
    // Continue rendering the app even if Firebase fails
  }
}

// Initialize Firebase asynchronously
initializeApp()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);