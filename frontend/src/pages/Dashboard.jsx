import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import Navbar from '../components/layout/Navbar'
import Overview from '../components/dashboard/Overview'
import EditProfile from '../components/dashboard/EditProfile'
import Projects from '../components/dashboard/Projects'
import ExperienceForm from '../components/dashboard/ExperienceForm'
import SettingsPanel from '../components/dashboard/SettingsPanel'
import api from '../utils/api'

const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    id: 'edit-profile',
    label: 'Edit Profile',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
  },
]

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { getToken } = useAuth()
  const { user } = useUser()

  const username = user?.username || ''
  const name = user?.fullName || user?.username || ''
  const initials = name ? name.substring(0, 2).toUpperCase() : 'U'

  // Platform stats state
  const [stats, setStats] = useState({
    profileViews: '0',
    repos: 0,
    skills: 0,
    leetcode: 0,
  })
  const [githubConnected, setGithubConnected] = useState(false)
  const [leetcodeConnected, setLeetcodeConnected] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')

  const fetchProfile = useCallback(async () => {
    if (!username) return
    try {
      const res = await api.get(`/api/users/u/${username}`)
      if (res.data?.user?.profilePicture) {
        setProfilePicture(res.data.user.profilePicture)
      }
      if (res.data?.profile) {
        setStats(prev => ({ ...prev, skills: res.data.profile.skills?.length || 0 }))
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }, [username])

  const fetchStats = useCallback(async () => {
    try {
      const token = await getToken()
      if (!token) return

      const res = await api.get('/api/platform/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { github, leetcode } = res.data

      setGithubConnected(!!github)
      setLeetcodeConnected(!!leetcode)

      setStats(prev => ({
        ...prev,
        repos: github?.repos?.length || 0,
        leetcode: leetcode?.totalSolved || 0,
      }))
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [getToken])

  useEffect(() => {
    fetchStats()
    fetchProfile()
  }, [fetchStats, fetchProfile])

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return (
        <Overview
          username={username}
          stats={stats}
          githubConnected={githubConnected}
          leetcodeConnected={leetcodeConnected}
        />
      )
      case 'edit-profile': return <EditProfile refreshStats={() => { fetchStats(); fetchProfile(); }} />
      case 'projects': return <Projects />
      case 'experience': return <ExperienceForm />
      case 'settings': return <SettingsPanel />
      default: return (
        <Overview
          username={username}
          stats={stats}
          githubConnected={githubConnected}
          leetcodeConnected={leetcodeConnected}
        />
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-[#030712] dark:selection:bg-violet-50 ">
      <Navbar />

      <div className="flex">

        {/* Sidebar */}
        <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64 border-r border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl">
          <div className="flex h-full flex-col">

            {/* Nav items */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border
                    ${activeTab === item.id
                      ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 border-violet-200'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 dark:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white dark:text-slate-50 border-transparent'
                    }`}
                >
                  <span className={activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User section */}
            <div className="border-t border-black/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-violet-50 dark:bg-violet-50 text-sm font-medium text-white shadow-inner">
                  {profilePicture ? (
                    <img src={profilePicture} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-50 truncate">{name}</p>
                  <Link
                    to={`/u/${username}`}
                    className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 hover:text-violet-600 dark:text-violet-400 transition-colors"
                  >
                    View My Profile
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-1 min-h-[calc(100vh-64px)]">
          {renderTab()}
        </main>

      </div>
    </div>
  )
}

export default Dashboard