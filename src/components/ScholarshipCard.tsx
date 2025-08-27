import { useState } from 'react'
import { Heart, ChevronDown, ChevronUp, ExternalLink, MapPin, Calendar, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

// No changes to this interface
interface Scholarship {
  id: string
  title: string
  organization: string
  location: string
  deadline: string
  fundingType: string
  levelOfStudy: string[]
  subjectAreas: string[]
  description: string
  eligibility: string
  benefits: string
  applicationLink: string
  isFavorited?: boolean
}

// --- CHANGE 1: Updated Props ---
// The component now accepts a `userId` and expects `onToggleFavorite`
// to handle both the scholarshipId and the userId.
interface ScholarshipCardProps {
  scholarship: Scholarship
  userId?: string // The ID of the currently logged-in user
  onToggleFavorite?: (scholarshipId: string, userId: string) => void
}

export default function ScholarshipCard({ scholarship, userId, onToggleFavorite }: ScholarshipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'Not specified';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

 const handleFavoriteClick = () => {
  if (userId && onToggleFavorite) {
    // If the user is logged in, toggle the favorite status as normal.
    onToggleFavorite(scholarship.id, userId);
  } else {
    // If the user is NOT logged in, redirect them to the login page.
    navigate('/login');
  }
};

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {scholarship.title}
          </h3>
          <p className="text-gray-600 mb-2">{scholarship.organization}</p>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{scholarship.location}</span>
          </div>
        </div>
        
        {/* --- CHANGE 2: Updated onClick handler --- */}
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            scholarship.isFavorited 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label="Toggle Favorite"
        >
          <Heart className={`w-5 h-5 ${scholarship.isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Quick Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          scholarship.fundingType === 'Fully Funded' 
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {scholarship.fundingType}
        </span>
        {scholarship.levelOfStudy?.map((level) => (
          <span key={level} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            {level}
          </span>
        ))}
      </div>

      {/* Deadline */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4 mr-1" />
        <span className="font-medium">Deadline:</span>
        <span className="ml-1">{formatDate(scholarship.deadline)}</span>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
          {/* Subject Areas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Subject Areas</h4>
            <div className="flex flex-wrap gap-2">
              {scholarship.subjectAreas?.map((subject) => (
                <span key={subject} className="px-2 py-1 bg-teal-50 text-teal-800 rounded text-sm">
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Eligibility Criteria</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {scholarship.eligibility}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Benefits
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {scholarship.benefits}
            </p>
          </div>

          {/* Application Link */}
          <div className="pt-4 border-t border-gray-100">
            <a
              href={scholarship.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply Now
            </a>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium mt-4 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            Show more
          </>
        )}
      </button>
    </div>
  )
}