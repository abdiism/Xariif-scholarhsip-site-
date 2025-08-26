import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  ArrowRight,
} from 'lucide-react'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
// NEW: Import signOutUser
import { signUpWithEmail, getAuthErrorMessage, signOutUser } from '../api/auth' 
import { validateSignupForm } from '../utils/validation'
import ErrorMessage from '../components/ErrorMessage'

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { isLoading, error, success, setError, setSuccess, setLoading } = useAuthStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (validationErrors[e.target.name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[e.target.name]
        return newErrors
      })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setValidationErrors({})

    if (!acceptTerms) {
      setError({
        code: 'terms-required',
        message: 'Please accept the Terms of Service and Privacy Policy',
      })
      return
    }

    const validation = validateSignupForm({ ...formData })
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      const { error: authError } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      )
      if (authError) {
        setError({
          code: authError.code,
          message: getAuthErrorMessage(authError.code),
        })
      } else {
        // NEW: Sign the user out immediately after account creation
        await signOutUser(); 
        // Show a success message prompting them to check their email
        setSuccess('Account created! Please check your email for a verification link to sign in.');
        // Reset the form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setAcceptTerms(false);
      }
    } catch (error: any) {
      setError({
        code: 'auth/unknown-error',
        message: 'An unexpected error occurred during signup. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Join XARIIF to find your perfect scholarship
            </p>
          </div>

          {error && (
            <ErrorMessage
              message={error.message}
              variant="error"
              onDismiss={() => setError(null)}
              className="mb-6"
            />
          )}
          {success && (
              <ErrorMessage
              message={success}
              variant="success"
              onDismiss={() => setSuccess(null)}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            {/* REMOVED: Login Method Toggle */}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      validationErrors.firstName
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      validationErrors.lastName
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    validationErrors.email
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pl-10 pr-10 ${
                    validationErrors.password
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>
            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pl-10 pr-10 ${
                    validationErrors.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                required
              />
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="text-gray-700">
                  I agree to the{' '}
                  <a
                    href="#"
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>
          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
