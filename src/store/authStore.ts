import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '../api/firebase'
import { convertFirebaseUser, signOutUser } from '../api/auth'
import { User, AppError, LoadingState } from '../types'

interface AuthState extends LoadingState {
  user: User | null
  isAuthenticated: boolean
  isInitialized: boolean
  success: string | null // <-- ADDED
  login: (user: User) => void
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => void
  setError: (error: AppError | null) => void
  setSuccess: (message: string | null) => void // <-- ADDED
  setLoading: (loading: boolean) => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,
      success: null, // <-- ADDED

      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          error: null,
          success: null, // Clear any stale success messages on new login
          isLoading: false,
        })
      },

      logout: async () => {
        set({ isLoading: true, error: null, success: null })
        const { error } = await signOutUser()

        if (error) {
          set({ error, isLoading: false })
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            success: null,
          })
        }
      },

      updateProfile: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },

      setError: (error: AppError | null) => {
        set({ error, success: null }) // <-- UPDATED to clear success message
      },

      setSuccess: (message: string | null) => {
        set({ success: message, error: null }) // <-- ADDED
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      initialize: () => {
        if (get().isInitialized) return

        const auth = getFirebaseAuth()

        onAuthStateChanged(auth, async (firebaseUser) => {
          set({ isLoading: true })

          if (firebaseUser) {
            const user = await convertFirebaseUser(firebaseUser)
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isInitialized: true,
                isLoading: false,
                error: null,
                success: null,
              })
            } else {
              // Handle case where user conversion fails
              set({
                user: null,
                isAuthenticated: false,
                isInitialized: true,
                isLoading: false,
                error: null,
                success: null,
              })
            }
          } else {
            // No user is signed in
            set({
              user: null,
              isAuthenticated: false,
              isInitialized: true,
              isLoading: false,
              error: null,
              success: null,
            })
          }
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Initialize auth state on app start
export const initializeAuth = () => {
  useAuthStore.getState().initialize()
}