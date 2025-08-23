import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import Header from '../components/Header'
import ScholarshipCard from '../components/ScholarshipCard'
import { Scholarship } from '../types' // Assuming your types are set up

// Import the real content from the generated JSON file
import allContent from '../data/content.json'

// === THIS IS THE FIX ===
// We'll treat the incoming data as 'any[]' to bypass TypeScript's strict checking on the raw JSON.
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
  const [filteredOpportunities, setFilteredOpportunities] = useState<Scholarship[]>(allOpportunities)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  
  // Filter states
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  useEffect(() => {
    let filtered = [...allOpportunities]

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

    setFilteredOpportunities(filtered)
  }, [searchParams, selectedFundingTypes, selectedLevels, selectedSubjects, sortBy])

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

  // NOTE: You'll need to implement your own toggleFavorite logic connecting to Firebase
  const toggleFavorite = (scholarshipId: string) => {
    console.log("Toggling favorite for:", scholarshipId);
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
            {/* You will need to add your filter UI elements here */}
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
                Showing {filteredOpportunities.length} results
              </h1>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md p-2">
                <option value="relevance">Relevance</option>
                <option value="deadline">Deadline</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="space-y-6">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map(scholarship => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onToggleFavorite={toggleFavorite}
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
