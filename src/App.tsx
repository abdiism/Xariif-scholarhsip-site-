import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults' 
import Login from './pages/Login'
import Signup from './pages/Signup'
import Favourites from './pages/Favourites'
import Blogs from './pages/Blogs'
import Profile from './pages/Profile'
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import GetHelp from './pages/GetHelp';
import MyApplications from './pages/MyApplications';

// Import the ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gethelp" element={<GetHelp />} />
        <Route path="/myapplications" element={<MyApplications />} />

        {/* Protected Admin Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-portal" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
