import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Eye, 
  MessageSquare,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
import { getFirebaseDb } from '../api/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
// FIX: Import the new, correct type
import { ApplicationHelpRequest } from '../types' 

export default function MyApplications() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  // FIX: Use the correct type for state
  const [applications, setApplications] = useState<ApplicationHelpRequest[]>([])
  const [selectedApp, setSelectedApp] = useState<ApplicationHelpRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login?returnUrl=' + encodeURIComponent('/my-applications'))
      return
    }

    setLoading(true);
    const db = getFirebaseDb();
    const q = query(collection(db, 'applicationHelpRequests'), where('userId', '==', user.id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // FIX: Use the correct type for the array
      const userApplications: ApplicationHelpRequest[] = [];
      querySnapshot.forEach((doc) => {
        userApplications.push({ id: doc.id, ...doc.data() } as ApplicationHelpRequest);
      });
      setApplications(userApplications);
      if (userApplications.length > 0 && !selectedApp) {
        setSelectedApp(userApplications[0]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [isAuthenticated, user, navigate, selectedApp])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'in-review': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'on-hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />
      case 'in-review': return <Eye className="w-4 h-4" />
      case 'in-progress': return <FileText className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'on-hold': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'essay-writing': 'Essay Writing & Editing',
      'application-review': 'Application Review',
      'interview-prep': 'Interview Preparation',
      'document-prep': 'Document Preparation',
      'timeline-planning': 'Timeline Planning',
      'comprehensive': 'Comprehensive Package'
    }
    return labels[type] || type
  }

  const getUrgencyBadge = (urgency: string) => {
    const colors: Record<string, string> = {
      'standard': 'bg-gray-100 text-gray-800',
      'priority': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    }
    return colors[urgency] || colors.standard
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-2">
              Track your application assistance requests and progress
            </p>
          </div>
          
          <button
            onClick={() => navigate('/gethelp')}
            className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </button>
        </div>

        {applications.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Applications Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Ready to get help with your scholarship applications? Submit your first request to get started.
            </p>
            <button
              onClick={() => navigate('/get-help')}
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit First Request
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Applications List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Application Requests ({applications.length})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedApp?.id === app.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''
                      }`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {getServiceTypeLabel(app.serviceType)}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              <span className="ml-1 capitalize">{app.status.replace('-', ' ')}</span>
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 capitalize">
                            {app.scholarshipType.replace('-', ' ')} • Urgency: 
                            <span className={`ml-1 px-2 py-0.5 rounded text-xs ${getUrgencyBadge(app.urgency)}`}>
                              {app.urgency}
                            </span>
                          </p>
                          
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {app.specificHelp}
                          </p>
                        </div>
                        
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-500">
                            Submitted {app.submittedAt ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                          </p>
                          {app.deadline && (
                            <p className="text-sm text-gray-600 mt-1">
                              Deadline: {new Date(app.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedApp ? (
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApp.status)}`}>
                      {getStatusIcon(selectedApp.status)}
                      <span className="ml-1 capitalize">{selectedApp.status.replace('-', ' ')}</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Service Type</h4>
                      <p className="text-sm text-gray-600">{getServiceTypeLabel(selectedApp.serviceType)}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Scholarship Type</h4>
                      <p className="text-sm text-gray-600 capitalize">{selectedApp.scholarshipType.replace('-', ' ')}</p>
                    </div>

                    {selectedApp.deadline && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Application Deadline</h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(selectedApp.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Current Status</h4>
                      <p className="text-sm text-gray-600 capitalize">{selectedApp.currentStatus.replace('-', ' ')}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Specific Help Needed</h4>
                      <p className="text-sm text-gray-600">{selectedApp.specificHelp}</p>
                    </div>

                    {selectedApp.additionalInfo && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Additional Information</h4>
                        <p className="text-sm text-gray-600">{selectedApp.additionalInfo}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Urgency Level</h4>
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getUrgencyBadge(selectedApp.urgency)}`}>
                        {selectedApp.urgency}
                      </span>
                    </div>

                    {selectedApp.estimatedCompletion && (
                        <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Estimated Completion</h4>
                        <p className="text-sm text-gray-600">
                            {new Date(selectedApp.estimatedCompletion).toLocaleDateString()}
                        </p>
                        </div>
                    )}
                  </div>

                  {/* Contact Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Need to discuss this request?</h4>
                    <div className="space-y-2">
                      <a
                        href="https://wa.me/+918283871748"
                        className="w-full inline-flex items-center justify-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WhatsApp
                      </a>
                      <a
                        href="mailto:support@xariif.site"
                        className="w-full inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Select an application to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Additional Help?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to help you throughout your scholarship journey. 
                Don't hesitate to reach out with questions or concerns.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  <span>WhatsApp: +1 (234) 567-8890</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Email: support@xariif.site</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Guide</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span><strong>Submitted:</strong> Your request has been received</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-yellow-600" />
                  <span><strong>In Review:</strong> Our team is reviewing your requirements</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-purple-600" />
                  <span><strong>In Progress:</strong> We're actively working on your application</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span><strong>Completed:</strong> Your application assistance is complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
