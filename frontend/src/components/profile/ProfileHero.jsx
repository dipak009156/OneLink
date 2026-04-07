const ProfileHero = ({ profile }) => {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.05] p-8 text-center shadow-sm">
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full bg-violet-500 flex items-center justify-center">
          <span className="text-2xl font-semibold text-white">{profile.avatarInitials}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-1">
        <h1 className="text-[22px] font-medium text-gray-900">{profile.name}</h1>
        {profile.isOpenToWork && (
          <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
            Open to Work
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-2">{profile.title}</p>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">{profile.summary}</p>
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
          <span>{profile.location}</span>
        </div>
        <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  )
}

export default ProfileHero