const LeetCodeSection = ({ leetcode }) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-900 mb-3">LeetCode Stats</h2>
      <div className="bg-white rounded-xl border border-black/[0.05] p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-center">
            <p className="text-xl font-semibold text-emerald-600">{leetcode.easy}</p>
            <p className="text-xs text-emerald-600 opacity-80">Easy</p>
          </div>
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 text-center">
            <p className="text-xl font-semibold text-amber-600">{leetcode.medium}</p>
            <p className="text-xs text-amber-600 opacity-80">Medium</p>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-3 text-center">
            <p className="text-xl font-semibold text-red-600">{leetcode.hard}</p>
            <p className="text-xs text-red-600 opacity-80">Hard</p>
          </div>
        </div>
        <div className="text-center pt-3 border-t border-black/[0.05]">
          <p className="text-lg font-semibold text-gray-900">{leetcode.total}</p>
          <p className="text-xs text-gray-500">Total Solved</p>
        </div>
      </div>
    </section>
  )
}

export default LeetCodeSection