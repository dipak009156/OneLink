import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import api from './utils/api'
import { ThemeProvider } from './context/ThemeContext'
import { initializeSentinelSession } from './utils/sentinelClient'

import Landing from './pages/Landing'
import Explore from './pages/Explore'
import Dashboard from './pages/Dashboard'
import PublicProfile from './pages/PublicProfile'
import DemoProfile from './pages/DemoProfile'

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    if (isSignedIn && user) {
      getToken().then(token => {
        // Bind Sentinel session to this authenticated user
        initializeSentinelSession(user.id, token)

        // Get current telemetry snapshot for the login event
        const telemetry = window.sentinel?.getTelemetry?.() || {}

        api.post('/api/users/sync', {
          username: user.username,
          email: user.primaryEmailAddress?.emailAddress,
          sentinelTelemetry: {
            device:     telemetry.device     || {},
            behavioral: telemetry.behavioral || {},
          }
        }, {
          headers: {
            Authorization:    `Bearer ${token}`,
            'x-session-id':   window.sentinel?.sessionId || token.slice(-64),
          }
        }).catch((err) => console.error('User sync failed:', err))
      })
    }
  }, [isSignedIn, user])


  if (!isLoaded) return null

  if (!isSignedIn) return <Navigate to="/" />

  return children
}

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/demo" element={<DemoProfile />} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App