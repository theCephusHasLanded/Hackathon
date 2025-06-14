import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Folder, Info } from 'lucide-react'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/projects', icon: Folder, label: 'Projects' },
    { path: '/about', icon: Info, label: 'About' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">
          <motion.h2
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LKHN Hackathon
          </motion.h2>
        </Link>
      </div>
      
      <div className="nav-links">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="nav-item"
            >
              <Icon size={20} />
              <span>{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navigation