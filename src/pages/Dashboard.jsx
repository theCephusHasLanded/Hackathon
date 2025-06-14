import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import useStore from '../store/useStore'
import ProjectSelector from '../components/ProjectSelector'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useSupabaseAuth()
  const { 
    userProjects, 
    projects, 
    fetchUserProjects, 
    fetchProjects,
    openAuthModal 
  } = useStore()

  const [showProjectSelector, setShowProjectSelector] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserProjects(user.id)
      fetchProjects()
    }
  }, [user, fetchUserProjects, fetchProjects])

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="dashboard-unauthorized"
      >
        <div className="container">
          <div className="unauthorized-content">
            <h1>Access Restricted</h1>
            <p>Please sign in to access your dashboard and manage your project selections.</p>
            <div className="auth-actions">
              <button 
                className="auth-cta-button"
                onClick={() => openAuthModal('signin')}
              >
                Sign In
              </button>
              <button 
                className="auth-cta-button secondary"
                onClick={() => openAuthModal('signup')}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const handleProjectSelectionComplete = (selectedProjects) => {
    setShowProjectSelector(false)
    fetchUserProjects(user.id)
  }

  if (showProjectSelector) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <ProjectSelector onComplete={handleProjectSelectionComplete} />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-page"
    >
      <div className="container">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="dashboard-header"
        >
          <h1>Welcome back, {user.user_metadata?.full_name || user.email}!</h1>
          <p>Manage your project selections and track your hackathon progress</p>
        </motion.div>

        <div className="dashboard-content">
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="user-stats"
          >
            <div className="stat-card">
              <h3>Projects Selected</h3>
              <span className="stat-number">{userProjects.length}</span>
            </div>
            <div className="stat-card">
              <h3>Account Created</h3>
              <span className="stat-text">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="stat-card">
              <h3>Auth Provider</h3>
              <span className="stat-text">
                {user.app_metadata?.provider === 'google' ? 'Google' : 'Email'}
              </span>
            </div>
          </motion.section>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="selected-projects-section"
          >
            <div className="section-header">
              <h2>Your Selected Projects</h2>
              <button 
                className="manage-projects-button"
                onClick={() => setShowProjectSelector(true)}
              >
                {userProjects.length > 0 ? 'Manage Selections' : 'Select Projects'}
              </button>
            </div>

            {userProjects.length > 0 ? (
              <div className="selected-projects-grid">
                {userProjects.map((userProject, index) => (
                  <motion.div
                    key={userProject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="selected-project-card"
                  >
                    <div className="project-info">
                      <h3>{userProject.projects.title}</h3>
                      <p>{userProject.projects.description}</p>
                      
                      <div className="project-tags">
                        {userProject.projects.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">{tag}</span>
                        ))}
                      </div>

                      <div className="project-meta">
                        <span className={`status ${userProject.projects.status}`}>
                          {userProject.projects.status}
                        </span>
                        <span className="difficulty">
                          {userProject.projects.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="selection-info">
                      <p className="selected-date">
                        Selected on {new Date(userProject.selected_at).toLocaleDateString()}
                      </p>
                      <span className={`selection-status ${userProject.status}`}>
                        {userProject.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="no-projects-selected"
              >
                <h3>No Projects Selected Yet</h3>
                <p>
                  Browse our exciting projects and select the ones you'd like to participate in. 
                  You can choose multiple projects based on your interests and skills.
                </p>
                <button 
                  className="select-projects-cta"
                  onClick={() => setShowProjectSelector(true)}
                >
                  Browse & Select Projects
                </button>
              </motion.div>
            )}
          </motion.section>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="account-section"
          >
            <h2>Account Information</h2>
            <div className="account-info">
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Full Name:</span>
                <span className="value">
                  {user.user_metadata?.full_name || 'Not provided'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">User ID:</span>
                <span className="value">{user.id}</span>
              </div>
              <div className="info-row">
                <span className="label">Email Verified:</span>
                <span className={`value ${user.email_confirmed_at ? 'verified' : 'pending'}`}>
                  {user.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard