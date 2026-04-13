import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../../utils/api'

const ExperienceForm = () => {
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null | 'success' | 'error'
  const [status, setStatus] = useState('fresher')
  const [form, setForm] = useState({
    degree: '',
    college: '',
    graduationYear: '',
    headline: '',
    cgpa: '',
    workExperiences: [],
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
          
          let initialWorkExperiences = Array.isArray(exp.workExperiences) ? exp.workExperiences : []
          if (initialWorkExperiences.length === 0 && exp.currentRole) {
            initialWorkExperiences = [{
              currentRole: exp.currentRole || '',
              company: exp.company || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              currentlyWorking: exp.currentlyWorking || false,
              experienceType: exp.experienceType || 'Full-time',
            }]
          }

          setStatus(exp.status === 'student' ? 'fresher' : (exp.status || 'fresher'))
          setForm({
            degree: exp.degree || '',
            college: exp.college || '',
            graduationYear: exp.graduationYear || '',
            headline: exp.headline || '',
            cgpa: exp.cgpa || '',
            workExperiences: initialWorkExperiences,
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

  const handleAddExperience = () => {
    setForm(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, {
        currentRole: '',
        company: '',
        experienceType: 'Full-time',
        currentlyWorking: false,
        startDate: '',
        endDate: ''
      }]
    }))
  }

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...form.workExperiences]
    updated[index][field] = value
    setForm({ ...form, workExperiences: updated })
  }

  const handleRemoveExperience = (index) => {
    const updated = form.workExperiences.filter((_, i) => i !== index)
    setForm({ ...form, workExperiences: updated })
  }

  const inputClass = "w-full rounded-lg border border-black/[0.05] dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-gray-900 dark:text-slate-50 transition-all focus:border-violet-300 focus:bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-violet-100"

  const statuses = [
    { id: 'fresher', label: 'Fresher', sub: 'Looking for initial roles', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
    { id: 'experience', label: 'Experience', sub: 'Professional background', icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
  ]

  const showWork = status === 'experience'
  const showEducation = true // Education always shown for both fresher and experience

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">Experience</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Tell us about your professional journey</p>
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">Experience</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Tell us about your professional journey</p>
      </div>

      <div className="max-w-2xl space-y-8">

        {/* Headline */}
        <div className="rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900 dark:text-slate-50">Headline</h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">Professional Headline</label>
            <input type="text" value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} className={inputClass} placeholder="Enter headline" />
          </div>
        </div>

        {/* Status selector */}
        <div className="rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900 dark:text-slate-50">Current Status</h2>
          <div className="grid grid-cols-2 gap-3">
            {statuses.map(s => (
              <button
                key={s.id}
                onClick={() => setStatus(s.id)}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all duration-200
                  ${status === s.id
                    ? 'border-violet-200 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${status === s.id ? 'bg-violet-500' : 'bg-gray-100 dark:bg-slate-800'}`}>
                  <span className={status === s.id ? 'text-white' : 'text-gray-500 dark:text-slate-400'}>{s.icon}</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${status === s.id ? 'text-violet-700' : 'text-gray-900 dark:text-slate-50'}`}>{s.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{s.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Education section */}
        {showEducation && (
          <div className="rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl p-6">
            <h2 className="mb-4 text-sm font-medium text-gray-900 dark:text-slate-50">Education Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">College / Institution</label>
                <input type="text" value={form.college} onChange={e => setForm({...form, college: e.target.value})} className={inputClass} placeholder="Enter college" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">Degree</label>
                  <input type="text" value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} className={inputClass} placeholder="Enter degree" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">Graduation Year</label>
                  <input type="text" value={form.graduationYear} onChange={e => setForm({...form, graduationYear: e.target.value})} className={inputClass} placeholder="Enter graduation year" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">CGPA / Grade (Optional)</label>
                <input type="text" value={form.cgpa} onChange={e => setForm({...form, cgpa: e.target.value})} className={inputClass} placeholder="e.g. 8.7 or 90%" />
              </div>
            </div>
          </div>
        )}

        {/* Work section */}
        {showWork && (
          <div className="rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-900 dark:text-slate-50">Work Experience</h2>
              <button 
                onClick={handleAddExperience}
                className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 flex items-center gap-1"
              >
                <span>+</span> Add Experience
              </button>
            </div>
            
            {form.workExperiences.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-200 dark:border-white/10 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-slate-400">No work experience added yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {form.workExperiences.map((exp, index) => (
                  <div key={index} className="relative p-4 border border-gray-100 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-slate-800/30">
                    <button 
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-600 dark:text-red-400 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <div className="space-y-4">
                      <div className="pr-8">
                        <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">Role</label>
                        <input type="text" value={exp.currentRole} onChange={e => handleUpdateExperience(index, 'currentRole', e.target.value)} className={inputClass} placeholder="Enter role" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">Company</label>
                        <input type="text" value={exp.company} onChange={e => handleUpdateExperience(index, 'company', e.target.value)} className={inputClass} placeholder="Enter company" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">Experience Type</label>
                          <select 
                            value={exp.experienceType} 
                            onChange={e => handleUpdateExperience(index, 'experienceType', e.target.value)} 
                            className={inputClass}
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input 
                            type="checkbox" 
                            id={`currentlyWorking-${index}`}
                            checked={exp.currentlyWorking} 
                            onChange={e => handleUpdateExperience(index, 'currentlyWorking', e.target.checked)} 
                            className="h-4 w-4 rounded border-gray-300 text-violet-600 dark:text-violet-400 focus:ring-violet-500"
                          />
                          <label htmlFor={`currentlyWorking-${index}`} className="text-xs font-medium text-gray-700 dark:text-slate-200">Currently working here</label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">Start Date</label>
                          <input type="text" value={exp.startDate} onChange={e => handleUpdateExperience(index, 'startDate', e.target.value)} className={inputClass} placeholder="MM/YYYY" />
                        </div>
                        {!exp.currentlyWorking && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">End Date</label>
                            <input type="text" value={exp.endDate} onChange={e => handleUpdateExperience(index, 'endDate', e.target.value)} className={inputClass} placeholder="MM/YYYY" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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