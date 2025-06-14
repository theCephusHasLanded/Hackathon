import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Folder, Info, User, LogOut, Dashboard } from 'lucide-react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import useStore from '../store/useStore'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const { user, signOut } = useSupabaseAuth()
  const { openAuthModal } = useStore()

  const publicNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/projects', icon: Folder, label: 'Projects' },
    { path: '/about', icon: Info, label: 'About' }
  ]

  const userNavItems = [
    { path: '/dashboard', icon: Dashboard, label: 'Dashboard' }
  ]

  const handleSignOut = async () => {
    await signOut()
  }

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
      
      <div className="nav-content">
        <div className="nav-links">
          {publicNavItems.map(({ path, icon: Icon, label }) => (
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
          
          {user && userNavItems.map(({ path, icon: Icon, label }) => (
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

        <div className="nav-auth">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <User size={16} />
                <span className="user-name">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="sign-out-button"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </motion.button>
            </div>
          ) : (
            <div className="auth-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="auth-button sign-in"
                onClick={() => openAuthModal('signin')}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="auth-button sign-up"
                onClick={() => openAuthModal('signup')}
              >
                Sign Up
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation