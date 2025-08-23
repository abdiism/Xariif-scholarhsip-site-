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

  const [opportunities, setOpportunities] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  
  // Filter states for all categories
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  // This function generates the list of available filter options from the content
  const getFilterOptions = () => {
    const fundingTypes = [...new Set(allOpportunities.map(o => o.fundingType).filter(Boolean))];
    const studyLevels = [...new Set(allOpportunities.flatMap(o => o.levelOfStudy).filter(Boolean))];
    const subjects = [...new Set(allOpportunities.flatMap(o => o.subjectAreas).filter(Boolean))];
    return { fundingTypes, studyLevels, subjects };
  }

  const filterOptions = getFilterOptions();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated && user) {
        const { data } = await getUserFavoritedScholarships(user.id);
        if (data) {
          setFavoriteIds(new Set(data.map(fav => fav.id)));
        }
      } else {
        setFavoriteIds(new Set());
      }
      setIsLoading(false);
    };
    fetchFavorites();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const opportunitiesWithFavorites = allOpportunities.map(op => ({
      ...op,
      isFavorited: favoriteIds.has(op.id)
    }));

    let filtered = [...opportunitiesWithFavorites]
    const typeParam = searchParams.get('type')
    const keywordsParam = searchParams.get('keywords')

    // Pre-select the type filter based on the URL parameter from the homepage
    if (typeParam && typeParam !== 'All Types' && selectedTypes.length === 0) {
        setSelectedTypes([typeParam]);
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
    
    // Apply sidebar filters
    if (selectedTypes.length > 0) {
        filtered = filtered.filter(s => selectedTypes.includes(s.type));
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
  }, [searchParams, selectedTypes, selectedFundingTypes, selectedLevels, selectedSubjects, sortBy, favoriteIds])

  const toggleFilter = (filterArray: string[], setFilterArray: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value))
    } else {
      setFilterArray([...filterArray, value])
    }
  }

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedFundingTypes([]);
    setSelectedLevels([]);
    setSelectedSubjects([]);
  }

  const handleToggleFavorite = async (scholarshipId: string) => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    const isCurrentlyFavorited = favoriteIds.has(scholarshipId);
    const originalFavoriteIds = new Set(favoriteIds);
    const newFavoriteIds = new Set(favoriteIds);
    if (isCurrentlyFavorited) {
      newFavoriteIds.delete(scholarshipId);
    } else {
      newFavoriteIds.add(scholarshipId);
    }
    setFavoriteIds(newFavoriteIds);
    try {
      if (isCurrentlyFavorited) {
        await removeFromFavorites(user.id, scholarshipId);
      } else {
        await addToFavorites(user.id, scholarshipId);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
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
            
            {/* === FULL FILTER PANEL RESTORED === */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Opportunity Type</h3>
              <div className="space-y-2">
                {['Scholarships', 'Internships', 'Fellowships'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3">Funding Type</h3>
              <div className="space-y-2">
                {filterOptions.fundingTypes.map(type => (
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

            <div className="mb-6">
              <h3 className="font-medium mb-3">Level of Study</h3>
              <div className="space-y-2">
                {filterOptions.studyLevels.map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() => toggleFilter(selectedLevels, setSelectedLevels, level)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium mb-4"
            >
              {showMoreFilters ? (
                <><ChevronUp className="w-4 h-4 mr-1" /> Show less filters</>
              ) : (
                <><ChevronDown className="w-4 h-4 mr-1" /> Show more filters</>
              )}
            </button>
            
            {showMoreFilters && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Subject Areas</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filterOptions.subjects.map(subject => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => toggleFilter(selectedSubjects, setSelectedSubjects, subject)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
