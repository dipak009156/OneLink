import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../../utils/api'

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${value ? 'bg-violet-500' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

const EditProfile = ({ refreshStats }) => {
  const { user } = useUser()
  const { getToken } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [location, setLocation] = useState('')
  const [openToWork, setOpenToWork] = useState(false)
  const [theme, setTheme] = useState('light')
  const [githubUsername, setGithubUsername] = useState('')
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [personalWebsite, setPersonalWebsite] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [githubConnecting, setGithubConnecting] = useState(false)
  const [githubStatus, setGithubStatus] = useState(null)
  const [leetcodeConnecting, setLeetcodeConnecting] = useState(false)
  const [leetcodeStatus, setLeetcodeStatus] = useState(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.username) return
      try {
        const res = await api.get(`/api/users/u/${user.username}`)
        if (res.data?.profile) {
          const { profile } = res.data
          setName(profile.name || '')
          setTitle(profile.title || '')
          setSummary(profile.summary || '')
          setLocation(profile.location || '')
          setOpenToWork(profile.isOpenToWork || false)
          setTheme(profile.theme || 'light')
          setGithubUsername(profile.githubUsername || '')
          setLeetcodeUsername(profile.leetcodeUsername || '')
          setPersonalWebsite(profile.personalWebsite || '')
        }

        if (res.data?.user?.profilePicture) {
          setProfilePicture(res.data.user.profilePicture)
        } else {
          setProfilePicture('')
        }
        
        if (!res.data?.profile) {
          // If no profile, prepopulate name from Clerk
          setName(user.fullName || user.username || '')
        }
      } catch (err) {
        console.error('Failed to load profile data:', err)
        setName(user.fullName || user.username || '')
      } finally {
        setLoading(false)
      }
    }
    fetchProfileData()
  }, [user?.username])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Basic validation
    if (file.size > 2 * 1024 * 1024) {
      alert('File size too large. Max 2MB.')
      return
    }

    try {
      setIsUploading(true)
      const token = await getToken()
      
      const formData = new FormData()
      formData.append('profilePicture', file)

      const res = await api.post('/api/users/profile-picture', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setProfilePicture(res.data.profilePicture)
      alert('Photo uploaded successfully!')
      if (refreshStats) refreshStats()
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Failed to upload photo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleConnectGitHub = async () => {
    if (!githubUsername.trim()) return
    try {
      setGithubConnecting(true)
      setGithubStatus(null)
      const token = await getToken()
      await api.post('/api/platform/connect/github', { githubUsername: githubUsername.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGithubStatus('success')
      if (refreshStats) refreshStats()
    } catch (err) {
      console.error('GitHub connect failed:', err)
      setGithubStatus('error')
    } finally {
      setGithubConnecting(false)
    }
  }

  const handleConnectLeetCode = async () => {
    if (!leetcodeUsername.trim()) return
    try {
      setLeetcodeConnecting(true)
      setLeetcodeStatus(null)
      const token = await getToken()
      await api.post('/api/platform/connect/leetcode', { leetcodeUsername: leetcodeUsername.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeetcodeStatus('success')
      if (refreshStats) refreshStats()
    } catch (err) {
      console.error('LeetCode connect failed:', err)
      setLeetcodeStatus('error')
    } finally {
      setLeetcodeConnecting(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const token = await getToken()
      
      if (!token) {
        alert('Authentication failed: Could not get Clerk session token. Please try logging out and in again.')
        setIsSaving(false)
        return
      }
      
      await api.post('/api/users/profile', {
        name,
        title,
        summary,
        location,
        isOpenToWork: openToWork,
        theme,
        githubUsername,
        leetcodeUsername,
        personalWebsite: personalWebsite.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      alert('Profile saved successfully!')
    } catch (err) {
      console.error('Failed to save profile:', err)
      alert('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-black/[0.05] bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"

  const themes = [
    { id: 'light', label: 'Light', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
    { id: 'dark', label: 'Dark', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg> },
    { id: 'matrix', label: 'Matrix', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
  ]

  const initials = name 
    ? name.substring(0, 2).toUpperCase() 
    : (user?.username ? user.username.substring(0, 2).toUpperCase() : 'U')

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Update your portfolio information</p>
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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Update your portfolio information</p>
      </div>

      <div className="max-w-2xl space-y-8">

        {/* Profile photo */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-violet-500 text-2xl font-medium text-white shadow-inner">
                {profilePicture ? (
                  <img src={profilePicture} alt={name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <label 
                htmlFor="photo-upload" 
                className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-black/[0.1] bg-white shadow-sm transition-all hover:bg-gray-50 hover:scale-110 active:scale-95"
              >
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>
                <input 
                  id="photo-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div>
              <label 
                htmlFor="photo-upload-btn" 
                className={`inline-block cursor-pointer rounded-lg border border-black/[0.05] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:bg-gray-100 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isUploading ? 'Uploading...' : 'Upload Photo'}
                <input 
                  id="photo-upload-btn" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Enter name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Enter title (e.g. Frontend Developer)" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Summary</label>
              <textarea rows="3" value={summary} onChange={e => setSummary(e.target.value)} className={`${inputClass} resize-none`} placeholder="Write a brief summary about yourself..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} placeholder="Enter city" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Personal Website</label>
              <input type="url" value={personalWebsite} onChange={e => setPersonalWebsite(e.target.value)} className={inputClass} placeholder="https://yourportfolio.com" />
            </div>
          </div>
        </div>

        {/* Open to work */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900">Open to Work</h2>
              <p className="mt-0.5 text-xs text-gray-500">Show that you're available for opportunities</p>
            </div>
            <Toggle value={openToWork} onChange={setOpenToWork} />
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Portfolio Theme</h2>
          <div className="flex gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200
                  ${theme === t.id
                    ? 'border-violet-200 bg-violet-50 text-violet-700'
                    : 'border-black/[0.05] bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Connected accounts */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Connected Accounts</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub Username
              </label>
              <div className="flex gap-3">
                <input type="text" value={githubUsername} onChange={e => setGithubUsername(e.target.value)} className={`flex-1 ${inputClass}`} placeholder="Enter GitHub username" />
                <button
                  onClick={handleConnectGitHub}
                  disabled={githubConnecting || !githubUsername.trim()}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    githubStatus === 'success'
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : githubStatus === 'error'
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-black/[0.05] bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {githubConnecting ? 'Connecting...' : githubStatus === 'success' ? 'Connected ✓' : githubStatus === 'error' ? 'Failed ✕' : 'Connect'}
                </button>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                LeetCode Username
              </label>
              <div className="flex gap-3">
                <input type="text" value={leetcodeUsername} onChange={e => setLeetcodeUsername(e.target.value)} className={`flex-1 ${inputClass}`} placeholder="Enter LeetCode username" />
                <button
                  onClick={handleConnectLeetCode}
                  disabled={leetcodeConnecting || !leetcodeUsername.trim()}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    leetcodeStatus === 'success'
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : leetcodeStatus === 'error'
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-black/[0.05] bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {leetcodeConnecting ? 'Connecting...' : leetcodeStatus === 'success' ? 'Connected ✓' : leetcodeStatus === 'error' ? 'Failed ✕' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      </div>
    </div>
  )
}

export default EditProfile