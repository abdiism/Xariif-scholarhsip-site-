import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface SearchSuggestion {
  id: string
  text: string
  type: 'field' | 'location' | 'university' | 'program'
  category: string
}

interface SmartSearchProps {
  onSearch: (query: string, suggestion?: SearchSuggestion) => void
  placeholder?: string
  className?: string
}

// Mock search suggestions - in real app, this would come from API
const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Computer science and engineering', type: 'field', category: 'Field of Study' },
  { id: '2', text: 'Computer science', type: 'field', category: 'Field of Study' },
  { id: '3', text: 'Computer programming', type: 'field', category: 'Field of Study' },
  { id: '4', text: 'Software engineering', type: 'field', category: 'Field of Study' },
  { id: '5', text: 'Data science', type: 'field', category: 'Field of Study' },
  { id: '6', text: 'Artificial intelligence', type: 'field', category: 'Field of Study' },
  { id: '7', text: 'Mechanical engineering', type: 'field', category: 'Field of Study' },
  { id: '8', text: 'Electrical engineering', type: 'field', category: 'Field of Study' },
  { id: '9', text: 'Medicine', type: 'field', category: 'Field of Study' },
  { id: '10', text: 'Business administration', type: 'field', category: 'Field of Study' },
  { id: '11', text: 'Stockholm, Sweden', type: 'location', category: 'Location' },
  { id: '12', text: 'London, UK', type: 'location', category: 'Location' },
  { id: '13', text: 'Boston, USA', type: 'location', category: 'Location' },
  { id: '14', text: 'Stanford University', type: 'university', category: 'University' },
  { id: '15', text: 'MIT', type: 'university', category: 'University' },
  { id: '16', text: 'Harvard University', type: 'university', category: 'University' },
]

export default function SmartSearch({ onSearch, placeholder = 'Search...', className = '' }: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6) // Limit to 6 suggestions
      
      setSuggestions(filtered)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  // Handle clicks outside search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSearch = (suggestion?: SearchSuggestion) => {
    const searchQuery = suggestion ? suggestion.text : query
    if (searchQuery.trim()) {
      onSearch(searchQuery, suggestion)
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'field': return 'text-blue-600'
      case 'location': return 'text-green-600'
      case 'university': return 'text-purple-600'
      case 'program': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50">
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Suggestions
            </p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
              >
                <Search className={`w-4 h-4 mr-3 ${getTypeColor(suggestion.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {suggestion.text}
                  </p>
                  <p className="text-xs text-gray-500">
                    {suggestion.category}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Show More Button if there are more suggestions */}
          {mockSuggestions.filter(s => 
            s.text.toLowerCase().includes(query.toLowerCase())
          ).length > 6 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => handleSearch()}
                className="w-full text-center text-sm text-teal-600 hover:text-teal-700 py-2"
              >
                See all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}