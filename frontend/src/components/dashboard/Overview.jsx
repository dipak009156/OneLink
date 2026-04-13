import { useState } from 'react'
import { Link } from 'react-router-dom'

const Overview = ({ username, stats, githubConnected, leetcodeConnected }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`onelink.dev/u/${username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statsData = [
    {
      label: 'Profile Views',
      value: stats?.profileViews || '0',
      color: 'bg-violet-50 dark:bg-violet-50',
      icon: <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
    },
    {
      label: 'GitHub Repos',
      value: stats?.repos || '0',
      color: 'bg-gray-900',
      icon: <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    },
    {
      label: 'Skills',
      value: stats?.skills || '0',
      color: 'bg-cyan-500',
      icon: <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
    },
    {
      label: 'LeetCode Solved',
      value: stats?.leetcode || '0',
      color: 'bg-orange-500',
      icon: <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">Welcome back, {username}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Here's what's happening with your portfolio</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map(stat => (
          <div key={stat.label} className="group rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl p-5 transition-all duration-200 hover:border-black/[0.08] hover:shadow-sm dark:shadow-2xl dark:shadow-black/40">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-slate-50">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Public link box */}
      <div className="mb-8 rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
          <h2 className="text-sm font-medium text-gray-900 dark:text-slate-50">Your Public Profile</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center rounded-lg border border-black/[0.05] dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50 px-4 py-2.5">
            <span className="text-sm text-gray-600 dark:text-slate-300">onelink.dev/u/{username}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 transition-all hover:bg-gray-50 dark:hover:bg-white/5 dark:bg-slate-800/50"
          >
            {copied ? (
              <>
                <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copy
              </>
            )}
          </button>
          <Link
            to={`/u/${username}`}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-violet-700 hover:to-purple-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            Preview
          </Link>
        </div>
      </div>

      {/* Connected platforms */}
      <div className="rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl p-6">
        <h2 className="mb-4 text-sm font-medium text-gray-900 dark:text-slate-50">Connected Platforms</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-black/[0.03] bg-gray-50/30 dark:bg-[#030712] dark:selection:bg-violet-50  px-4 py-3">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-700 dark:text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-50">GitHub</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">@{username}</p>
              </div>
            </div>
            {githubConnected ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Connected
              </span>
            ) : (
              <button className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
                Connect
              </button>
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border border-black/[0.03] bg-gray-50/30 dark:bg-[#030712] dark:selection:bg-violet-50  px-4 py-3">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-700 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-50">LeetCode</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{leetcodeConnected ? 'Connected' : 'Not connected'}</p>
              </div>
            </div>
            {leetcodeConnected ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Connected
              </span>
            ) : (
              <button className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview