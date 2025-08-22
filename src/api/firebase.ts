import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { FirebaseConfig } from '../types'

// Firebase configuration - will be populated with environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

// Validate configuration
const validateFirebaseConfig = (): void => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
  const missing = requiredFields.filter(field => !firebaseConfig[field as keyof FirebaseConfig])
  
  if (missing.length > 0) {
    console.error('Missing Firebase configuration fields:', missing)
    console.error('Please check your .env file and ensure all Firebase fields are provided')
    throw new Error(`Missing Firebase configuration: ${missing.join(', ')}`)
  }
}

// Initialize Firebase
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

export const initializeFirebase = () => {
  try {
    if (!app) {
      validateFirebaseConfig()
      app = initializeApp(firebaseConfig)
      auth = getAuth(app)
      db = getFirestore(app)
      storage = getStorage(app)
    }
    return { app, auth, db, storage }
  } catch (error) {
    console.error('Firebase initialization error:', error)
    throw error
  }
}

// Export instances
export const getFirebaseAuth = () => {
  if (!auth) {
    initializeFirebase()
  }
  return auth!
}

export const getFirebaseDb = () => {
  if (!db) {
    initializeFirebase()
  }
  return db!
}

export const getFirebaseStorage = () => {
  if (!storage) {
    initializeFirebase()
  }
  return storage!
}

export { firebaseConfig }