import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ProjectCard } from '../components/ProjectCard'
import { projects, pledges } from '../lib/storage'

export function Dashboard() {
  const { user } = useAuth()
  const [userProjects, setUserProjects] = useState([])
  const [userPledges, setUserPledges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Fetch user's projects and pledges
    const createdProjects = projects.getByCreator(user.id)
    const userPledges = pledges.getByBacker(user.id)
    const pledgedProjects = userPledges.map(pledge => {
      const project = projects.getById(pledge.project_id)
      return project
    })

    setUserProjects(createdProjects)
    setUserPledges(pledgedProjects)
    setLoading(false)
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Please log in to view your dashboard</h2>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link
          to="/start-project"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create New Project
        </Link>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">My Projects</h2>
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map(project => (
                <Link key={project.id} to={`/project/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't created any projects yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Backed Projects</h2>
          {userPledges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPledges.map(project => (
                <Link key={project.id} to={`/project/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't backed any projects yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}