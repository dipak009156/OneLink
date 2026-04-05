import { useState } from 'react'

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${value ? 'bg-violet-500' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

const ProjectModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    liveLink: '',
    repoLink: '',
    tags: '',
    isFeatured: false,
  })

  const inputClass = "w-full rounded-lg border border-black/[0.05] bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"

  const handleSave = () => {
    onSave({
      ...form,
      id: Date.now(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-xl border border-black/[0.05] bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add New Project</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Project Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} placeholder="e.g. My Awesome Project" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`${inputClass} resize-none`} placeholder="Describe your project..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Live URL</label>
            <input type="url" value={form.liveLink} onChange={e => setForm({...form, liveLink: e.target.value})} className={inputClass} placeholder="https://myproject.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Repository URL</label>
            <input type="url" value={form.repoLink} onChange={e => setForm({...form, repoLink: e.target.value})} className={inputClass} placeholder="https://github.com/username/repo" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputClass} placeholder="React, TypeScript, Node.js" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-black/[0.03] bg-gray-50/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
              <span className="text-sm text-gray-700">Featured Project</span>
            </div>
            <Toggle value={form.isFeatured} onChange={v => setForm({...form, isFeatured: v})} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-black/[0.05] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700">Add Project</button>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal