import { getFirebaseDb } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ScholarshipApplication } from '../types';

/**
 * Fetches all scholarship applications for a given user.
 * @param userId - The ID of the user whose applications to fetch.
 * @returns An array of scholarship applications.
 */
export const getUserApplications = async (userId: string): Promise<ScholarshipApplication[]> => {
  if (!userId) {
    console.warn("User ID is required to fetch applications.");
    return [];
  }

  try {
    const db = getFirebaseDb();
    const q = query(collection(db, 'scholarshipApplications'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const applications: ScholarshipApplication[] = [];
    querySnapshot.forEach((doc) => {
      // Ensure the data matches the type, including the document ID
      applications.push({ id: doc.id, ...doc.data() } as ScholarshipApplication);
    });

    return applications;
  } catch (error) {
    console.error("Error fetching user applications: ", error);
    return []; // Return an empty array on error
  }
};
