import { useState, useEffect } from 'react';
import Header from '../components/Header';
// NEW: Import the new function
import { getAllHelpRequests, updateRequestStatus, getAllContactSubmissions } from '../api/admin'; 
// NEW: Import the ContactSubmission type
import { ApplicationHelpRequest, ContactSubmission } from '../types';
import { Mail, Clock, FileText, Download } from 'lucide-react';

export default function Admin() {
  const [requests, setRequests] = useState<ApplicationHelpRequest[]>([]);
  // NEW: State for contact messages
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApplicationHelpRequest | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch both sets of data at the same time
        const [allRequests, allMessages] = await Promise.all([
            getAllHelpRequests(),
            getAllContactSubmissions()
        ]);

        setRequests(allRequests);
        setMessages(allMessages);

        if (allRequests.length > 0) {
          setSelectedRequest(allRequests[0]);
        }
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus as ApplicationHelpRequest['status'] } : req
      )
    );
    if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus as ApplicationHelpRequest['status'] });
    }

    const result = await updateRequestStatus(requestId, newStatus);
    if (!result.success) {
      setError('Failed to update status. Please try again.');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 focus:ring-blue-500'
      case 'in-review': return 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'
      case 'in-progress': return 'bg-purple-100 text-purple-800 focus:ring-purple-500'
      case 'completed': return 'bg-green-100 text-green-800 focus:ring-green-500'
      case 'on-hold': return 'bg-gray-100 text-gray-800 focus:ring-gray-500'
      default: return 'bg-gray-100 text-gray-800 focus:ring-gray-500'
    }
  }


  if (loading) {
    return (
      <div>
        <Header />
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="text-center py-20 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
                Manage help requests and view contact messages.
            </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content: Requests Table */}
            <div className="lg:col-span-2">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Application Help Requests</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Request</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.length > 0 ? (
                            requests.map((req) => (
                                <tr 
                                    key={req.id} 
                                    onClick={() => setSelectedRequest(req)}
                                    className={`cursor-pointer hover:bg-gray-50 ${selectedRequest?.id === req.id ? 'bg-teal-50' : ''}`}
                                >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{req.userName}</div>
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                        <Mail className="w-3 h-3 mr-1.5"/> {req.userEmail}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{req.serviceType}</div>
                                    <div className="text-sm text-gray-500 capitalize">{req.scholarshipType.replace('-', ' ')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                    value={req.status}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(req.id, e.target.value)
                                    }}
                                    className={`text-xs font-semibold rounded-full border-0 py-1 pl-2 pr-8 focus:ring-2 focus:ring-offset-1 capitalize ${getStatusColor(req.status)}`}
                                    >
                                    <option value="submitted">Submitted</option>
                                    <option value="in-review">In Review</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="on-hold">On Hold</option>
                                    </select>
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500">
                                No help requests have been submitted yet.
                                </td>
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Details Panel Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white shadow-sm rounded-lg p-6 sticky top-8">
                    {selectedRequest ? (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedRequest.userName}</h3>
                            <p className="text-sm text-gray-600 mb-4">{selectedRequest.userEmail}</p>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase">Submitted</h4>
                                    <p className="text-sm text-gray-800 flex items-center">
                                        <Clock className="w-4 h-4 mr-1.5"/>
                                        {selectedRequest.submittedAt ? new Date(selectedRequest.submittedAt.seconds * 1000).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase">Specific Help</h4>
                                    <p className="text-sm text-gray-800">{selectedRequest.specificHelp}</p>
                                </div>
                                {selectedRequest.uploadedDocuments && selectedRequest.uploadedDocuments.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Uploaded Documents</h4>
                                        <div className="space-y-2">
                                            {selectedRequest.uploadedDocuments.map((doc, index) => (
                                                <a
                                                    key={index}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-teal-600 font-medium"
                                                >
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    <span className="truncate flex-1">{doc.fileName}</span>
                                                    <Download className="w-4 h-4 ml-2 text-gray-400"/>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>Select a request to see details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* NEW: Contact Messages Table */}
        <div className="mt-12 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Contact Form Messages</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject & Message</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {messages.length > 0 ? (
                    messages.map((msg) => (
                        <tr key={msg.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Mail className="w-3 h-3 mr-1.5"/> {msg.email}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{msg.subject}</div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5"/>
                                {msg.submittedAt ? new Date((msg.submittedAt as any).seconds * 1000).toLocaleDateString() : 'N/A'}
                            </div>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={3} className="text-center py-10 text-gray-500">
                        No contact messages have been received yet.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
