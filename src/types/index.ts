// Core User Types
export interface User {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateJoined: string
  avatar?: string
  emailVerified?: boolean
  phoneVerified?: boolean
}

// Scholarship Types
export interface Scholarship {
  id: string
  title: string
  organization: string
  location: string
  deadline: string
  fundingType: 'Fully Funded' | 'Partial Funding' | 'Merit-based' | 'Need-based'
  levelOfStudy: ('Bachelors' | 'Masters' | 'PhD' | 'Postdoc')[]
  subjectAreas: string[]
  description: string
  eligibility: string
  benefits: string
  applicationLink: string
  type: 'Scholarships' | 'Internships' | 'Fellowships'
  isFavorited?: boolean
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// Blog Post Types
export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedDate: string
  readTime: string
  category: string
  tags: string[]
  imageUrl?: string
  upvotes: number
  views: number
  hasUpvoted?: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// User Favorites
export interface UserFavorite {
  id: string
  userId: string
  scholarshipId: string
  createdAt: string
}

// User Blog Interactions
export interface UserBlogInteraction {
  id: string
  userId: string
  blogPostId: string
  hasUpvoted: boolean
  hasViewed: boolean
  createdAt: string
  updatedAt: string
}

// Application Form Types
export interface ScholarshipApplication {
  id: string
  userId: string
  scholarshipId: string
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected'
  applicationData: Record<string, any>
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Firebase Types
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
}

// Loading States
export interface LoadingState {
  isLoading: boolean
  error: AppError | null
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  fundingType?: string[]
  levelOfStudy?: string[]
  subjectAreas?: string[]
  location?: string
  deadline?: {
    from?: string
    to?: string
  }
}

export interface SearchResult<T> {
  items: T[]
  total: number
  facets: {
    categories: { name: string; count: number }[]
    fundingTypes: { name: string; count: number }[]
    levelOfStudy: { name: string; count: number }[]
    subjectAreas: { name: string; count: number }[]
  }
}