import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../../utils/api'
import ProjectModal from './ProjectModal'

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const { getToken } = useAuth()

    const fetchProjects = async () => {
        try {
            const token = await getToken()
            const res = await api.get('/api/projects', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setProjects(res.data.projects)
        } catch (err) {
            console.error('Failed to fetch projects:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleDelete = async (id) => {
        try {
            const token = await getToken()
            await api.delete(`/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setProjects(projects.filter(p => p._id !== id))
        } catch (err) {
            console.error('Failed to delete project:', err)
        }
    }

    const handleToggleFeatured = async (id) => {
        const project = projects.find(p => p._id === id)
        if (!project) return
        try {
            const token = await getToken()
            const res = await api.put(`/api/projects/${id}`, { isFeatured: !project.isFeatured }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setProjects(projects.map(p => p._id === id ? res.data.project : p))
        } catch (err) {
            console.error('Failed to toggle featured:', err)
        }
    }

    const handleAdd = async (projectData) => {
        try {
            const token = await getToken()
            const res = await api.post('/api/projects', projectData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setProjects([...projects, res.data.project])
        } catch (err) {
            console.error('Failed to add project:', err)
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
                    <p className="mt-1 text-sm text-gray-500">Showcase your best work</p>
                </div>
                <div className="flex items-center justify-center py-16">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
                    <p className="mt-1 text-sm text-gray-500">Showcase your best work</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-black/[0.08] bg-white p-12 text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <p className="mt-3 text-sm font-medium text-gray-900">No projects yet</p>
                    <p className="mt-1 text-xs text-gray-500">Add your first project to showcase your work</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Project
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map(project => (
                        <div key={project._id} className="group rounded-xl border border-black/[0.05] bg-white p-6 transition-all duration-200 hover:border-black/[0.08] hover:shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-base font-medium text-gray-900">{project.name}</h3>
                                        {project.isFeatured && (
                                            <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{project.description}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => handleToggleFeatured(project._id)}
                                        className={`rounded-lg p-2 transition-colors ${project.isFeatured ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                    >
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="rounded-lg bg-gray-50 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-4">
                                {project.liveLink && (
                                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700">
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        Live Demo
                                    </a>
                                )}
                                {project.repoLink && (
                                    <a href={project.repoLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">
                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                        View Code
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <ProjectModal
                    onClose={() => setShowModal(false)}
                    onSave={handleAdd}
                />
            )}
        </div>
    )
}

export default Projects