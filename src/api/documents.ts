import { getFirebaseStorage, getFirebaseDb } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserDocument } from '../types';

/**
 * Uploads a user's document to Firebase Storage and saves its metadata to Firestore.
 * @param file - The file to be uploaded.
 * @param userId - The ID of the user uploading the file.
 * @returns The download URL of the uploaded file.
 */
export const uploadUserDocument = async (file: File, userId: string): Promise<string> => {
  if (!file || !userId) {
    throw new Error("File and user ID are required for upload.");
  }

  const storage = getFirebaseStorage();
  const db = getFirebaseDb();

  // 1. Create a storage reference
  const storageRef = ref(storage, `user_documents/${userId}/${Date.now()}_${file.name}`);

  // 2. Upload the file
  const snapshot = await uploadBytes(storageRef, file);

  // 3. Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  // 4. Save document metadata to Firestore
  const documentData: Omit<UserDocument, 'id'> = {
      userId,
      fileName: file.name,
      fileType: file.type,
      url: downloadURL,
      uploadedAt: new Date().toISOString(), // Using client-side timestamp for consistency
  };

  await addDoc(collection(db, 'userDocuments'), {
      ...documentData,
      uploadedTimestamp: serverTimestamp() // Add server timestamp as well
  });

  return downloadURL;
};
