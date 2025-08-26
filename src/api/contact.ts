import { getFirebaseDb } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ContactSubmission } from '../types';

/**
 * Submits the contact form data to Firestore.
 * @param formData - The data from the contact form.
 * @returns An object indicating success or failure.
 */
export const submitContactForm = async (formData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
  try {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'contactSubmissions'), {
      ...formData,
      submittedAt: serverTimestamp(), // Use server-side timestamp
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting contact form: ", error);
    // It's better to return the error object for more detailed handling
    return { success: false, error };
  }
};
