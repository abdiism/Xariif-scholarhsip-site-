import { Heart, ExternalLink, MapPin, Calendar, DollarSign } from 'lucide-react'

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

interface ScholarshipCardProps {
  scholarship: Scholarship
  onToggleFavorite?: (id: string) => void
}

export default function ScholarshipCard({ scholarship, onToggleFavorite }: ScholarshipCardProps) {
  const formatDate = (dateString: string) => {
    // Check for a valid date string before formatting
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'Not specified';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
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
        
        <button
          onClick={() => onToggleFavorite?.(scholarship.id)}
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

      {/* Description */}
      <div className="mb-4 flex-grow">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {scholarship.description}
        </p>
      </div>

      {/* Application Link */}
      <div className="pt-4 border-t border-gray-100 mt-auto">
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
  )
}
