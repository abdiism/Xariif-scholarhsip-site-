import React from 'react'
import { AlertCircle, CheckCircle, X } from 'lucide-react'
import { AppError } from '../types'

// The component's props have been updated to be more versatile
interface MessageProps {
  message: AppError | string
  variant: 'error' | 'success'
  onDismiss?: () => void
  className?: string
}

export default function ErrorMessage({ message, variant, onDismiss, className = '' }: MessageProps) {
  const isError = variant === 'error'

  // Styles and icon will now change based on the 'variant'
  const bgColor = isError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
  const textColor = isError ? 'text-red-800' : 'text-green-800'
  const iconColor = isError ? 'text-red-400' : 'text-green-400'
  
  const displayMessage = typeof message === 'string' ? message : message.message
  
  return (
    <div className={`border rounded-md p-4 ${bgColor} ${className}`}>
      <div className="flex items-start">
        {isError ? (
          <AlertCircle className={`w-5 h-5 ${iconColor} mt-0.5 mr-3 flex-shrink-0`} />
        ) : (
          <CheckCircle className={`w-5 h-5 ${iconColor} mt-0.5 mr-3 flex-shrink-0`} />
        )}
        <div className="flex-1">
          <p className={`text-sm ${textColor}`}>{displayMessage}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 flex-shrink-0 ${isError ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// --- This ErrorBoundary component is unchanged ---

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} />
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}