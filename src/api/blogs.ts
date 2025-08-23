import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment
} from 'firebase/firestore'
import { getFirebaseDb } from './firebase'
import { BlogPost, UserBlogInteraction, AppError } from '../types'

const db = getFirebaseDb()
const blogsCollection = collection(db, 'blogs')
const blogInteractionsCollection = collection(db, 'blogInteractions')

// MISSING HELPER FUNCTION - ADDED
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
      return {}; // No interaction found
    }

    const doc = querySnapshot.docs[0];
    const interaction = { ...doc.data(), id: doc.id } as UserBlogInteraction;
    return { data: interaction };

  } catch (error: any) {
    return { error: { code: error.code, message: error.message } };
  }
};

// Get all published blog posts
export const getBlogPosts = async (): Promise<{ data?: BlogPost[]; error?: AppError }> => {
  try {
    const q = query(
      blogsCollection,
      where('isPublished', '==', true),
      orderBy('publishedDate', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const blogPosts: BlogPost[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      // CORRECTED ORDER: Spread data first, then set the definitive ID.
      blogPosts.push({
        ...data,
        id: doc.id
      } as BlogPost)
    })

    return { data: blogPosts }
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to fetch blog posts'
    }
    return { error: appError }
  }
}

// Upvote blog post
export const upvoteBlogPost = async (
  userId: string,
  blogPostId: string
): Promise<{ error?: AppError }> => {
  try {
    const { data: interaction } = await getUserBlogInteraction(userId, blogPostId)
    
    if (interaction) {
      // Update existing interaction
      const hasUpvoted = !interaction.hasUpvoted
      await updateDoc(doc(db, 'blogInteractions', interaction.id), {
        hasUpvoted,
        updatedAt: new Date().toISOString()
      })
      
      // Update blog post upvote count
      await updateDoc(doc(db, 'blogs', blogPostId), {
        upvotes: increment(hasUpvoted ? 1 : -1)
      })
    } else {
      // Create new interaction
      const newInteraction: Omit<UserBlogInteraction, 'id'> = {
        userId,
        blogPostId,
        hasUpvoted: true,
        hasViewed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await addDoc(blogInteractionsCollection, newInteraction)
      
      // Increment blog post upvote count
      await updateDoc(doc(db, 'blogs', blogPostId), {
        upvotes: increment(1)
      })
    }

    return {}
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to upvote blog post'
    }
    return { error: appError }
  }
}

// Record blog post view
export const recordBlogView = async (
  userId: string,
  blogPostId: string
): Promise<{ error?: AppError }> => {
  try {
    const { data: interaction } = await getUserBlogInteraction(userId, blogPostId)
    
    if (interaction && !interaction.hasViewed) {
      // Update existing interaction to mark as viewed
      await updateDoc(doc(db, 'blogInteractions', interaction.id), {
        hasViewed: true,
        updatedAt: new Date().toISOString()
      })
      
      // Increment view count
      await updateDoc(doc(db, 'blogs', blogPostId), {
        views: increment(1)
      })
    } else if (!interaction) {
      // Create new interaction
      const newInteraction: Omit<UserBlogInteraction, 'id'> = {
        userId,
        blogPostId,
        hasUpvoted: false,
        hasViewed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await addDoc(blogInteractionsCollection, newInteraction)
      
      // Increment view count
      await updateDoc(doc(db, 'blogs', blogPostId), {
        views: increment(1)
      })
    }

    return {}
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to record blog view'
    }
    return { error: appError }
  }
}

// Get blog posts with user interactions
export const getBlogPostsWithUserInteractions = async (
  userId?: string
): Promise<{ data?: BlogPost[]; error?: AppError }> => {
  try {
    const { data: blogPosts, error: blogError } = await getBlogPosts()
    
    if (blogError || !blogPosts) {
      return { error: blogError }
    }

    if (!userId) {
      return { data: blogPosts }
    }

    // Get user interactions for all blog posts
    const interactionsQuery = query(
      blogInteractionsCollection,
      where('userId', '==', userId)
    )
    
    const interactionsSnapshot = await getDocs(interactionsQuery)
    const interactions: Record<string, UserBlogInteraction> = {}
    
    interactionsSnapshot.forEach((doc) => {
      const interaction = doc.data() as UserBlogInteraction
      // CORRECTED ORDER: Spread data first, then set the definitive ID.
      interactions[interaction.blogPostId] = {
        ...interaction,
        id: doc.id
      }
    })

    // Merge interactions with blog posts
    const postsWithInteractions = blogPosts.map(post => ({
      ...post,
      hasUpvoted: interactions[post.id]?.hasUpvoted || false
    }))

    return { data: postsWithInteractions }
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to fetch blog posts with interactions'
    }
    return { error: appError }
  }
}

// === NEW FUNCTION ADDED HERE ===
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
      message: error.message || 'Failed to count upvoted blogs'
    };
    return { error: appError };
  }
};
