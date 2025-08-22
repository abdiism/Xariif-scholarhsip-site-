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
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore'
import { getFirebaseDb } from './firebase'
import { Scholarship, SearchFilters, PaginatedResponse, AppError, UserFavorite } from '../types'

const db = getFirebaseDb()
const scholarshipsCollection = collection(db, 'scholarships')
const favoritesCollection = collection(db, 'favorites')

// Get all scholarships with optional filters
export const getScholarships = async (
  filters: SearchFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<{ data?: PaginatedResponse<Scholarship>; error?: AppError }> => {
  try {
    let q = query(scholarshipsCollection, where('isActive', '==', true))

    // Apply filters
    if (filters.category && filters.category !== 'All') {
      q = query(q, where('type', '==', filters.category))
    }

    if (filters.fundingType && filters.fundingType.length > 0) {
      q = query(q, where('fundingType', 'in', filters.fundingType))
    }

    if (filters.levelOfStudy && filters.levelOfStudy.length > 0) {
      q = query(q, where('levelOfStudy', 'array-contains-any', filters.levelOfStudy))
    }

    // Add ordering
    q = query(q, orderBy('createdAt', 'desc'))

    // Add pagination
    if (page > 1) {
      // For pagination, we'd need to implement proper cursor-based pagination
      // This is a simplified version
      const startIndex = (page - 1) * pageSize
      q = query(q, limit(pageSize))
    } else {
      q = query(q, limit(pageSize))
    }

    const querySnapshot = await getDocs(q)
    const scholarships: Scholarship[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      scholarships.push({
        id: doc.id,
        ...data
      } as Scholarship)
    })

    // Get total count (simplified - in production, you'd maintain a counter)
    const totalQuery = query(scholarshipsCollection, where('isActive', '==', true))
    const totalSnapshot = await getDocs(totalQuery)
    const total = totalSnapshot.size

    const result: PaginatedResponse<Scholarship> = {
      data: scholarships,
      total,
      page,
      limit: pageSize,
      hasNext: scholarships.length === pageSize,
      hasPrev: page > 1
    }

    return { data: result }
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to fetch scholarships'
    }
    return { error: appError }
  }
}

// Add scholarship to favorites
export const addToFavorites = async (
  userId: string,
  scholarshipId: string
): Promise<{ error?: AppError }> => {
  try {
    // Check if already favorited
    const existingQuery = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('scholarshipId', '==', scholarshipId)
    )
    const existingSnapshot = await getDocs(existingQuery)

    if (!existingSnapshot.empty) {
      return { error: { code: 'already-favorited', message: 'Already in favorites' } }
    }

    const favoriteData: Omit<UserFavorite, 'id'> = {
      userId,
      scholarshipId,
      createdAt: new Date().toISOString()
    }

    await addDoc(favoritesCollection, favoriteData)
    return {}
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to add to favorites'
    }
    return { error: appError }
  }
}

// Remove scholarship from favorites
export const removeFromFavorites = async (
  userId: string,
  scholarshipId: string
): Promise<{ error?: AppError }> => {
  try {
    const favoriteQuery = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('scholarshipId', '==', scholarshipId)
    )
    const favoriteSnapshot = await getDocs(favoriteQuery)

    if (favoriteSnapshot.empty) {
      return { error: { code: 'not-found', message: 'Favorite not found' } }
    }

    const favoriteDoc = favoriteSnapshot.docs[0]
    await deleteDoc(favoriteDoc.ref)
    return {}
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to remove from favorites'
    }
    return { error: appError }
  }
}

// Get user's favorited scholarships
export const getUserFavoritedScholarships = async (
  userId: string
): Promise<{ data?: Scholarship[]; error?: AppError }> => {
  try {
    const { data: favorites, error: favoritesError } = await getUserFavorites(userId)
    
    if (favoritesError || !favorites) {
      return { error: favoritesError }
    }

    if (favorites.length === 0) {
      return { data: [] }
    }

    const scholarshipIds = favorites.map(fav => fav.scholarshipId)
    const scholarships: Scholarship[] = []

    // Fetch each scholarship (Firestore doesn't support 'in' queries with more than 10 items)
    for (const id of scholarshipIds) {
      const { data: scholarship, error } = await getScholarshipById(id)
      if (scholarship && !error) {
        scholarships.push({ ...scholarship, isFavorited: true })
      }
    }

    return { data: scholarships }
  } catch (error: any) {
    const appError: AppError = {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Failed to fetch favorited scholarships'
    }
    return { error: appError }
  }
}