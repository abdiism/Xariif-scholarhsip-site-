import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  increment, // Re-added for atomic updates
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { BlogPost, UserBlogInteraction, AppError } from '../types';

const db = getFirebaseDb();
const blogsCollection = collection(db, 'blog');
const blogInteractionsCollection = collection(db, 'blogInteractions');

// Helper function to get a user's specific interaction with a post
export const getUserBlogInteraction = async (
  userId: string,
  blogPostId: string
): Promise<{ data?: UserBlogInteraction; error?: AppError }> => {
  try {
    const q = query(
      blogInteractionsCollection,
      where('userId', '==', userId),
      where('blogPostId', '==', blogPostId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {};
    }

    const doc = querySnapshot.docs[0];
    const interaction = { ...doc.data(), id: doc.id } as UserBlogInteraction;
    return { data: interaction };
  } catch (error: any) {
    return { error: { code: error.code, message: error.message } };
  }
};

// Fetches the dynamic data (counts) from the 'blogs' collection in Firestore
export const getBlogPosts = async (): Promise<{ data?: BlogPost[]; error?: AppError }> => {
  try {
    const q = query(
      blogsCollection,
      where('isPublished', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const blogPosts: BlogPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      blogPosts.push({
        ...data,
        id: doc.id,
      } as BlogPost);
    });

    return { data: blogPosts };
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to fetch blog posts',
    };
    return { error: appError };
  }
};

// Upvote blog post - CORRECTED LOGIC
export const upvoteBlogPost = async (
  userId: string,
  blogPostId: string
): Promise<{ error?: AppError }> => {
  try {
    const { data: interaction } = await getUserBlogInteraction(userId, blogPostId);
    const blogDocRef = doc(db, 'blog', blogPostId);
    
    if (interaction) {
      // User is toggling their upvote
      const hasUpvoted = !interaction.hasUpvoted;
      await updateDoc(doc(db, 'blogInteractions', interaction.id), { hasUpvoted });
      
      // Atomically increment/decrement the count on the main blog document
      await updateDoc(blogDocRef, { upvotes: increment(hasUpvoted ? 1 : -1) });
    } else {
      // First time user is upvoting
      const newInteraction: Omit<UserBlogInteraction, 'id'> = {
        userId,
        blogPostId,
        hasUpvoted: true,
        hasViewed: true, // An upvote always counts as a view
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addDoc(blogInteractionsCollection, newInteraction);
      
      // Atomically increment the count on the main blog document
      await updateDoc(blogDocRef, { upvotes: increment(1) });
    }

    return {};
  } catch (error: any) {
    return { error: { code: error.code, message: error.message } };
  }
};

// Record blog post view - CORRECTED LOGIC
// in src/api/blogs.ts

// Record blog post view - SIMPLIFIED LOGIC
export const recordBlogView = async (
  blogPostId: string
): Promise<{ error?: AppError }> => {
  try {
    // This function now simply increments the view count on the blog post document,
    // regardless of which user is viewing it or if they have viewed it before.
    const blogDocRef = doc(db, 'blog', blogPostId);
    await updateDoc(blogDocRef, { views: increment(1) });
    return {}; // Return success
  } catch (error: any) {
    return { error: { code: error.code, message: error.message } };
  }
};

// Get blog posts and merge with the current user's interaction status
export const getBlogPostsWithUserInteractions = async (
  userId?: string
): Promise<{ data?: BlogPost[]; error?: AppError }> => {
  try {
    // 1. Get the main blog data, which includes the correct upvote/view counts
    const { data: blogPosts, error: blogError } = await getBlogPosts();
    
    if (blogError || !blogPosts) {
      return { error: blogError };
    }

    // If no user is logged in, we can return the public blog data immediately
    if (!userId) {
      return { data: blogPosts.map(p => ({ ...p, hasUpvoted: false })) };
    }

    // 2. Get ONLY this user's interactions to check their upvote status
    const interactionsQuery = query(
      blogInteractionsCollection,
      where('userId', '==', userId)
    );
    const interactionsSnapshot = await getDocs(interactionsQuery);
    const userInteractions: Record<string, UserBlogInteraction> = {};
    
    interactionsSnapshot.forEach((doc) => {
      const interaction = doc.data() as UserBlogInteraction;
      userInteractions[interaction.blogPostId] = { ...interaction, id: doc.id };
    });

    // 3. Merge the user's upvote status into the main blog post data
    const postsWithInteractions = blogPosts.map(post => ({
      ...post,
      hasUpvoted: userInteractions[post.id]?.hasUpvoted || false,
    }));

    return { data: postsWithInteractions };
  } catch (error: any) {
    return { error: { code: error.code, message: error.message } };
  }
};

// === FUNCTION ADDED BACK IN ===
// Get the total count of a user's upvoted blogs
export const getUserUpvotedBlogsCount = async (
  userId: string
): Promise<{ count?: number; error?: AppError }> => {
  try {
    const interactionsQuery = query(
      blogInteractionsCollection,
      where('userId', '==', userId),
      where('hasUpvoted', '==', true)
    );
    const interactionsSnapshot = await getDocs(interactionsQuery);
    return { count: interactionsSnapshot.size };
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to count upvoted blogs',
    };
    return { error: appError };
  }
};
