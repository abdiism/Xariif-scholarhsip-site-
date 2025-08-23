import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, User } from 'lucide-react'
import Header from '../components/Header'
import ScholarshipCard from '../components/ScholarshipCard'
import { useAuthStore } from '../store/authStore'
import { getUserFavoritedScholarships, removeFromFavorites } from '../api/scholarships'
import { Scholarship, AppError } from '../types'
import { FullPageLoading } from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

// Import the static content file, which contains all scholarship details
import allContent from '../data/content.json'

// Combine all opportunities from the static file into one master list
const allOpportunities: Scholarship[] = [
  ...(allContent.scholarships || []).map((item: any) => ({ ...item, type: 'Scholarships' })),
  ...(allContent.internships || []).map((item: any) => ({ ...item, type: 'Internships' })),
  ...(allContent.fellowships || []).map((item: any) => ({ ...item, type: 'Fellowships' })),
];

export default function Favourites() {
  const { user, isAuthenticated } = useAuthStore() 
  
  const [favorites, setFavorites] = useState<Scholarship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated && user) {
        try {
          setError(null)
          setIsLoading(true)
          // Step 1: Fetch the user's favorite documents from Firestore.
          // This returns an array of objects, each containing a scholarshipId.
          const { data: favoriteDocs, error: fetchError } = await getUserFavoritedScholarships(user.id)
          
          if (fetchError) {
            setError(fetchError)
          } else if (favoriteDocs) {
            // Step 2: Create a Set of just the scholarship IDs for easy lookup.
            const favoriteIdSet = new Set(favoriteDocs.map(fav => fav.id));
            
            // Step 3: Filter the master list of all opportunities to find the matching ones.
            const userFavorites = allOpportunities.filter(op => favoriteIdSet.has(op.id));
            
            setFavorites(userFavorites);
          }
        } catch (err) {
          setError({ code: 'FETCH_ERROR', message: 'An unexpected error occurred while fetching favorites.' })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    loadFavorites()
  }, [user, isAuthenticated])

  const handleToggleFavorite = async (scholarshipId: string) => {
    if (!user) return
    const originalFavorites = [...favorites]
    // Optimistically remove from the UI
    setFavorites(prev => prev.filter(s => s.id !== scholarshipId))
    
    const { error: removeError } = await removeFromFavorites(user.id, scholarshipId)
    
    if (removeError) {
      setError({ code: 'DELETE_ERROR', message: 'Failed to remove favorite. Please try again.' })
      // Revert if the API call fails
      setFavorites(originalFavorites)
    }
  }

  const filteredFavorites = favorites.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (scholarship.subjectAreas && scholarship.subjectAreas.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  if (isLoading) {
    return <FullPageLoading message="Loading..." />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Log in to see your favorites</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create an account or log in to save scholarships and keep track of your applications.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                <User className="w-4 h-4 mr-2" />
                Log In
              </Link>
              <Link to="/signup" className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-md font-medium transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-teal-600 fill-current" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourite Scholarships</h1>
          <p className="text-gray-600">Keep track of scholarships you're interested in applying for</p>
        </div>

        {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} className="mb-6" />}

        {favorites.length > 0 ? (
          <>
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your favorites..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredFavorites.length === favorites.length
                  ? `${favorites.length} saved scholarship${favorites.length !== 1 ? 's' : ''}`
                  : `Showing ${filteredFavorites.length} of ${favorites.length} saved scholarships`}
              </p>
            </div>
            <div className="space-y-6">
              {filteredFavorites.map(scholarship => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start browsing scholarships and click the heart icon to save them here for easy access.
            </p>
            <Link to="/" className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
              <Search className="w-4 h-4 mr-2" />
              Browse Scholarships
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
