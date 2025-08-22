import { useState } from 'react'
import { Heart, Search, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ScholarshipCard from '../components/ScholarshipCard'
import { useAuthStore } from '../store/authStore'

// Mock favorited scholarships
const mockFavoriteScholarships = [
  {
    id: '2',
    title: 'Global Health Initiative Scholarship',
    organization: 'International Health Foundation',
    location: 'Geneva, Switzerland',
    deadline: '2025-11-30',
    fundingType: 'Partial Funding',
    levelOfStudy: ['Masters', 'PhD'],
    subjectAreas: ['Medicine', 'Public Health'],
    description: 'Supporting future healthcare leaders committed to addressing global health challenges in underserved communities.',
    eligibility: 'Medical or public health background required. Minimum 2 years of relevant work experience. Commitment to work in developing countries.',
    benefits: '€15,000 annual scholarship, mentorship program, and internship opportunities with WHO.',
    applicationLink: 'https://healthfoundation.org/apply',
    isFavorited: true
  }
]

export default function Favourites() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState(mockFavoriteScholarships)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFavorites = favorites.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.subjectAreas.some(subject => 
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const toggleFavorite = (scholarshipId: string) => {
    setFavorites(prev => 
      prev.filter(s => s.id !== scholarshipId)
    )
  }

  // If user is not logged in, show lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Your Favorites
            </h2>
            
            <p className="text-gray-600 mb-8">
              Please log in or sign up to view and manage your favorite scholarships.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                Log In
              </button>
              
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-white hover:bg-gray-50 text-teal-600 border border-teal-600 py-3 px-4 rounded-md font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Save scholarships you're interested in and access them anytime.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-teal-600 fill-current" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourite Scholarships</h1>
          <p className="text-gray-600">
            Keep track of scholarships you're interested in applying for
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Search Bar */}
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

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredFavorites.length === favorites.length 
                  ? `${favorites.length} saved scholarship${favorites.length !== 1 ? 's' : ''}`
                  : `Showing ${filteredFavorites.length} of ${favorites.length} saved scholarships`
                }
              </p>
            </div>

            {/* Scholarship Cards */}
            <div className="space-y-6">
              {filteredFavorites.length > 0 ? (
                filteredFavorites.map(scholarship => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No scholarships match your search.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Tips for Managing Your Favorites</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Stay Organized</h3>
                  <p>Review deadlines regularly and prioritize applications by deadline date.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Track Applications</h3>
                  <p>Keep notes about application requirements and your progress for each scholarship.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Set Reminders</h3>
                  <p>Use calendar reminders for application deadlines to avoid missing opportunities.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Regular Updates</h3>
                  <p>Check back regularly as new scholarships are added and requirements may change.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start browsing scholarships and click the heart icon to save them here for easy access.
            </p>
            <a
              href="/"
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Scholarships
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
