import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users, Calendar } from 'lucide-react'
import './ProjectCard.css'

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active'
      case 'planning':
        return 'status-planning'
      case 'future':
        return 'status-future'
      default:
        return 'status-planning'
    }
  }

  const handleJoinProject = (e) => {
    e.stopPropagation()
    alert(`Joining project: ${project.title}\n\nYou'll be redirected to the project workspace.`)
  }

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="project-card"
      onClick={handleCardClick}
    >
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        
        <div className="project-tags">
          {project.tags.map((tag, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="tag"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <div className="project-meta">
          <div className="meta-item">
            <Users size={16} />
            <span>{project.teamSize || '4-6'} members</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>{project.duration || '2 weeks'}</span>
          </div>
        </div>

        <div className="project-details">
          <span className={`project-status ${getStatusClass(project.status)}`}>
            {project.status}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="join-project"
            onClick={handleJoinProject}
          >
            Join Project
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard