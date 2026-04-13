import { FILTER_CHIPS } from '../../constants'

const FilterChips = ({ active, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-3xl mx-auto">
      {FILTER_CHIPS.map(chip => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className={`px-4 py-2 text-xs font-medium rounded-full transition-colors
            ${active === chip
              ? 'bg-[#0a0a0a] text-white'
              : 'border border-black/[0.03] bg-gray-50 dark:bg-slate-800/50 text-[#737373] hover:bg-violet-50 dark:bg-violet-500/10 hover:text-violet-600 dark:text-violet-400'
            }`}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

export default FilterChips