import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  Edit3,
  Camera,
  ArrowLeft,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const { user, updateProfile } = useAuthStore()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: 'Passionate about education and helping others succeed through scholarship opportunities.',
    location: 'New York, USA',
    website: '',
    linkedin: '',
    twitter: '',
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      })
      setIsEditing(false)
      setIsSaving(false)
    }, 1000)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || '',
      phone: user.phone || '',
      bio: 'Passionate about education and helping others succeed through scholarship opportunities.',
      location: 'New York, USA',
      website: '',
      linkedin: '',
      twitter: '',
    })
    setIsEditing(false)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-r from-teal-500 to-teal-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-teal-600">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-teal-600 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-700 disabled:bg-gray-400 transition-colors flex items-center"
                  >
                    {isSaving ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="flex-1 text-2xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="flex-1 text-2xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    `${formData.firstName} ${formData.lastName}`
                  )}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {formatDate(user.dateJoined)}</span>
                </div>
                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700">{formData.bio}</p>
                  )}
                </div>
                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-gray-700">{formData.location}</p>
                  )}
                </div>
              </div>
              {/* Right Column - Contact Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" /> Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="your.email@example.com"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {formData.email || 'Not provided'}
                    </p>
                  )}
                </div>
                {/* Phone */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" /> Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {formData.phone || 'Not provided'}
                    </p>
                  )}
                </div>
                {/* Website */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="https://your-website.com"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {formData.website ? (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline"
                        >
                          {formData.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>
                {/* Social Links */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    ) : (
                      <p className="text-gray-700">
                        {formData.linkedin ? (
                          <a
                            href={`https://${formData.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:underline"
                          >
                            {formData.linkedin}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="@yourusername"
                      />
                    ) : (
                      <p className="text-gray-700">
                        {formData.twitter ? (
                          <a
                            href={`https://twitter.com/${formData.twitter.replace(
                              '@',
                              ''
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:underline"
                          >
                            {formData.twitter}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Account Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">5</div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">12</div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">3</div>
                  <div className="text-sm text-gray-600">Awards</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">42</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}