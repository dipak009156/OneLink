const LANGUAGE_COLORS = {
  TypeScript: 'bg-blue-100 text-blue-700',
  JavaScript: 'bg-yellow-100 text-yellow-700',
  Python: 'bg-green-100 text-green-700',
  Go: 'bg-cyan-100 text-cyan-700',
  Rust: 'bg-orange-100 text-orange-700',
  Shell: 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300',
  default: 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
}

const RepoCard = ({ repo }) => {
  const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl rounded-2xl border border-black/[0.05] dark:border-white/5 p-5 hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <h3 className="text-sm font-medium text-gray-900 dark:text-slate-50 group-hover:text-violet-600 dark:text-violet-400 transition-colors truncate">
        {repo.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">
        {repo.description}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${langColor}`}>
          {repo.language}
        </span>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
            {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M6 8v2a4 4 0 004 4h4a4 4 0 004-4V8M12 14v4"/></svg>
            {repo.forks}
          </span>
        </div>
      </div>
    </a>
  )
}

export default RepoCard