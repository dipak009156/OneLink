import RepoCard from './RepoCard'

const ReposSection = ({ repos }) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-900 mb-3">GitHub Repositories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {repos && repos.length > 0 ? (
          repos.map(repo => (
            <RepoCard key={repo.name} repo={repo} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">No public repositories found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReposSection