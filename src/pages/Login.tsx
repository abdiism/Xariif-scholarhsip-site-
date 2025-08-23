import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
import { signInWithEmail, getAuthErrorMessage, signInWithGoogle  } from '../api/auth'
import { validateLoginForm } from '../utils/validation'
import ErrorMessage from '../components/ErrorMessage'

export default function Login() {
  const [loginCredential, setLoginCredential] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState('email')
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})
  // Get new success state and setter from the store
  const { login, isLoading, error, success, setError, setSuccess, setLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Clear previous messages
    setError(null)
    setSuccess(null)
    setValidationErrors({})

    // Validate form
    const validation = validateLoginForm({
      credential: loginCredential,
      password,
      loginMethod,
    })
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    if (loginMethod === 'phone') {
      setError({
        code: 'phone-not-supported',
        message: 'Phone login is not yet supported. Please use email.',
      })
      return
    }

    setLoading(true)
    try {
      const { user, error: authError } = await signInWithEmail(
        loginCredential,
        password
      )
      if (authError) {
        setError({
          code: authError.code,
          message: getAuthErrorMessage(authError.code),
        })
      } else if (user) {
        // --- THIS IS THE NEW SUCCESS LOGIC ---
        login(user)
        setSuccess('Sign in successful! Welcome back.')
        setTimeout(() => {
          navigate('/favourites')
        }, 1500) // 1.5 second delay
        // ------------------------------------
      }
    } catch (error: any) {
      setError({
        code: 'auth/unknown-error',
        message: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      // Only stop loading if there was an error, otherwise wait for redirect
      if (useAuthStore.getState().error) {
         setLoading(false)
      }
    }
  }
  //google login handle
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user, error: authError } = await signInWithGoogle();
      if (authError) {
        setError({ code: authError.code, message: getAuthErrorMessage(authError.code) });
      } else if (user) {
        login(user);
        navigate('/favourites');
      }
    } catch (error: any) {
      setError({ code: 'auth/unknown-error', message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-600 mt-2">Access your XARIIF account</p>
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

          <form onSubmit={handleLogin} className="space-y-6">
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
                <Mail className="w-4 h-4 mr-2" /> Email
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
                <Phone className="w-4 h-4 mr-2" /> Phone
              </button>
            </div>

            {/* Email or Phone Field */}
            <div>
              <label
                htmlFor="loginCredential"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                <input
                  id="loginCredential"
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  value={loginCredential}
                  onChange={(e) => setLoginCredential(e.target.value)}
                  required
                  className={`w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    validationErrors.credential
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
              {validationErrors.credential && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.credential}
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-700">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign up
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
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 ">
              <button
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                Google
              </button>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}