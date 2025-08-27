import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Heart } from 'lucide-react'
import Header from '../components/Header'

export default function HomePage() {
  const [opportunityType, setOpportunityType] = useState('All Types')
  const [keywords, setKeywords] = useState(''); // State to hold keywords
  const navigate = useNavigate()

  // This function will be called when the form is submitted
  const handleSearch = (query: string) => {
    // It navigates to the search page, passing the type and keywords (even if empty)
    navigate(`/search?type=${encodeURIComponent(opportunityType)}&keywords=${encodeURIComponent(query)}`)
  }

  // This handles the form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(keywords);
  }

  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <div
        className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(https://scholarshipamerica.org/wp-content/uploads/2025/05/TwoStudentsStudying.jpg)' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-teal-900 bg-opacity-70"></div>
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">
            Search for scholarships and funding
          </h1>
          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Opportunity Type Dropdown */}
              <div className="relative flex-1">
                <label className="block text-sm text-gray-600 mb-2 text-left">Type</label>
                <div className="relative">
                  <select
                    value={opportunityType}
                    onChange={(e) => setOpportunityType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option>Dhamaan</option>
                    <option>Scholarships</option>
                    <option>Internships</option>
                    <option>Fellowships</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {/* Search Input */}
              <div className="flex-[2]"> {/* Gave more space to keywords input */}
                <label className="block text-sm text-gray-600 mb-2 text-left">Keywords</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="tus.: Engineering, Medicine, Master, Bachelors iwm."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md font-medium flex items-center whitespace-nowrap"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Raadi
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Additional Content Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Halkan ka Hel Scholarships-ka kugu Haboon.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Raadso Fursadaha Deeq-aha iyo Noocya-dooda kala duwan.
              sida kuwo Jaamacadeed , Ururo-khaas ah, iyo Deeqaha Caalamka.<br></br>
              Hada <b>Halkan</b> ka Bilow Safarkaa-gi aad ku Heli Lahayd <b>Deeq Waxbarasho</b>.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Raadi scholarships-ka adigoo u kala soocaya Nooca scholarship-ka, Nooca wax-barasho, goobta,
                iyo qaybo kale oo badan.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Favourites</h3>
              <p className="text-gray-600">
                Ciwaan furo , favourite gasho fursadaha kugu haboon si aad waqtigooda ula socoto.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 text-teal-600 font-bold text-lg">
                  $
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Verified Oppurtunities
              </h3>
              <p className="text-gray-600">
                Dhamaan fursadaha aan soo gudbino waa la soo hubiyay.
                Si maalinle ahna waa loo soo gudbiyaa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
