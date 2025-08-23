import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import Header from '../components/Header'
import ScholarshipCard from '../components/ScholarshipCard'
import { Scholarship } from '../types'
import { useAuthStore } from '../store/authStore'
import { addToFavorites, removeFromFavorites, getUserFavoritedScholarships } from '../api/scholarships'

// Import the real content from the generated JSON file
import allContent from '../data/content.json'

// We'll treat the incoming data as 'any[]' initially to avoid type conflicts
const scholarships: any[] = allContent.scholarships || [];
const internships: any[] = allContent.internships || [];
const fellowships: any[] = allContent.fellowships || [];

// Now, when we map over the arrays, we create correctly typed Scholarship objects.
const allOpportunities: Scholarship[] = [
  ...scholarships.map(item => ({ ...item, type: 'Scholarships' })),
  ...internships.map(item => ({ ...item, type: 'Internships' })),
  ...fellowships.map(item => ({ ...item, type: 'Fellowships' })),
];

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // State to hold the list of opportunities with their correct favorite status
  const [opportunities, setOpportunities] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to hold just the IDs of the user's favorites for quick lookups
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  
  // Filter states
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  // Effect 1: Fetch the user's favorites when the component loads or user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated && user) {
        const { data } = await getUserFavoritedScholarships(user.id);
        if (data) {
          // Create a Set of IDs for fast checking
          setFavoriteIds(new Set(data.map(fav => fav.id)));
        }
      } else {
        // If user logs out, clear their favorites
        setFavoriteIds(new Set());
      }
      setIsLoading(false);
    };
    fetchFavorites();
  }, [isAuthenticated, user]);


  // Effect 2: Filter and update the displayed opportunities
  useEffect(() => {
    // First, merge the favorite status into the main list
    const opportunitiesWithFavorites = allOpportunities.map(op => ({
      ...op,
      isFavorited: favoriteIds.has(op.id)
    }));

    let filtered = [...opportunitiesWithFavorites]

    const typeParam = searchParams.get('type')
    const keywordsParam = searchParams.get('keywords')

    if (typeParam && typeParam !== 'All Types') {
      filtered = filtered.filter(s => s.type === typeParam)
    }

    if (keywordsParam && keywordsParam.trim()) {
      const keywords = keywordsParam.toLowerCase().trim()
      filtered = filtered.filter(s => {
        const searchFields = [
          s.title.toLowerCase(),
          s.organization.toLowerCase(),
          s.location.toLowerCase(),
          s.fundingType.toLowerCase(),
          s.description.toLowerCase(),
          ...(s.subjectAreas || []).map(area => area.toLowerCase()),
          ...(s.levelOfStudy || []).map(level => level.toLowerCase())
        ].join(' ')
        return searchFields.includes(keywords)
      })
    }

    if (selectedFundingTypes.length > 0) {
      filtered = filtered.filter(s => selectedFundingTypes.includes(s.fundingType))
    }
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(s => s.levelOfStudy.some(level => selectedLevels.includes(level)))
    }
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(s => s.subjectAreas.some(subject => selectedSubjects.includes(subject)))
    }

    if (sortBy === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setOpportunities(filtered)
  }, [searchParams, selectedFundingTypes, selectedLevels, selectedSubjects, sortBy, favoriteIds]) // Re-run when favorites change

  const toggleFilter = (filterArray: string[], setFilterArray: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value))
    } else {
      setFilterArray([...filterArray, value])
    }
  }

  const clearAllFilters = () => {
    setSelectedFundingTypes([])
    setSelectedLevels([])
    setSelectedSubjects([])
  }

  // === UPDATED toggleFavorite FUNCTION ===
  const handleToggleFavorite = async (scholarshipId: string) => {
    if (!isAuthenticated || !user) {
      // Redirect to login page if user is not authenticated
      navigate('/login');
      return;
    }

    const isCurrentlyFavorited = favoriteIds.has(scholarshipId);
    const originalFavoriteIds = new Set(favoriteIds);

    // Optimistic UI update for instant feedback
    const newFavoriteIds = new Set(favoriteIds);
    if (isCurrentlyFavorited) {
      newFavoriteIds.delete(scholarshipId);
    } else {
      newFavoriteIds.add(scholarshipId);
    }
    setFavoriteIds(newFavoriteIds);

    // Call the API
    try {
      if (isCurrentlyFavorited) {
        await removeFromFavorites(user.id, scholarshipId);
      } else {
        await addToFavorites(user.id, scholarshipId);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      // If API call fails, revert the UI change
      setFavoriteIds(originalFavoriteIds);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 bg-white p-6 rounded-lg shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filter
              </h2>
              <button onClick={clearAllFilters} className="text-sm text-teal-600 hover:text-teal-700">
                Reset
              </button>
            </div>
            {/* Example for Funding Type: */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Funding Type</h3>
              <div className="space-y-2">
                {['Fully Funded', 'Partial Funding', 'Merit-based', 'Need-based'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFundingTypes.includes(type)}
                      onChange={() => toggleFilter(selectedFundingTypes, setSelectedFundingTypes, type)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold">
                Showing {opportunities.length} results
              </h1>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md p-2">
                <option value="relevance">Relevance</option>
                <option value="deadline">Deadline</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="space-y-6">
              {isLoading ? (
                <p>Loading opportunities...</p>
              ) : opportunities.length > 0 ? (
                opportunities.map(scholarship => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No opportunities found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
