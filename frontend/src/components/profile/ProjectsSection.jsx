import ProjectCard from './ProjectCard'

const ProjectsSection = ({ projects }) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-900 mb-3">Featured Projects</h2>
      <div className="space-y-3">
        {projects && projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project._id || project.id || project.name} project={project} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">No projects added yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectsSection