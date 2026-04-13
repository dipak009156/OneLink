const LeetCodeSection = ({ leetcode }) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-900 dark:text-slate-50 mb-3">LeetCode Stats</h2>
      <div className="relative group overflow-hidden bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl rounded-2xl border border-black/[0.05] dark:border-white/5 p-5 hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-3 gap-3 mb-5">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20 p-3 text-center transition-all group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20">
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{leetcode.easy}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 opacity-80">Easy</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20 p-3 text-center transition-all group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20">
            <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">{leetcode.medium}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 opacity-80">Medium</p>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20 p-3 text-center transition-all group-hover:bg-red-100 dark:group-hover:bg-red-500/20">
            <p className="text-xl font-semibold text-red-600 dark:text-red-400">{leetcode.hard}</p>
            <p className="text-xs text-red-600 opacity-80">Hard</p>
          </div>
        </div>
        <div className="relative z-10 text-center pt-4 border-t border-black/[0.05] dark:border-white/5">
          <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">{leetcode.total}</p>
          <p className="text-xs font-medium tracking-wide uppercase text-gray-500 dark:text-slate-400 mt-1">Total Solved</p>
        </div>
      </div>
    </section>
  )
}

export default LeetCodeSection