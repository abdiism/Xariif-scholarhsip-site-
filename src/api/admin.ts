import { getFirebaseDb } from './firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
// NEW: Import the ContactSubmission type
import { ApplicationHelpRequest, ContactSubmission } from '../types'; 

/**
 * Fetches all application help requests from Firestore for the admin dashboard.
 * @returns An array of all application help requests.
 */
export const getAllHelpRequests = async (): Promise<ApplicationHelpRequest[]> => {
  try {
    const db = getFirebaseDb();
    const q = query(collection(db, 'applicationHelpRequests'), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const requests: ApplicationHelpRequest[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as ApplicationHelpRequest);
    });

    return requests;
  } catch (error) {
    console.error("Error fetching all help requests: ", error);
    return [];
  }
};

/**
 * Updates the status of a specific help request.
 * @param requestId - The ID of the document to update.
 * @param newStatus - The new status to set.
 * @returns An object indicating success or failure.
 */
export const updateRequestStatus = async (requestId: string, newStatus: string) => {
  try {
    const db = getFirebaseDb();
    const requestDocRef = doc(db, 'applicationHelpRequests', requestId);
    await updateDoc(requestDocRef, {
      status: newStatus,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating status: ", error);
    return { success: false, error };
  }
};

/**
 * NEW: Fetches all contact form submissions from Firestore.
 * @returns An array of all contact submissions.
 */
export const getAllContactSubmissions = async (): Promise<ContactSubmission[]> => {
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'contactSubmissions'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
  
      const submissions: ContactSubmission[] = [];
      querySnapshot.forEach((doc) => {
        submissions.push({ id: doc.id, ...doc.data() } as ContactSubmission);
      });
  
      return submissions;
    } catch (error) {
      console.error("Error fetching contact submissions: ", error);
      return [];
    }
  };
