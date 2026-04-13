const SkillsSection = ({ skills }) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-900 dark:text-slate-50 mb-3">Skills</h2>
      <div className="relative group overflow-hidden bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl rounded-2xl border border-black/[0.05] dark:border-white/5 p-5 hover:border-violet-300 dark:hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {skills && skills.length > 0 ? (
          <div className="relative z-10 flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span key={skill}
                className="group/skill relative px-4 py-2 text-xs font-semibold bg-gray-50/50 dark:bg-slate-800/30 text-gray-700 dark:text-slate-300 rounded-lg border border-black/[0.05] dark:border-white/10 hover:-translate-y-0.5 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300 hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300 cursor-default overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-full group-hover/skill:animate-[shimmer_1.5s_infinite]" />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-slate-400 text-center py-4">No skills added yet.</p>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
