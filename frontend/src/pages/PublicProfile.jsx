import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../utils/api'
import Navbar from '../components/layout/Navbar'
import ProfileHero from '../components/profile/ProfileHero'
import StatsBar from '../components/profile/StatsBar'
import ReposSection from '../components/profile/RepoSection'
import SkillsSection from '../components/profile/SkillsSection'
import LeetCodeSection from '../components/profile/LeetCodeSection'
import ProjectsSection from '../components/profile/ProjectsSection'
import ExperienceSection from '../components/profile/ExperienceSection'
import ContactCTA from '../components/profile/ContactCTA'
import DownloadResume from '../components/profile/DownloadResume'

const DEMO_DATA = { /* Keeping DEMO_DATA as fallback or you can remove later, we won't use it */ }

const PublicProfile = () => {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/users/u/${username}`)
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Profile not found')
      } finally {
        setLoading(false)
      }
    }
    if (username) fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-500">{error || 'Profile not found'}</p>
        </div>
      </div>
    )
  }

  const { user, profile, preferences, projects, experience, github, leetcode } = data

  const displayProfile = {
    name: profile?.name || user.username,
    title: profile?.title || '',
    summary: profile?.summary || '',
    location: profile?.location || '',
    githubUsername: profile?.githubUsername || '',
    isOpenToWork: profile?.isOpenToWork || false,
    avatarInitials: (profile?.name || user.username).substring(0, 2).toUpperCase(),
    email: preferences?.showContact ? user.email : ''
  }

  const formatStatus = (status) => {
    if (!status) return 'Developer'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const stats = {
    repos: github?.repos?.length || 0,
    skills: github?.languages?.length || 0,
    title: profile?.title || 'Developer',
    leetcode: leetcode?.totalSolved || 0
  }

  const repos = github?.repos || []
  const skills = github?.languages || []
  const lcStats = {
    easy: leetcode?.easySolved || 0,
    medium: leetcode?.mediumSolved || 0,
    hard: leetcode?.hardSolved || 0,
    total: leetcode?.totalSolved || 0
  }

  const expItem = experience?.[0]
  const expData = expItem ? {
    role: expItem.currentRole || expItem.degree || 'Developer',
    company: expItem.company || expItem.college || '',
    years: expItem.status === 'experience' 
      ? 'Professional' 
      : (expItem.status === 'fresher' ? 'Graduate' : (expItem.graduationYear ? `Class of ${expItem.graduationYear}` : 'Student'))
  } : null

  return (
    <div className="min-h-screen bg-gray-50/30 text-gray-900">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
        <ProfileHero profile={displayProfile} />
        <StatsBar stats={stats} />
        {preferences?.showRepos !== false && <ReposSection repos={repos} />}
        {preferences?.showSkills !== false && <SkillsSection skills={skills} />}
        {preferences?.showLeetCode !== false && <LeetCodeSection leetcode={lcStats} />}
        {preferences?.showProjects !== false && <ProjectsSection projects={projects || []} />}
        {preferences?.showExperience !== false && <ExperienceSection experience={expData} />}
        {preferences?.showContact !== false && <ContactCTA name={displayProfile.name} email={displayProfile.email} />}
      </div>
      <DownloadResume username={username} />
    </div>
  )
}

export default PublicProfile