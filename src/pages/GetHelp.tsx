import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HandHeart, FileText, MessageSquare, Clock, CheckCircle, ArrowRight, Users, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
import DocumentUpload from '../components/DocumentUpload'
import { getDocumentRequirements } from '../utils/documentRequirements'
import { submitApplicationHelp } from '../api/help' // Updated API function
import { uploadUserDocument } from '../api/documents' // For file uploads

export default function GetHelp() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  
  // Form data state
  const [formData, setFormData] = useState({
    serviceType: '',
    scholarshipType: '',
    deadline: '',
    currentStatus: '',
    specificHelp: '',
    additionalInfo: '',
    urgency: 'standard',
    fullApplicationService: false
  })

  // State for file uploads and submission status
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      navigate('/login?returnUrl=' + encodeURIComponent('/get-help'))
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      // Step 1: Upload all documents to Firebase Storage
      // FIX: Explicitly type the array to resolve the TypeScript error.
      const uploadedDocumentsData: { fileName: string; url: string; requirementId: any }[] = [];
      for (const fileWrapper of uploadedFiles) {
        // The uploadUserDocument function returns the download URL
        const downloadURL = await uploadUserDocument(fileWrapper.file, user.id);
        uploadedDocumentsData.push({
          fileName: fileWrapper.file.name,
          url: downloadURL,
          requirementId: fileWrapper.requirementId, // From your DocumentUpload component
        });
      }

      // Step 2: Prepare the final request object
      const applicationRequest = {
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        ...formData,
        uploadedDocuments: uploadedDocumentsData,
      }
      
      // Step 3: Submit the form data (including document URLs) to Firestore
      const result = await submitApplicationHelp(applicationRequest);

      if (result.success) {
        // Redirect to the applications page on success
        navigate('/myapplications');
      } else {
        throw new Error('Failed to submit the application request.');
      }

    } catch (error) {
      console.error('Error submitting request:', error)
      setErrorMessage('An error occurred while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HandHeart className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get Application Help</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let our experts guide you through the scholarship application process. 
            From essay writing to document preparation, we've got you covered.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Service Description */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Offer</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <FileText className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Essay Writing & Editing</h3>
                    <p className="text-sm text-gray-600">Professional essay crafting and comprehensive editing services</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Application Review</h3>
                    <p className="text-sm text-gray-600">Complete application assessment and optimization</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Interview Preparation</h3>
                    <p className="text-sm text-gray-600">Mock interviews and personalized coaching sessions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Clock className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Timeline Management</h3>
                    <p className="text-sm text-gray-600">Strategic planning and deadline tracking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stats */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Our Success Rate</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm opacity-90">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm opacity-90">Students Helped</div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 text-teal-600 font-semibold">1</div>
                  <span>Submit your request</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 text-teal-600 font-semibold">2</div>
                  <span>Expert review & consultation</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 text-teal-600 font-semibold">3</div>
                  <span>Collaborative improvement</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 text-teal-600 font-semibold">4</div>
                  <span>Final submission ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Request Application Assistance</h2>
              
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-800 text-sm">
                      Please <button 
                        onClick={() => navigate('/login?returnUrl=' + encodeURIComponent('/get-help'))}
                        className="underline font-medium hover:text-blue-900"
                      >
                        sign in
                      </button> to submit a help request
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Full Application Service Option */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="fullApplicationService"
                      checked={formData.fullApplicationService}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">
                        Full Application Service - We Handle Everything!
                      </span>
                    </div>
                  </label>
                </div>

                {/* Service Type */}
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Assistance Needed *
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select service type</option>
                    <option value="essay-writing">Essay Writing & Editing</option>
                    <option value="application-review">Complete Application Review</option>
                    <option value="interview-prep">Interview Preparation</option>
                    <option value="document-prep">Document Preparation</option>
                    <option value="timeline-planning">Timeline & Strategy Planning</option>
                    <option value="comprehensive">Comprehensive Package</option>
                  </select>
                </div>

                {/* Scholarship Type */}
                <div>
                  <label htmlFor="scholarshipType" className="block text-sm font-medium text-gray-700 mb-2">
                    Scholarship/Program Type *
                  </label>
                  <select
                    id="scholarshipType"
                    name="scholarshipType"
                    value={formData.scholarshipType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select scholarship type</option>
                    <option value="undergraduate">Undergraduate Scholarship</option>
                    <option value="graduate">Graduate/Masters Scholarship</option>
                    <option value="phd">PhD/Doctoral Fellowship</option>
                    <option value="research">Research Fellowship</option>
                    <option value="study-abroad">Study Abroad Program</option>
                    <option value="internship">Internship Program</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Deadline and Current Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="currentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Application Status
                    </label>
                    <select
                      id="currentStatus"
                      name="currentStatus"
                      value={formData.currentStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Select status</option>
                      <option value="not-started">Haven't started yet</option>
                      <option value="research-phase">Researching opportunities</option>
                      <option value="drafting">Working on essays/documents</option>
                      <option value="review-needed">Need review before submission</option>
                      <option value="almost-ready">Almost ready to submit</option>
                    </select>
                  </div>
                </div>

                {/* Specific Help */}
                <div>
                  <label htmlFor="specificHelp" className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Areas Where You Need Help *
                  </label>
                  <textarea
                    id="specificHelp"
                    name="specificHelp"
                    value={formData.specificHelp}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Please describe what specific help you need (e.g., personal statement writing, CV review, recommendation letter guidance, interview practice, etc.)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional details about your background, target scholarships, or specific requirements"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="standard">Standard (1-2 weeks)</option>
                    <option value="priority">Priority (3-5 days) - Additional fee applies</option>
                    <option value="urgent">Urgent (24-48 hours) - Rush fee applies</option>
                  </select>
                </div>
                
                {/* Document Upload Section - Show only if Full Application Service is selected */}
                {formData.fullApplicationService && formData.scholarshipType && (
                  <DocumentUpload
                    requirements={getDocumentRequirements(formData.scholarshipType)}
                    onFilesChange={setUploadedFiles}
                    uploadedFiles={uploadedFiles}
                  />
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isAuthenticated || isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <span>Submit Help Request</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                  
                  {errorMessage && (
                    <div className="mt-4 text-center p-3 rounded-md bg-red-100 text-red-800">
                      {errorMessage}
                    </div>
                  )}
                  
                  {isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      You'll be redirected to your applications dashboard after submission
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Our Students Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <blockquote className="text-gray-600 italic mb-4">
                "XARIIF helped me secure a full scholarship to my dream university. Their essay editing was incredible!"
              </blockquote>
              <cite className="text-sm font-semibold text-gray-900">- Sarah M., Harvard Scholar</cite>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <blockquote className="text-gray-600 italic mb-4">
                "The timeline management and interview prep made all the difference. Highly recommended!"
              </blockquote>
              <cite className="text-sm font-semibold text-gray-900">- David L., Fulbright Recipient</cite>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <blockquote className="text-gray-600 italic mb-4">
                "Professional, responsive, and results-driven. I couldn't have done it without their support."
              </blockquote>
              <cite className="text-sm font-semibold text-gray-900">- Maria R., Rhodes Scholar</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
