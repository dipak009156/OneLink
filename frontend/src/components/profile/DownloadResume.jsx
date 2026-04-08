import { useState } from 'react'
import api from '../../utils/api'

const DownloadResume = ({ username }) => {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      // We use the direct window.open or a blob download for the binary PDF
      // Since it's a GET request, window.location.href is the simplest way to trigger browser download
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/resume/download/${username}`
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to generate resume. Please try again.')
    } finally {
      // Small timeout to reset loading since window.location doesn't provide a callback for download initiated
      setTimeout(() => setLoading(false), 3000)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed z-50`}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Generating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
          </svg>
          Download Resume
        </>
      )}
    </button>
  )
}

export default DownloadResume