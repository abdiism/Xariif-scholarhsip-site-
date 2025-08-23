import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults'  
import Login from './pages/Login'
import Signup from './pages/Signup'
import Favourites from './pages/Favourites'
import Blogs from './pages/Blogs'
import Profile from './pages/Profile'
import Admin from './pages/Admin';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-portal" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
