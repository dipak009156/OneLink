const StatsBar = ({ stats }) => {
  const items = [
    { label: stats.repos === 1 ? 'Repo' : 'Repos', value: stats.repos },
    { label: stats.skills === 1 ? 'Skill' : 'Skills', value: stats.skills || 0 },
    { label: 'Role', value: stats.title || 'Developer' },
    { label: 'LeetCode', value: stats.leetcode },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(item => (
        <div key={item.label} className="bg-white rounded-xl border border-black/[0.05] p-4 text-center">
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{item.value}</p>
          <p className="text-xs text-gray-500 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsBar