const SkillsSection = ({ skills }) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-900 mb-3">Skills</h2>
      <div className="bg-white rounded-xl border border-black/[0.05] p-4">
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill}
                className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 rounded-full border border-black/[0.03] hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 text-center py-4">No skills added yet.</p>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
