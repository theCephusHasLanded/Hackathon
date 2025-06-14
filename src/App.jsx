import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Navigation from './components/Navigation'
import './App.css'

function App() {
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
        </Routes>
      </motion.main>
    </div>
  )
}

export default App