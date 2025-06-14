import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import useStore from './store/useStore'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Navigation from './components/Navigation'
import AuthModal from './components/auth/AuthModal'
import './App.css'

function App() {
  const { user, session, loading } = useSupabaseAuth()
  const { setAuth, setupRealtimeSubscriptions, cleanupSubscriptions } = useStore()

  // Update store when auth state changes
  React.useEffect(() => {
    setAuth(user, session)
    
    if (user) {
      setupRealtimeSubscriptions(user.id)
    } else {
      cleanupSubscriptions()
    }
  }, [user, session, setAuth, setupRealtimeSubscriptions, cleanupSubscriptions])

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <Navigation />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </motion.main>
      <AuthModal />
    </div>
  )
}

export default App