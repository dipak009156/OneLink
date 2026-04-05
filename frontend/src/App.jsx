import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'

import Landing from './pages/Landing'
// import Explore from './pages/Explore'
import Dashboard from './pages/Dashboard'
// import PublicProfile from './pages/PublicProfile'

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    if (isSignedIn && user) {
      axios.post('http://localhost:4000/api/users/sync', {
        clerkId: user.id,
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress,
      }).catch((err) => console.error('User sync failed:', err))
    }
  }, [isSignedIn, user])

  if (!isLoaded) return null

  if (!isSignedIn) return <Navigate to="/" />

  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/explore" element={<Explore />} />
        <Route path="/u/:username" element={<PublicProfile />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App