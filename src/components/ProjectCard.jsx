import { format } from 'date-fns'

export function ProjectCard({ project }) {
  const progress = (project.current_amount / project.goal_amount) * 100

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={project.image_url} 
        alt={project.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{project.description}</p>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>${project.current_amount.toLocaleString()}</span>
            <span>{Math.round(progress)}% of ${project.goal_amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{format(new Date(project.end_date), 'MMM dd, yyyy')}</span>
          <span>{project.backer_count} backers</span>
        </div>
      </div>
    </div>
  )
}