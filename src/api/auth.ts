import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebase'
import { User, AppError } from '../types'

const auth = getFirebaseAuth()
const db = getFirebaseDb()

// Convert Firebase user to our User type
export const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  if (!firebaseUser) return null

  try {
    const userDocRef = doc(db, 'users', firebaseUser.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        id: firebaseUser.uid,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: firebaseUser.email || undefined,
        phone: firebaseUser.phoneNumber || undefined,
        dateJoined: userData.dateJoined || new Date().toISOString(),
        avatar: userData.avatar || firebaseUser.photoURL || undefined,
        emailVerified: firebaseUser.emailVerified,
        phoneVerified: userData.phoneVerified || false
      }
    }
    
    return null
  } catch (error) {
    console.error('Error converting Firebase user:', error)
    return null
  }
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ user?: User; error?: AppError }> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Check if user already exists in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // If user is new, create a document for them
      const [firstName, ...lastNameParts] = firebaseUser.displayName?.split(' ') || ["", ""];
      const userData = {
        firstName: firstName,
        lastName: lastNameParts.join(' '),
        email: firebaseUser.email,
        dateJoined: new Date().toISOString(),
        emailVerified: firebaseUser.emailVerified,
        phoneVerified: false, // Google sign-in doesn't provide phone
        avatar: firebaseUser.photoURL,
      };
      await setDoc(userDocRef, userData);
    }

    const user = await convertFirebaseUser(firebaseUser);
    if (!user) {
      throw new Error('Failed to load user data after Google sign-in');
    }
    return { user };

  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'auth/popup-closed-by-user',
      message: error.message || 'An unknown error occurred during Google sign in'
    };
    return { error: appError };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ user: User; error?: AppError }> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Update Firebase profile
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`
    })

    // Create user document in Firestore
    const userData = {
      firstName,
      lastName,
      email,
      dateJoined: new Date().toISOString(),
      emailVerified: false,
      phoneVerified: false
    }

    await setDoc(doc(db, 'users', firebaseUser.uid), userData)

    // Send email verification
    await sendEmailVerification(firebaseUser)

    const user: User = {
      id: firebaseUser.uid,
      firstName,
      lastName,
      email,
      dateJoined: userData.dateJoined,
      emailVerified: false,
      phoneVerified: false
    }

    return { user }
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'auth/unknown-error',
      message: error.message || 'An unknown error occurred during sign up'
    }
    return { user: {} as User, error: appError }
  }
}

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user?: User; error?: AppError }> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = await convertFirebaseUser(userCredential.user)
    
    if (!user) {
      throw new Error('Failed to load user data')
    }

    return { user }
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'auth/unknown-error',
      message: error.message || 'An unknown error occurred during sign in'
    }
    return { error: appError }
  }
}

// Sign out
export const signOutUser = async (): Promise<{ error?: AppError }> => {
  try {
    await signOut(auth)
    return {}
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'auth/unknown-error',
      message: error.message || 'An unknown error occurred during sign out'
    }
    return { error: appError }
  }
}

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<{ user?: User; error?: AppError }> => {
  try {
    const userDocRef = doc(db, 'users', userId)
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })

    // Get updated user data
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const userData = userDoc.data()
      const user: User = {
        id: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        dateJoined: userData.dateJoined,
        avatar: userData.avatar,
        emailVerified: userData.emailVerified,
        phoneVerified: userData.phoneVerified
      }
      return { user }
    }

    throw new Error('User not found after update')
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'An unknown error occurred during profile update'
    }
    return { error: appError }
  }
}

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) return null
  
  return await convertFirebaseUser(firebaseUser)
}

// Error message helpers
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please use a different email or try signing in.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return 'An error occurred. Please try again.'
  }
}