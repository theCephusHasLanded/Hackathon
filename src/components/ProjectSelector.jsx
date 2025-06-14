import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Users, Calendar, Award, Search, Filter } from 'lucide-react'
import useStore from '../store/useStore'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import './ProjectSelector.css'

const ProjectSelector = ({ onComplete }) => {
  const { user } = useSupabaseAuth()
  const {
    projects,
    selectedProjects,
    loading,
    fetchProjects,
    setSelectedProjects,
    selectProjectsForUser
  } = useStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [localSelectedProjects, setLocalSelectedProjects] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter
    const matchesDifficulty = difficultyFilter === 'all' || project.difficulty.toLowerCase() === difficultyFilter

    return matchesSearch && matchesStatus && matchesDifficulty
  })

  const handleProjectToggle = (projectId) => {
    setLocalSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId)
      } else {
        return [...prev, projectId]
      }
    })
  }

  const handleConfirmSelection = async () => {
    if (!user || localSelectedProjects.length === 0) {
      alert('Please select at least one project')
      return
    }

    try {
      const { data, error } = await selectProjectsForUser(user.id, localSelectedProjects)
      
      if (error) {
        alert('Error selecting projects: ' + error.message)
        return
      }

      alert(`Successfully selected ${localSelectedProjects.length} project(s)! A confirmation email will be sent shortly.`)
      
      if (onComplete) {
        onComplete(data)
      }
    } catch (err) {
      alert('Error selecting projects: ' + err.message)
    }
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

  if (loading.projects) {
    return (
      <div className="project-selector-loading">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="project-selector"
    >
      <div className="project-selector-header">
        <h2>Select Your Projects</h2>
        <p>Choose the projects you're interested in participating in. You can select multiple projects.</p>
      </div>

      <div className="project-selector-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="future">Future</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`project-selection-card ${
              localSelectedProjects.includes(project.id) ? 'selected' : ''
            }`}
            onClick={() => handleProjectToggle(project.id)}
          >
            <div className="selection-indicator">
              {localSelectedProjects.includes(project.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="check-icon"
                >
                  <Check size={16} />
                </motion.div>
              )}
            </div>

            <div className="project-content">
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
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

              <p className="project-description">{project.description}</p>
              
              <div className="project-tags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="tag">{tag}</span>
                ))}
              </div>

              <div className="project-meta">
                <div className="meta-item">
                  <Users size={16} />
                  <span>{project.team_size} team</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{project.duration}</span>
                </div>
                {project.mentor && (
                  <div className="meta-item">
                    <Award size={16} />
                    <span>{project.mentor}</span>
                  </div>
                )}
              </div>

              <div className="participant-count">
                <span>{project.current_participants || 0} / {project.max_participants || 100} participants</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${((project.current_participants || 0) / (project.max_participants || 100)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="no-projects">
          <h3>No projects found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      )}

      <div className="selection-summary">
        <div className="summary-content">
          <span className="selected-count">
            {localSelectedProjects.length} project{localSelectedProjects.length !== 1 ? 's' : ''} selected
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="confirm-selection-button"
            onClick={handleConfirmSelection}
            disabled={localSelectedProjects.length === 0 || loading.projectSelection}
          >
            {loading.projectSelection ? 'Confirming...' : 'Confirm Selection'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectSelector