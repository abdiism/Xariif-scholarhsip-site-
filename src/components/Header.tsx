import { Link } from "react-router-dom";
import {
  User,
  Heart,
  Menu,
  ChevronDown,
  Calendar,
  LogOut,
  Settings,
  BookOpen,
  FileText, // Added for My Applications
  Mail, // Added for Contact Us
  HelpCircle, // Added for Get Help
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="XARIIF Logo" className="w-12 h-12 mr-3" />
            <span className="text-xl font-bold text-black">xariif.site</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/blogs"
              className="flex items-center text-gray-700 hover:text-black"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Qoraalo
            </Link>

            {/* NEW: Contact Us Link */}
            <Link
              to="/contact"
              className="flex items-center text-gray-700 hover:text-black"
            >
              <Mail className="w-4 h-4 mr-1" />
              Nalasoo Xidhiidh
            </Link>

            {/* NEW: Get Help Link */}
            <Link
              to="/gethelp"
              className="flex items-center text-gray-700 hover:text-black"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              I Caawi
            </Link>
            <Link
  to="/favourites"
  className="flex items-center text-gray-700 hover:text-black"
>
  <Heart className="w-4 h-4 mr-1" />
  Favourites
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
                      {/* NEW: My Applications Link */}
                      <Link
                        to="/myapplications"
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        My Applications
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Account Settings
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
              <Link
                to="/login"
                className="flex items-center text-gray-700 hover:text-black"
              >
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute right-4 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:hidden z-20">
          <div className="py-1">
            <div className="flex flex-col px-1">
              <Link
                to="/blogs"
                className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4 mr-3" />
                Blogs
              </Link>
              
              {/* NEW: Contact Us Link (Mobile) */}
              <Link
                to="/contact"
                className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="w-4 h-4 mr-3" />
                Contact Us
              </Link>

              {/* NEW: Get Help Link (Mobile) */}
              <Link
                to="/gethelp"
                className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Get Help
              </Link>
              <Link
  to="/favourites"
  className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
  onClick={() => setIsMenuOpen(false)}
>
  <Heart className="w-4 h-4 mr-3" />
  Favourites
</Link>

              {/* Divider */}
              <div className="border-t border-gray-100 my-1"></div>

              {isAuthenticated && user ? (
                <>
                  {/* NEW: My Applications Link (Mobile) */}
                  <Link
                    to="/myapplications"
                    className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    My Applications
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
