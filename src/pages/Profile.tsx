import { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  Edit3,
  Camera,
  ArrowLeft,
  Heart,
  ThumbsUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
import { getUserFavoritesCount } from '../api/scholarships'
import { getUserUpvotedBlogsCount } from '../api/blogs'
import { updateUserProfileData, updateUserEmail } from '../api/auth'
import ErrorMessage from '../components/ErrorMessage'
import { AppError } from '../types'

export default function Profile() {
  const { user, updateProfile } = useAuthStore()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<AppError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  const [stats, setStats] = useState({
    favorites: 0,
    upvotedBlogs: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

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

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        setIsLoadingStats(true);
        const [favoritesResult, upvotedBlogsResult] = await Promise.all([
          getUserFavoritesCount(user.id),
          getUserUpvotedBlogsCount(user.id)
        ]);

        setStats({
          favorites: favoritesResult.count || 0,
          upvotedBlogs: upvotedBlogsResult.count || 0,
        });
        setIsLoadingStats(false);
      };
      fetchStats();
    }
  }, [user]);

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
    if (!user) return;
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null); // Clear previous success messages

    try {
      // Step 1: Check if the email address has been changed.
      if (formData.email !== user.email) {
        const { error: emailError } = await updateUserEmail(formData.email);
        if (emailError) {
          setError(emailError);
          setIsSaving(false);
          return;
        }
        // Set a success message instead of using alert()
        setSuccessMessage("A verification link has been sent to your new email. Please click the link to confirm the change.");
      }

      // Step 2: Update the rest of the profile data in Firestore.
      const profileUpdates = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };
      
      const { user: updatedUser, error: profileError } = await updateUserProfileData(user.id, profileUpdates);

      if (profileError) {
        setError(profileError);
      } else if (updatedUser) {
        updateProfile(updatedUser);
        setIsEditing(false);
        // Also show a general success message if no email change was requested
        if (formData.email === user.email) {
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(null), 3000); // Hide after 3 seconds
        }
      }
    } catch (e) {
      setError({ code: 'SAVE_ERROR', message: 'An unexpected error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
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
    setError(null)
    setSuccessMessage(null)
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
            {/* Display any errors or success messages here */}
            {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} className="mb-6" />}
            {successMessage && <ErrorMessage message={successMessage} variant="success" onDismiss={() => setSuccessMessage(null)} className="mb-6" />}
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div>
                {/* Name Section */}
                <div className="mb-2">
                  {isEditing ? (
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {`${formData.firstName} ${formData.lastName}`}
                    </h1>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {formatDate(user.dateJoined)}</span>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
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
                    <p className="text-gray-700">{formData.email || 'Not provided'}</p>
                  )}
                </div>
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
                    <p className="text-gray-700">{formData.phone || 'Not provided'}</p>
                  )}
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
                  <div className="text-2xl font-bold text-teal-600">
                    {isLoadingStats ? '...' : stats.favorites}
                  </div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">
                    {isLoadingStats ? '...' : stats.upvotedBlogs}
                  </div>
                  <div className="text-sm text-gray-600">Upvoted Blogs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
