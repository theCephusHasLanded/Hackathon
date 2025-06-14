import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../utils/projectData'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const [animatedStats, setAnimatedStats] = useState({
    participants: 0,
    prizePool: 0,
    activeProjects: 0
  })

  const finalStats = {
    participants: 50000,
    prizePool: 100000,
    activeProjects: 24
  }

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps

        setAnimatedStats({
          participants: Math.floor(finalStats.participants * progress),
          prizePool: Math.floor(finalStats.prizePool * progress),
          activeProjects: Math.floor(finalStats.activeProjects * progress)
        })

        if (step >= steps) {
          clearInterval(timer)
          setAnimatedStats(finalStats)
        }
      }, interval)

      return () => clearInterval(timer)
    }

    const timeout = setTimeout(animateStats, 500)
    return () => clearTimeout(timeout)
  }, [])

  const featuredProjects = projects.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="home"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="header"
        >
          <h1>LKHN Technologies Hackathon</h1>
          <p>Building the future through innovation and collaboration. Join our community of builders creating solutions for tomorrow.</p>

          <div className="stats">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="stat"
            >
              <span className="stat-number">{(animatedStats.participants / 1000).toFixed(0)}K+</span>
              <span className="stat-label">Participants</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="stat"
            >
              <span className="stat-number">${(animatedStats.prizePool / 1000).toFixed(0)}K</span>
              <span className="stat-label">Prize Pool</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="stat"
            >
              <span className="stat-number">{animatedStats.activeProjects}</span>
              <span className="stat-label">Active Projects</span>
            </motion.div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button"
            onClick={() => navigate('/projects')}
          >
            Explore Projects
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="featured-section"
        >
          <h2 className="section-title">Featured Projects</h2>
          
          <div className="projects-grid">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="view-all-container"
          >
            <button
              className="view-all-button"
              onClick={() => navigate('/projects')}
            >
              View All Projects
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home