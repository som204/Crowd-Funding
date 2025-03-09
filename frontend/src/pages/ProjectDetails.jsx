import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { projects, pledges } from '../lib/storage'
import { format } from 'date-fns'

export function ProjectDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pledgeAmount, setPledgeAmount] = useState('')

  useEffect(() => {
    const projectData = projects.getById(id)
    setProject(projectData)
    setLoading(false)
  }, [id])

  const handlePledge = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to make a pledge')
      return
    }

    try {
      pledges.create({
        project_id: id,
        backer_id: user.id,
        amount: parseFloat(pledgeAmount)
      })

      // Refresh project data
      const updatedProject = projects.getById(id)
      setProject(updatedProject)
      setPledgeAmount('')
      alert('Thank you for your pledge!')
    } catch (error) {
      console.error('Error making pledge:', error)
      alert('Failed to make pledge. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
      </div>
    )
  }

  const progress = (project.current_amount / project.goal_amount) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img 
        src={project.image_url} 
        alt={project.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
      />
      
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-8">{project.description}</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">${project.current_amount.toLocaleString()}</p>
            <p className="text-gray-600">pledged of ${project.goal_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{project.backer_count}</p>
            <p className="text-gray-600">backers</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{format(new Date(project.end_date), 'MMM dd')}</p>
            <p className="text-gray-600">end date</p>
          </div>
        </div>

        {user && (
          <form onSubmit={handlePledge} className="mt-6">
            <div className="flex gap-4">
              <input
                type="number"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 rounded-md border-gray-300"
                min="1"
                step="0.01"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Back this project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}