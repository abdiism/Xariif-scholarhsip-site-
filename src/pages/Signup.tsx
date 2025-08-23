import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Phone,
  ArrowRight,
} from 'lucide-react'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
import { signUpWithEmail, getAuthErrorMessage } from '../api/auth'
import { validateSignupForm } from '../utils/validation'
import ErrorMessage from '../components/ErrorMessage'

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loginMethod, setLoginMethod] = useState('email')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})
  // Get new success state and setter from the store
  const { login, isLoading, error, success, setError, setSuccess, setLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear validation error when user starts typing
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
    // Clear previous messages
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

    if (loginMethod === 'phone') {
      setError({
        code: 'phone-not-supported',
        message: 'Phone signup is not yet supported. Please use email.',
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
      const { user, error: authError } = await signUpWithEmail(
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
      } else if (user) {
        // --- THIS IS THE NEW SUCCESS LOGIC ---
        login(user)
        setSuccess('Account created successfully! Welcome.')
        setTimeout(() => {
          // You might want to show a message about email verification here
          // instead of an alert, or on the next page.
          navigate('/favourites')
        }, 1500) // 1.5 second delay
        // ------------------------------------
      }
    } catch (error: any) {
      setError({
        code: 'auth/unknown-error',
        message: 'An unexpected error occurred during signup. Please try again.',
      })
    } finally {
      // Only stop loading if there was an error, otherwise wait for redirect
      if (useAuthStore.getState().error) {
         setLoading(false)
      }
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

          {/* --- UPDATED: Error & Success Messages --- */}
          {error && (
            <ErrorMessage
              message={error}
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
          {/* ------------------------------------------- */}

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex justify-center bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                  loginMethod === 'email'
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                  loginMethod === 'phone'
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </button>
            </div>
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
            {/* Email or Phone Field */}
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                <input
                  id="contact"
                  name={loginMethod === 'email' ? 'email' : 'phone'}
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  value={
                    loginMethod === 'email' ? formData.email : formData.phone
                  }
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    validationErrors[loginMethod]
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder={
                    loginMethod === 'email'
                      ? 'john@example.com'
                      : '+1 (555) 123-4567'
                  }
                />
                {loginMethod === 'email' ? (
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                )}
              </div>
              {validationErrors[loginMethod] && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors[loginMethod]}
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
                <>
                  <div className="w-4 h-4 mr-2 animate-spin">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  Creating account...
                </>
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
          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}