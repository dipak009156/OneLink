import { Link } from 'react-router-dom'

const DevCard = ({ dev }) => {
  return (
    <Link
      to={`/u/${dev.username}`}
      className="group p-6 rounded-xl border border-black/[0.05] dark:border-white/5 bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl hover:border-violet-200 hover:shadow-sm dark:shadow-2xl dark:shadow-black/40 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${dev.profilePicture ? 'bg-gray-100 dark:bg-slate-800' : dev.avatarColor} text-white text-sm font-semibold shadow-inner`}>
          {dev.profilePicture ? (
            <img src={dev.profilePicture} alt={dev.name} className="h-full w-full object-cover" />
          ) : (
            dev.initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold group-hover:text-violet-700">{dev.name}</h3>
          <p className="text-sm text-[#737373]">{dev.title}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {dev.skills.map(skill => (
          <span key={skill} className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-300 border border-black/[0.03]">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-black/[0.04] flex items-center justify-between text-sm text-[#737373]">
        <span>{dev.repos} repos</span>
        <span className="text-green-600 font-medium tracking-tight">LeetCode: {dev.leetcode}</span>
      </div>
    </Link>
  )
}

export default DevCard