import { useState } from 'react'
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react'
import { DocumentRequirement } from '../utils/documentRequirements'

interface UploadedFile {
  id: string
  file: File
  requirementId: string
  status: 'pending' | 'uploaded' | 'error'
}

interface DocumentUploadProps {
  requirements: DocumentRequirement[]
  onFilesChange: (files: UploadedFile[]) => void
  uploadedFiles: UploadedFile[]
}

export default function DocumentUpload({ requirements, onFilesChange, uploadedFiles }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (files: FileList | null, requirementId: string) => {
    if (!files) return

    const newFiles: UploadedFile[] = []
    
    Array.from(files).forEach((file) => {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert(`${file.name} is not a PDF file. Please upload PDF files only.`)
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Please upload files smaller than 10MB.`)
        return
      }

      const uploadedFile: UploadedFile = {
        id: `${requirementId}-${Date.now()}-${Math.random()}`,
        file,
        requirementId,
        status: 'uploaded'
      }
      
      newFiles.push(uploadedFile)
    })

    const updatedFiles = [...uploadedFiles, ...newFiles]
    onFilesChange(updatedFiles)
  }

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId)
    onFilesChange(updatedFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent, requirementId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, requirementId)
    }
  }

  const getFilesForRequirement = (requirementId: string) => {
    return uploadedFiles.filter(f => f.requirementId === requirementId)
  }

  const isRequirementFulfilled = (requirement: DocumentRequirement) => {
    const files = getFilesForRequirement(requirement.id)
    return !requirement.required || files.length > 0
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Full Application Service</h3>
            <p className="text-sm text-blue-800">
              We will handle your entire scholarship application process. Please upload the required documents below. 
              We will prepare missing documents (essays, statements) and guide you through any additional requirements 
              like interviews or verification codes.
            </p>
          </div>
        </div>
      </div>

      {requirements.map((requirement) => {
        const files = getFilesForRequirement(requirement.id)
        const isFulfilled = isRequirementFulfilled(requirement)
        
        return (
          <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900">{requirement.name}</h3>
                  {requirement.required && (
                    <span className="text-xs text-red-600 font-medium">Required</span>
                  )}
                  {isFulfilled && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{requirement.description}</p>
                <p className="text-xs text-gray-500">Accepted formats: {requirement.acceptedFormats.join(', ')}</p>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-teal-400 bg-teal-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, requirement.id)}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop PDF files here, or{' '}
                <label className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium">
                  browse to upload
                  <input
                    type="file"
                    multiple
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, requirement.id)}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">PDF files only, max 10MB each</p>
            </div>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm text-gray-900">{file.file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Additional Documents Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Additional Documents (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload any additional documents that might be relevant to your application
        </p>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-teal-400 bg-teal-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, 'additional')}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            <label className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium">
              Upload additional documents
              <input
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files, 'additional')}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500">PDF files only</p>
        </div>

        {/* Additional Files */}
        {getFilesForRequirement('additional').length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Additional Files:</h4>
            {getFilesForRequirement('additional').map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-900">{file.file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({(file.file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Upload Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Required Documents</p>
            <p className="text-sm font-medium text-gray-900">
              {requirements.filter(r => r.required && isRequirementFulfilled(r)).length} / {requirements.filter(r => r.required).length} Complete
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Files</p>
            <p className="text-sm font-medium text-gray-900">{uploadedFiles.length} Uploaded</p>
          </div>
        </div>
      </div>
    </div>
  )
}
