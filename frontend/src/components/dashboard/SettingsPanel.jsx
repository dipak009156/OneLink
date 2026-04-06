import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../../utils/api'

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${value ? 'bg-violet-500' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

const SettingsPanel = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [visibility, setVisibility] = useState({
    showRepos: true,
    showLeetCode: true,
    showSkills: true,
    showProjects: true,
    showExperience: true,
    showContact: false,
  })
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [usernameUpdating, setUsernameUpdating] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState(null) // null | 'success' | 'taken' | 'error'
  const [deleteStep, setDeleteStep] = useState('initial')
  const [deleteInput, setDeleteInput] = useState('')
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = await getToken()
        const res = await api.get('/api/settings/preferences', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const { preferences, username: uname, email: uemail } = res.data
        setVisibility({
          showRepos: preferences.showRepos ?? true,
          showLeetCode: preferences.showLeetCode ?? true,
          showSkills: preferences.showSkills ?? true,
          showProjects: preferences.showProjects ?? true,
          showExperience: preferences.showExperience ?? true,
          showContact: preferences.showContact ?? false,
        })
        setUsername(uname || '')
        setEmail(uemail || '')
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const toggleVisibility = (key) => {
    setVisibility(prev => ({...prev, [key]: !prev[key]}))
  }

  const handleSavePreferences = async () => {
    try {
      setSaving(true)
      setSaveStatus(null)
      const token = await getToken()
      await api.post('/api/settings/preferences', visibility, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 2000)
    } catch (err) {
      console.error('Failed to save preferences:', err)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateUsername = async () => {
    if (!username.trim()) return
    try {
      setUsernameUpdating(true)
      setUsernameStatus(null)
      const token = await getToken()
      const res = await api.put('/api/settings/username', { username: username.trim() }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsername(res.data.username)
      setUsernameStatus('success')
      setTimeout(() => setUsernameStatus(null), 2000)
    } catch (err) {
      if (err.response?.status === 409) {
        setUsernameStatus('taken')
      } else {
        setUsernameStatus('error')
      }
    } finally {
      setUsernameUpdating(false)
    }
  }

  const visibilityItems = [
    { key: 'showRepos', label: 'GitHub Repos', sub: 'Show your public repositories', icon: <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
    { key: 'showLeetCode', label: 'LeetCode Stats', sub: 'Display your problem-solving stats', icon: <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg> },
    { key: 'showSkills', label: 'Skills', sub: 'Show your technical skills', icon: <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg> },
    { key: 'showProjects', label: 'Projects', sub: 'Display your portfolio projects', icon: <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg> },
    { key: 'showExperience', label: 'Experience', sub: 'Show your work experience', icon: <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
    { key: 'showContact', label: 'Contact Button', sub: 'Allow visitors to contact you', icon: <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account preferences</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-8">

        {/* Visibility toggles */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-1 text-sm font-medium text-gray-900">Profile Visibility</h2>
          <p className="mb-4 text-xs text-gray-500">Control what visitors can see on your public profile</p>
          <div className="space-y-3">
            {visibilityItems.map(item => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border border-black/[0.03] bg-gray-50/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
                <Toggle value={visibility[item.key]} onChange={() => toggleVisibility(item.key)} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            {saveStatus === 'success' && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-600 font-medium">Failed to save</span>}
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Username */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Username</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex items-center rounded-lg border border-black/[0.05] bg-gray-50/50">
                <span className="px-4 py-2.5 text-sm text-gray-500">onelink.dev/u/</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setUsernameStatus(null) }}
                  className="flex-1 bg-transparent py-2.5 pr-4 text-sm text-gray-900 focus:outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Your profile will be at onelink.dev/u/{username}
              </p>
              {usernameStatus === 'taken' && (
                <p className="mt-1 text-xs text-red-500 font-medium">Username already taken</p>
              )}
              {usernameStatus === 'success' && (
                <p className="mt-1 text-xs text-green-500 font-medium">Username updated ✓</p>
              )}
              {usernameStatus === 'error' && (
                <p className="mt-1 text-xs text-red-500 font-medium">Failed to update</p>
              )}
            </div>
            <button
              onClick={handleUpdateUsername}
              disabled={usernameUpdating || !username.trim()}
              className="h-fit rounded-lg border border-black/[0.05] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {usernameUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Email Address</h2>
          <div className="flex items-center rounded-lg border border-black/[0.03] bg-gray-50/50 px-4 py-2.5">
            <span className="text-sm text-gray-600">{email || 'Not set'}</span>
            <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Read-only</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">Contact support to change your email address</p>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-red-100 bg-red-50/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <h2 className="text-sm font-medium text-red-700">Danger Zone</h2>
          </div>

          {deleteStep === 'initial' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Delete Account</p>
                <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setDeleteStep('confirm')}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          )}

          {deleteStep === 'confirm' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                This cannot be undone. Type <span className="font-medium">delete my account</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
                placeholder="Type 'delete my account'"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setDeleteStep('initial'); setDeleteInput('') }}
                  className="rounded-lg border border-black/[0.05] bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteInput !== 'delete my account'}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default SettingsPanel