import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import allContent from '../data/content.json'; // Import the real content

// Define the shape of the imported JSON file to help TypeScript
interface ContentFile {
  scholarships?: any[];
  internships?: any[];
  fellowships?: any[];
  blog?: any[];
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'scholarship' | 'internship' | 'fellowship' | 'blog'
  category: string
}

interface SmartSearchProps {
  onSearch: (query: string, suggestion?: SearchSuggestion) => void
  placeholder?: string
  className?: string
}

// Cast the imported JSON to our defined type
const typedContent: ContentFile = allContent;

// We add a 'source' property to each item to easily identify its type later.
const allOpportunities = [
  ...(typedContent.scholarships || []).map(item => ({ ...item, source: 'scholarship' })),
  ...(typedContent.internships || []).map(item => ({ ...item, source: 'internship' })),
  ...(typedContent.fellowships || []).map(item => ({ ...item, source: 'fellowship' })),
  ...(typedContent.blog || []).map(item => ({ ...item, source: 'blog' }))
];

// Now we can use the 'source' property to reliably set the type and category.
const dynamicSuggestions: SearchSuggestion[] = allOpportunities.map((item, index) => ({
    id: item.id || `${index}`,
    text: item.title,
    type: item.source,
    category: item.source.charAt(0).toUpperCase() + item.source.slice(1), // Capitalizes the source name
}));


export default function SmartSearch({ onSearch, placeholder = 'Search...', className = '' }: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length > 1) { // Start searching after 2 characters
      const filtered = dynamicSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6); // Limit to 6 suggestions
      
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
      case 'scholarship': return 'text-blue-600'
      case 'internship': return 'text-green-600'
      case 'fellowship': return 'text-purple-600'
      case 'blog': return 'text-orange-600'
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
        </div>
      )}
    </div>
  )
}
