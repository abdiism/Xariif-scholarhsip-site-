import { Navigate, Outlet } from 'react-router-dom';
// FIX: Corrected the import path
import { useAuthStore } from '../store/authStore'; 
import { useEffect, useState } from 'react';
// FIX: Corrected the import path
import { getFirebaseDb } from '../api/firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (isAuthenticated && user) {
        const db = getFirebaseDb();
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };

    checkAdminRole();
  }, [user, isAuthenticated]);

  if (loading) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    // If not authenticated or not an admin, redirect to the home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and an admin, render the child route (the Admin page)
  return <Outlet />;
};

export default ProtectedRoute;
