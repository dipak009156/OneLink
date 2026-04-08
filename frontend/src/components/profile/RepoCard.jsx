const LANGUAGE_COLORS = {
  TypeScript: 'bg-blue-100 text-blue-700',
  JavaScript: 'bg-yellow-100 text-yellow-700',
  Python: 'bg-green-100 text-green-700',
  Go: 'bg-cyan-100 text-cyan-700',
  Rust: 'bg-orange-100 text-orange-700',
  Shell: 'bg-gray-100 text-gray-600',
  default: 'bg-gray-100 text-gray-600'
}

const RepoCard = ({ repo }) => {
  const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-black/[0.05] p-4 hover:border-violet-200 hover:shadow-sm transition-all group"
    >
      <h3 className="text-sm font-medium text-gray-900 group-hover:text-violet-600 transition-colors truncate">
        {repo.name}
      </h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">
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
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 18V6l7 6-7 6zm10-6v6"/></svg>
            {repo.forks}
          </span>
        </div>
      </div>
    </a>
  )
}

export default RepoCard