import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import Header from '../components/Header'
import ScholarshipCard from '../components/ScholarshipCard'

// Mock scholarship data with diverse categories
const mockScholarships = [
  {
    id: '1',
    title: 'Engineering Excellence Scholarship',
    organization: 'University of Technology',
    location: 'Stockholm, Sweden',
    deadline: '2025-12-15',
    fundingType: 'Fully Funded',
    levelOfStudy: ['Bachelors', 'Masters'],
    subjectAreas: ['Engineering', 'Computer Science'],
    description:
      'This scholarship supports outstanding students pursuing engineering degrees with demonstrated academic excellence and leadership potential.',
    eligibility:
      'Open to international students with a minimum GPA of 3.5, strong English proficiency, and demonstrated leadership experience.',
    benefits:
      'Full tuition coverage, monthly living allowance of €1,200, health insurance, and research opportunities.',
    applicationLink: 'https://university.com/apply',
    isFavorited: false,
    type: 'Scholarships',
  },
  {
    id: '2',
    title: 'Global Health Initiative Scholarship',
    organization: 'International Health Foundation',
    location: 'Geneva, Switzerland',
    deadline: '2025-11-30',
    fundingType: 'Partial Funding',
    levelOfStudy: ['Masters', 'PhD'],
    subjectAreas: ['Medicine', 'Public Health'],
    description:
      'Supporting future healthcare leaders committed to addressing global health challenges in underserved communities.',
    eligibility:
      'Medical or public health background required. Minimum 2 years of relevant work experience. Commitment to work in developing countries.',
    benefits:
      '€15,000 annual scholarship, mentorship program, and internship opportunities with WHO.',
    applicationLink: 'https://healthfoundation.org/apply',
    isFavorited: true,
    type: 'Scholarships',
  },
  {
    id: '3',
    title: 'Tech Giants Summer Internship Program',
    organization: 'Google',
    location: 'Mountain View, USA',
    deadline: '2025-02-15',
    fundingType: 'Merit-based',
    levelOfStudy: ['Bachelors', 'Masters'],
    subjectAreas: ['Computer Science', 'Engineering'],
    description:
      'Competitive summer internship program at Google for computer science and engineering students.',
    eligibility:
      'Currently enrolled in CS/Engineering program, strong programming skills, previous internship experience preferred.',
    benefits:
      '$8,000 monthly stipend, housing assistance, mentorship, potential full-time offer.',
    applicationLink: 'https://careers.google.com/internships',
    isFavorited: false,
    type: 'Internships',
  },
  {
    id: '4',
    title: 'Rhodes Fellowship Program',
    organization: 'Oxford University',
    location: 'Oxford, UK',
    deadline: '2025-09-30',
    fundingType: 'Fully Funded',
    levelOfStudy: ['Masters', 'PhD'],
    subjectAreas: ['All Fields'],
    description:
      'Prestigious fellowship program offering full funding for graduate study at Oxford University.',
    eligibility:
      'Exceptional academic achievement, leadership potential, commitment to service. Age 19-25.',
    benefits: 'Full tuition, living expenses, travel costs, book allowance for 2-3 years.',
    applicationLink: 'https://www.rhodesscholarships.org/apply',
    isFavorited: false,
    type: 'Fellowships',
  },
  {
    id: '5',
    title: 'Microsoft Research Fellowship',
    organization: 'Microsoft Research',
    location: 'Seattle, USA',
    deadline: '2025-03-01',
    fundingType: 'Fully Funded',
    levelOfStudy: ['PhD'],
    subjectAreas: ['Computer Science', 'Artificial Intelligence'],
    description:
      'Research fellowship for PhD students in computer science and AI fields.',
    eligibility:
      'PhD student in computer science, AI, or related field. Strong research background required.',
    benefits:
      '$42,000 annual stipend, research resources, mentorship, conference funding.',
    applicationLink:
      'https://www.microsoft.com/en-us/research/academic-program/phd-fellowship/',
    isFavorited: false,
    type: 'Fellowships',
  },
]

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const [scholarships, setScholarships] = useState(mockScholarships)
  const [filteredScholarships, setFilteredScholarships] =
    useState(mockScholarships)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  // Filter states
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  // Dynamic filter options based on search type
  const typeParam = searchParams.get('type')

  const getFilterOptions = () => {
    if (typeParam === 'Scholarships') {
      return {
        fundingTypes: [
          'Fully Funded',
          'Partial Funding',
          'Merit-based',
          'Need-based',
        ],
        studyLevels: ['Bachelors', 'Masters', 'PhD'],
        subjects: [
          'Engineering',
          'Computer Science',
          'Medicine',
          'Public Health',
          'Environmental Science',
          'Business',
          'All Fields',
        ],
      }
    } else if (typeParam === 'Internships') {
      return {
        fundingTypes: ['Merit-based', 'Paid', 'Unpaid'],
        studyLevels: ['Bachelors', 'Masters'],
        subjects: [
          'Computer Science',
          'Engineering',
          'Business',
          'Finance',
          'Economics',
        ],
      }
    } else if (typeParam === 'Fellowships') {
      return {
        fundingTypes: ['Fully Funded', 'Research Grant'],
        studyLevels: ['Masters', 'PhD', 'Postdoc'],
        subjects: [
          'Computer Science',
          'Artificial Intelligence',
          'Education',
          'All Fields',
        ],
      }
    } else {
      // Show all options for 'All Types'
      return {
        fundingTypes: [
          'Fully Funded',
          'Partial Funding',
          'Merit-based',
          'Need-based',
          'Research Grant',
          'Paid',
        ],
        studyLevels: ['Bachelors', 'Masters', 'PhD', 'MBA', 'Postdoc'],
        subjects: [
          'Engineering',
          'Computer Science',
          'Medicine',
          'Public Health',
          'Environmental Science',
          'Business',
          'Entrepreneurship',
          'Finance',
          'Economics',
          'Education',
          'Artificial Intelligence',
          'All Fields',
        ],
      }
    }
  }

  const filterOptions = getFilterOptions()
  const { fundingTypes, studyLevels, subjects } = filterOptions

  useEffect(() => {
    // Filter scholarships based on selected filters
    let filtered = scholarships
    // Apply search params filtering first
    const typeParam = searchParams.get('type')
    const keywordsParam = searchParams.get('keywords')
    // Filter by opportunity type (Scholarships, Internships, Fellowships)
    if (typeParam && typeParam !== 'All Types') {
      filtered = filtered.filter((s) => s.type === typeParam)
    }
    // Enhanced keyword search with flexible matching
    if (keywordsParam && keywordsParam.trim()) {
      const keywords = keywordsParam.toLowerCase().trim()
      filtered = filtered.filter((s) => {
        // Search in multiple fields with flexible matching
        const searchFields = [
          s.title.toLowerCase(),
          s.organization.toLowerCase(),
          s.location.toLowerCase(),
          s.fundingType.toLowerCase(),
          s.description.toLowerCase(),
          ...s.subjectAreas.map((area) => area.toLowerCase()),
          ...s.levelOfStudy.map((level) => level.toLowerCase()),
        ].join(' ')
        // Split keywords and check if any match
        const keywordList = keywords.split(' ').filter((k) => k.length > 0)
        return keywordList.some((keyword) => searchFields.includes(keyword))
      })
    }
    // Apply sidebar filters
    if (selectedFundingTypes.length > 0) {
      filtered = filtered.filter((s) =>
        selectedFundingTypes.includes(s.fundingType)
      )
    }
    if (selectedLevels.length > 0) {
      filtered = filtered.filter((s) =>
        s.levelOfStudy.some((level) => selectedLevels.includes(level))
      )
    }
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter((s) =>
        s.subjectAreas.some((subject) => selectedSubjects.includes(subject))
      )
    }
    // Apply sorting
    if (sortBy === 'deadline') {
      filtered.sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }
    setFilteredScholarships(filtered)
  }, [
    scholarships,
    selectedFundingTypes,
    selectedLevels,
    selectedSubjects,
    searchParams,
    sortBy,
  ])

  const toggleFilter = (
    filterArray: string[],
    setFilterArray: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item) => item !== value))
    } else {
      setFilterArray([...filterArray, value])
    }
  }

  const toggleFavorite = (scholarshipId: string) => {
    setScholarships((prev) =>
      prev.map((s) =>
        s.id === scholarshipId ? { ...s, isFavorited: !s.isFavorited } : s
      )
    )
  }

  const clearAllFilters = () => {
    setSelectedFundingTypes([])
    setSelectedLevels([])
    setSelectedSubjects([])
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
              <button
                onClick={clearAllFilters}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Reset (0)
              </button>
            </div>
            {/* Dynamic Filter for Funding Type */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">
                {typeParam === 'Internships'
                  ? 'Compensation Type'
                  : typeParam === 'Fellowships'
                  ? 'Grant Type'
                  : 'Funding Type'}
              </h3>
              <div className="space-y-2">
                {fundingTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFundingTypes.includes(type)}
                      onChange={() =>
                        toggleFilter(
                          selectedFundingTypes,
                          setSelectedFundingTypes,
                          type
                        )
                      }
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Level of Study Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Level of Study</h3>
              <div className="space-y-2">
                {studyLevels.map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() =>
                        toggleFilter(selectedLevels, setSelectedLevels, level)
                      }
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* More Filters Toggle */}
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium mb-4"
            >
              {showMoreFilters ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less filters
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show more filters
                </>
              )}
            </button>
            {/* Additional Filters */}
            {showMoreFilters && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Subject Areas</h3>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() =>
                          toggleFilter(
                            selectedSubjects,
                            setSelectedSubjects,
                            subject
                          )
                        }
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
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-xl font-semibold mb-1">
                  {typeParam && typeParam !== 'All Types'
                    ? typeParam
                    : 'All Opportunities'}
                </h1>
                <p className="text-gray-600 text-sm">
                  Showing {filteredScholarships.length} results
                  {searchParams.get('keywords') &&
                    ` for "${searchParams.get('keywords')}"`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="deadline">Deadline</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
            {/* Scholarship Cards */}
            <div className="space-y-6">
              {filteredScholarships.length > 0 ? (
                filteredScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No scholarships found matching your criteria.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}