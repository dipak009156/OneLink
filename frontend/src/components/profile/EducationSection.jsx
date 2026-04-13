const EducationSection = ({ education }) => {
  return (
    <section className="mb-6 pt-4 border-t border-black/[0.05] dark:border-white/5">
      <h2 className="text-sm font-medium text-gray-900 dark:text-slate-50 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
        Education
      </h2>
      <div className="space-y-4">
        {education && education.length > 0 ? (
          education.map(edu => (
            <div key={edu.id} className="relative pl-4 border-l-2 border-violet-200 dark:border-violet-500/30 group hover:border-violet-400 dark:hover:border-violet-400 transition-colors">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-500 shadow-[0_0_0_4px_#fff] dark:shadow-[0_0_0_4px_#030712] transition-transform group-hover:scale-125" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-50">{edu.degree}</h3>
                <p className="text-[13px] text-gray-600 dark:text-slate-400 mt-0.5">{edu.college}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 font-mono">{edu.years}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">No education listed.</p>
        )}
      </div>
    </section>
  )
}

export default EducationSection
