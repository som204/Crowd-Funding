import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../lib/storage'

export function Discover() {
  const [projectList, setProjectList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allProjects = projects.getAll()
    setProjectList(allProjects)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Discover Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectList.map(project => (
          <Link key={project.id} to={`/project/${project.id}`}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  )
}