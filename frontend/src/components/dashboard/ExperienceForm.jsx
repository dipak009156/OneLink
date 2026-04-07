import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../../utils/api'

const ExperienceForm = () => {
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null | 'success' | 'error'
  const [status, setStatus] = useState('student')
  const [form, setForm] = useState({
    currentRole: '',
    company: '',
    degree: '',
    college: '',
    graduationYear: '',
    headline: '',
  })
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const token = await getToken()
        const res = await api.get('/api/experience', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.experience) {
          const exp = res.data.experience
          setStatus(exp.status || 'student')
          setForm({
            currentRole: exp.currentRole || '',
            company: exp.company || '',
            degree: exp.degree || '',
            college: exp.college || '',
            graduationYear: exp.graduationYear || '',
            headline: exp.headline || '',
          })
        }
      } catch (err) {
        console.error('Failed to fetch experience:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveStatus(null)
      const token = await getToken()
      await api.post('/api/experience', { ...form, status }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 2000)
    } catch (err) {
      console.error('Failed to save experience:', err)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-black/[0.05] bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"

  const statuses = [
    { id: 'student', label: 'Student', sub: 'Currently pursuing education', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg> },
    { id: 'fresher', label: 'Fresher', sub: 'Graduated, looking for roles', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
    { id: 'experience', label: 'Experience', sub: 'Professional background', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
  ]

  const showWork = status === 'experience'
  const showEducation = status === 'student' || status === 'fresher' || status === 'experience'
  // Actually, professional people also have education. Let's show both if they want, but prioritize.

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Experience</h1>
          <p className="mt-1 text-sm text-gray-500">Tell us about your professional journey</p>
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
        <h1 className="text-2xl font-semibold text-gray-900">Experience</h1>
        <p className="mt-1 text-sm text-gray-500">Tell us about your professional journey</p>
      </div>

      <div className="max-w-2xl space-y-8">

        {/* Headline */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Headline</h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Professional Headline</label>
            <input type="text" value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} className={inputClass} placeholder="Enter headline" />
          </div>
        </div>

        {/* Status selector */}
        <div className="rounded-xl border border-black/[0.05] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Current Status</h2>
          <div className="grid grid-cols-2 gap-3">
            {statuses.map(s => (
              <button
                key={s.id}
                onClick={() => setStatus(s.id)}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all duration-200
                  ${status === s.id
                    ? 'border-violet-200 bg-violet-50'
                    : 'border-black/[0.05] bg-white hover:bg-gray-50'
                  }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${status === s.id ? 'bg-violet-500' : 'bg-gray-100'}`}>
                  <span className={status === s.id ? 'text-white' : 'text-gray-500'}>{s.icon}</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${status === s.id ? 'text-violet-700' : 'text-gray-900'}`}>{s.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{s.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Work section */}
        {showWork && (
          <div className="rounded-xl border border-black/[0.05] bg-white p-6">
            <h2 className="mb-4 text-sm font-medium text-gray-900">Work Experience</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Current Role</label>
                <input type="text" value={form.currentRole} onChange={e => setForm({...form, currentRole: e.target.value})} className={inputClass} placeholder="Enter role" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Company</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputClass} placeholder="Enter company" />
              </div>
            </div>
          </div>
        )}

        {/* Education section */}
        {showEducation && (
          <div className="rounded-xl border border-black/[0.05] bg-white p-6">
            <h2 className="mb-4 text-sm font-medium text-gray-900">Education Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">College / Institution</label>
                <input type="text" value={form.college} onChange={e => setForm({...form, college: e.target.value})} className={inputClass} placeholder="Enter college" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Degree</label>
                  <input type="text" value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} className={inputClass} placeholder="Enter degree" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Graduation Year</label>
                  <input type="text" value={form.graduationYear} onChange={e => setForm({...form, graduationYear: e.target.value})} className={inputClass} placeholder="Enter graduation year" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          {saveStatus === 'success' && (
            <span className="text-sm text-green-600 font-medium">Saved ✓</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-sm text-red-600 font-medium">Failed to save</span>
          )}
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

export default ExperienceForm