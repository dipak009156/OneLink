import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../utils/api'
import Navbar from '../components/layout/Navbar'
import ProfileHero from '../components/profile/ProfileHero'
import ReposSection from '../components/profile/RepoSection'
import SkillsSection from '../components/profile/SkillsSection'
import LeetCodeSection from '../components/profile/LeetCodeSection'
import ProjectsSection from '../components/profile/ProjectsSection'
import ExperienceSection from '../components/profile/ExperienceSection'
import EducationSection from '../components/profile/EducationSection'
import ContactCTA from '../components/profile/ContactCTA'
import DownloadResume from '../components/profile/DownloadResume'

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
      <div className="min-h-screen bg-gray-50/30 dark:bg-[#030712] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2">Oops!</h2>
          <p className="text-gray-500 dark:text-slate-400">{error || 'Profile not found'}</p>
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
    profilePicture: user.profilePicture,
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
  const skills = profile?.skills || []
  const lcStats = {
    easy: leetcode?.easySolved || 0,
    medium: leetcode?.mediumSolved || 0,
    hard: leetcode?.hardSolved || 0,
    total: leetcode?.totalSolved || 0
  }

  const expItem = experience?.[0]
  let expList = []
  let eduList = []
  if (expItem) {
    if (expItem.workExperiences && expItem.workExperiences.length > 0) {
      expList = expItem.workExperiences.map((w, idx) => ({
        id: `work-${idx}`,
        role: w.currentRole || 'Professional',
        company: w.company || '',
        years: `${w.startDate || ''} - ${w.currentlyWorking ? 'Present' : (w.endDate || '')}`.replace(/^- | -$/g, '').trim() || 'Professional'
      }))
    }
    if (expItem.degree && expItem.college) {
      eduList.push({
        id: 'edu',
        degree: expItem.degree,
        college: expItem.college,
        years: expItem.graduationYear ? `Class of ${expItem.graduationYear}` : 'Graduate'
      })
    }
    
    // Fallback if they have old data without workExperiences array
    if (expList.length === 0 && expItem.currentRole) {
      expList.push({
        id: 'legacy-work',
        role: expItem.currentRole,
        company: expItem.company,
        years: expItem.status === 'experience' ? 'Professional' : 'Graduate'
      })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50/30 dark:bg-[#030712] dark:selection:bg-violet-500/30 text-gray-900 dark:text-slate-50 transition-all duration-300">
      {/* Aurora Glow Mesh */}
      <div className="absolute top-0 -left-1/4 w-[150%] max-w-7xl h-[600px] bg-gradient-to-b from-violet-400/20 via-fuchsia-400/10 to-transparent blur-[120px] -z-10 animate-pulse rounded-full opacity-50 dark:opacity-40 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-40 right-0 w-[80%] max-w-5xl h-[500px] bg-gradient-to-l from-indigo-500/10 to-transparent blur-[100px] -z-10 rounded-full opacity-60 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      
      <div className="relative z-0">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
        <ProfileHero profile={displayProfile} />
        {preferences?.showRepos !== false && <ReposSection repos={repos} />}
        {preferences?.showSkills !== false && <SkillsSection skills={skills} />}
        {preferences?.showLeetCode !== false && <LeetCodeSection leetcode={lcStats} />}
        {preferences?.showProjects !== false && <ProjectsSection projects={projects || []} />}
          {preferences?.showExperience !== false && <ExperienceSection experience={expList} />}
          {preferences?.showExperience !== false && <EducationSection education={eduList} />}
          {preferences?.showContact === true && <ContactCTA name={displayProfile.name} email={displayProfile.email} />}
        </div>
        <DownloadResume username={username} />
      </div>
    </div>
  )
}

export default PublicProfile