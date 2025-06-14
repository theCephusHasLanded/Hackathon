import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Calendar, Award, CheckCircle } from 'lucide-react'
import { projects } from '../utils/projectData'
import './ProjectDetail.css'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.id === parseInt(id))

  if (!project) {
    return (
      <div className="project-detail">
        <div className="container">
          <h1>Project not found</h1>
          <button onClick={() => navigate('/projects')}>Back to Projects</button>
        </div>
      </div>
    )
  }

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#28a745'
      case 'intermediate':
        return '#ffc107'
      case 'advanced':
        return '#fd7e14'
      case 'expert':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  const handleJoinProject = () => {
    alert(`Joining project: ${project.title}\n\nYou'll be redirected to the project workspace.`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="project-detail"
    >
      <div className="container">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="back-button"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft size={20} />
          Back to Projects
        </motion.button>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="project-header"
        >
          <div className="project-title-section">
            <h1>{project.title}</h1>
            <div className="project-badges">
              <span className={`project-status ${getStatusClass(project.status)}`}>
                {project.status}
              </span>
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(project.difficulty) }}
              >
                {project.difficulty}
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="join-button-large"
            onClick={handleJoinProject}
          >
            Join This Project
          </motion.button>
        </motion.div>

        <div className="project-content">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="project-main"
          >
            <div className="project-description-section">
              <h2>Project Description</h2>
              <p>{project.description}</p>
            </div>

            <div className="project-objectives">
              <h2>Objectives</h2>
              <ul>
                {project.objectives.map((objective, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <CheckCircle size={16} />
                    {objective}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="technologies-section">
              <h2>Technologies</h2>
              <div className="tech-tags">
                {project.technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    className="tech-tag"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="prerequisites-section">
              <h2>Prerequisites</h2>
              <ul>
                {project.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="project-sidebar"
          >
            <div className="project-info-card">
              <h3>Project Information</h3>
              
              <div className="info-item">
                <Users size={20} />
                <div>
                  <span className="info-label">Team Size</span>
                  <span className="info-value">{project.teamSize} members</span>
                </div>
              </div>

              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Duration</span>
                  <span className="info-value">{project.duration}</span>
                </div>
              </div>

              <div className="info-item">
                <Award size={20} />
                <div>
                  <span className="info-label">Mentor</span>
                  <span className="info-value">{project.mentor}</span>
                </div>
              </div>
            </div>

            <div className="project-tags-card">
              <h3>Project Tags</h3>
              <div className="tags-list">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectDetail