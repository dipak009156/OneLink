const ProfileHero = ({ profile }) => {
  return (
    <div className="relative group bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl rounded-3xl border border-black/[0.05] dark:border-white/5 overflow-hidden p-8 text-center shadow-sm dark:shadow-2xl dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 transition-all hover:shadow-violet-500/10">
      {/* Soft Hover Glow inside card */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative flex justify-center mb-6">
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-spin-slow opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500" />
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-800 ring-4 ring-violet-50 dark:ring-violet-500/20 relative z-10 bg-violet-50 dark:bg-slate-800 flex items-center justify-center">
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-bold bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">{profile.avatarInitials}</span>
          )}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:via-violet-200 dark:to-fuchsia-200 bg-clip-text text-transparent">{profile.name}</h1>
        {profile.isOpenToWork && (
          <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-500/20">
            Open to Work
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-2">{profile.title}</p>
      <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-4">{profile.summary}</p>
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-slate-400">
        {profile.location && (
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            <span>{profile.location}</span>
          </div>
        )}
        {profile.githubUsername && (
          <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white dark:text-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProfileHero