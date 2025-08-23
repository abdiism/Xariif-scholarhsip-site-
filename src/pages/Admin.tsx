import { useEffect } from 'react';

export default function Admin() {
  useEffect(() => {
    // Redirect to the actual admin interface
    window.location.href = '/admin/';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Redirecting to Admin Panel...</h1>
        <p className="text-gray-600">Please wait a moment.</p>
      </div>
    </div>
  );
}