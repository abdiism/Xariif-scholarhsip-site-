import { Link } from 'react-router-dom'
import { User, Heart, Menu, ChevronDown, Calendar, LogOut, Settings, BookOpen } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">X</span>
            </div>
            <span className="text-xl font-bold text-black">XARIIF</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/blogs" className="flex items-center text-gray-700 hover:text-black">
              <BookOpen className="w-4 h-4 mr-1" />
              Blogs
            </Link>
            
            <Link to="/favourites" className="flex items-center text-gray-700 hover:text-black">
              <Heart className="w-4 h-4 mr-1" />
              My Favourites
            </Link>

            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-gray-700 hover:text-black focus:outline-none"
                >
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-sm font-medium">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  </div>
                  <span className="hidden lg:block">{user.firstName}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-medium">
                            {getInitials(user.firstName, user.lastName)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {user.email || user.phone}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Joined {formatDate(user.dateJoined)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Account Settings
                      </Link>
                      
                      <Link
                        to="/favourites"
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        My Favourites
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center text-gray-700 hover:text-black">
                <User className="w-4 h-4 mr-1" />
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center text-gray-700 hover:text-black"
          >
            <Menu className="w-5 h-5 mr-1" />
            Menu
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/blogs" 
                className="flex items-center text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Blogs
              </Link>

              <Link 
                to="/favourites" 
                className="flex items-center text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-4 h-4 mr-2" />
                My Favourites
              </Link>

              {isAuthenticated && user ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getInitials(user.firstName, user.lastName)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.email || user.phone}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined {formatDate(user.dateJoined)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-700 hover:text-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center text-gray-700 hover:text-black"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}