import { getFirebaseDb } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Submits a detailed application help request to Firestore.
 * @param requestData - The complete data from the "Get Help" form.
 * @returns An object indicating success or failure.
 */
export const submitApplicationHelp = async (requestData: any) => {
  try {
    const db = getFirebaseDb();
    // We'll store these complex requests in a dedicated collection
    const docRef = await addDoc(collection(db, 'applicationHelpRequests'), {
      ...requestData,
      status: 'submitted', // Set an initial status
      submittedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting application help request: ", error);
    return { success: false, error };
  }
};
