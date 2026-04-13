const SearchBar = ({ value, onChange }) => {
  return (
    <div className="max-w-2xl mx-auto relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search developers..."
        className="w-full pl-12 pr-4 py-4 text-base rounded-full border border-black/[0.05] dark:border-white/5 bg-gray-50/30 dark:bg-[#030712] dark:selection:bg-violet-50  focus:outline-none focus:ring-1 focus:ring-violet-200"
      />
    </div>
  )
}

export default SearchBar